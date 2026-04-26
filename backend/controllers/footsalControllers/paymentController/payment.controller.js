
const crypto = require("crypto");
const { QueryTypes } = require("sequelize");
const { sequelize, FutsalPaymentConfig, Footsal } = require("../../../models");
const {
    createEsewaPayment_user_futsal
} = require("../../../services/esewa/usersToFutsal.esewa.service");
const {
    initiateKhaltiPayment,
    verifyKhaltiPayment
} = require("../../../services/khalti/usersToFutsal.khalti.service");

const VALID_GATEWAYS = new Set(["cash", "khalti", "esewa", "bank_transfer"]);
const VALID_STATUSES = new Set(["pending", "success", "failed", "refunded"]);
const CONFIG_GATEWAYS = new Set(["khalti", "esewa"]);

const normalizeTenantCode = (code) => {
    const value = String(code || "").trim();
    return /^\d+$/.test(value) ? value : null;
};

const paymentTableName = (code) => `payment_${code}`;
const bookingTableName = (code) => `booking_${code}`;

const extractSecretKey = (secretEncrypted) => {
    if (!secretEncrypted) {
        return null;
    }

    if (Buffer.isBuffer(secretEncrypted)) {
        return secretEncrypted.toString("utf8").trim();
    }

    if (
        typeof secretEncrypted === "object" &&
        secretEncrypted.type === "Buffer" &&
        Array.isArray(secretEncrypted.data)
    ) {
        return Buffer.from(secretEncrypted.data).toString("utf8").trim();
    }

    return String(secretEncrypted).trim();
};

const resolveTenantContext = async (req) => {
    const tenant = req.tenant || {};
    const body = req.body || {};
    const params = req.params || {};

    let futsalId = tenant.futsalId || req.futsalId || params.futsalId || body.futsalId;
    let code = tenant.code || req.futsalCode || params.futsalCode || body.futsalCode;

    code = normalizeTenantCode(code);

    if (!code && Number.isInteger(Number(futsalId))) {
        const futsal = await Footsal.findByPk(Number(futsalId), {
            attributes: ["id", "futsalCode"]
        });

        if (futsal) {
            futsalId = futsal.id;
            code = normalizeTenantCode(futsal.futsalCode);
        }
    }

    if (!Number.isInteger(Number(futsalId)) && code) {
        const futsal = await Footsal.findOne({
            where: { futsalCode: Number(code) },
            attributes: ["id", "futsalCode"]
        });

        if (futsal) {
            futsalId = futsal.id;
            code = normalizeTenantCode(futsal.futsalCode);
        }
    }

    if (!Number.isInteger(Number(futsalId)) || !code) {
        return null;
    }

    return {
        futsalId: Number(futsalId),
        code
    };
};

const getGatewayConfig = async ({ futsalId, gateway }) => {
    const config = await FutsalPaymentConfig.findOne({
        where: {
            futsalId,
            gateway,
            isActive: true
        },
        order: [["id", "DESC"]]
    });

    if (!config) {
        return null;
    }

    return {
        gateway: config.gateway,
        publicKey: config.publicKey,
        secretKey: extractSecretKey(config.secretEncrypted),
        merchantCode: config.merchantCode,
        isLive: Boolean(config.isLive)
    };
};

const getUserBasicInfo = async (userId) => {
    const users = await sequelize.query(
        `SELECT username, email, phoneNumber FROM users WHERE id = ? LIMIT 1`,
        {
            replacements: [userId],
            type: QueryTypes.SELECT
        }
    );

    return users[0] || {
        username: "User",
        email: "",
        phoneNumber: ""
    };
};

const parseBoolean = (value, defaultValue = false) => {
    if (value === undefined || value === null) return defaultValue;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;
    const normalized = String(value).toLowerCase().trim();
    return normalized === "true" || normalized === "1" || normalized === "yes";
};

const maskSecret = (secret) => {
    if (!secret) return null;
    const value = String(secret);
    if (value.length <= 4) return "****";
    return `${"*".repeat(value.length - 4)}${value.slice(-4)}`;
};

// by futsal owner
const getPaymentConfigs = async (req, res) => {
    try {
        const tenant = await resolveTenantContext(req);
        if (!tenant) {
            return res.status(400).json({
                success: false,
                message: "Valid futsal context is required"
            });
        }

        const gatewayParam = req.params?.gateway ? String(req.params.gateway).toLowerCase().trim() : null;
        if (gatewayParam && !CONFIG_GATEWAYS.has(gatewayParam)) {
            return res.status(400).json({
                success: false,
                message: "Invalid gateway. Allowed: esewa, khalti"
            });
        }

        const whereClause = gatewayParam
            ? { futsalId: tenant.futsalId, gateway: gatewayParam }
            : { futsalId: tenant.futsalId };

        const rows = await FutsalPaymentConfig.findAll({
            where: whereClause,
            order: [["gateway", "ASC"]]
        });

        const data = rows.map((row) => ({
            id: row.id,
            futsalId: row.futsalId,
            gateway: row.gateway,
            publicKey: row.publicKey,
            merchantCode: row.merchantCode,
            isActive: Boolean(row.isActive),
            isLive: Boolean(row.isLive),
            secretKeyMasked: maskSecret(extractSecretKey(row.secretEncrypted)),
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        }));

        if (!gatewayParam) {
            return res.status(200).json({
                success: true,
                message: "Payment configs fetched successfully",
                data,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment config fetched successfully",
            data: data[0] || null,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

// by futsal owner
const upsertPaymentConfig = async (req, res) => {
    try {
        const tenant = await resolveTenantContext(req);
        if (!tenant) {
            return res.status(400).json({
                success: false,
                message: "Valid futsal context is required"
            });
        }

        const gateway = String(req.body?.gateway || "").toLowerCase().trim();
        const secretKey = req.body?.secretKey ? String(req.body.secretKey).trim() : "";
        const publicKey = req.body?.publicKey ? String(req.body.publicKey).trim() : null;
        const merchantCode = req.body?.merchantCode ? String(req.body.merchantCode).trim() : null;
        const isActive = parseBoolean(req.body?.isActive, true);
        const isLive = parseBoolean(req.body?.isLive, false);

        if (!CONFIG_GATEWAYS.has(gateway)) {
            return res.status(400).json({
                success: false,
                message: "Invalid gateway. Allowed: esewa, khalti"
            });
        }

        if (!secretKey) {
            return res.status(400).json({
                success: false,
                message: "secretKey is required"
            });
        }

        if (gateway === "esewa" && !merchantCode) {
            return res.status(400).json({
                success: false,
                message: "merchantCode is required for eSewa"
            });
        }

        const payload = {
            publicKey,
            secretEncrypted: Buffer.from(secretKey),
            merchantCode: gateway === "esewa" ? merchantCode : null,
            isActive,
            isLive,
        };

        let config = await FutsalPaymentConfig.findOne({
            where: {
                futsalId: tenant.futsalId,
                gateway,
            },
        });

        if (!config) {
            config = await FutsalPaymentConfig.create({
                futsalId: tenant.futsalId,
                gateway,
                ...payload,
            });
        } else {
            await config.update(payload);
        }

        return res.status(200).json({
            success: true,
            message: "Payment config saved successfully",
            data: {
                id: config.id,
                futsalId: config.futsalId,
                gateway: config.gateway,
                publicKey: config.publicKey,
                merchantCode: config.merchantCode,
                isActive: Boolean(config.isActive),
                isLive: Boolean(config.isLive),
                secretKeyMasked: maskSecret(extractSecretKey(config.secretEncrypted)),
            },
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

// by futsal owner
const disablePaymentConfig = async (req, res) => {
    try {
        const tenant = await resolveTenantContext(req);
        if (!tenant) {
            return res.status(400).json({
                success: false,
                message: "Valid futsal context is required"
            });
        }

        const gateway = String(req.params?.gateway || "").toLowerCase().trim();
        if (!CONFIG_GATEWAYS.has(gateway)) {
            return res.status(400).json({
                success: false,
                message: "Invalid gateway. Allowed: esewa, khalti"
            });
        }

        const config = await FutsalPaymentConfig.findOne({
            where: {
                futsalId: tenant.futsalId,
                gateway,
            },
        });

        if (!config) {
            return res.status(404).json({
                success: false,
                message: "Payment config not found",
            });
        }

        await config.update({ isActive: false });

        return res.status(200).json({
            success: true,
            message: "Payment config disabled successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

// by futsal
const getPayments = async (req, res) => {
    try {
        const tenant = await resolveTenantContext(req);
        if (!tenant) {
            return res.status(400).json({
                success: false,
                message: "Valid futsal context is required"
            });
        }

        const payments = await sequelize.query(
            `SELECT * FROM ${paymentTableName(tenant.code)} ORDER BY created_at DESC`,
            {
                type: QueryTypes.SELECT
            }
        );

        return res.status(200).json({
            success: true,
            message: "Payments fetched successfully",
            data: payments
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

// by futsal + user info
const getPaymentById = async (req, res) => {
    try {
        const tenant = await resolveTenantContext(req);
        if (!tenant) {
            return res.status(400).json({
                success: false,
                message: "Valid futsal context is required"
            });
        }

        const paymentId = Number(req.params.paymentId);
        if (!Number.isInteger(paymentId) || paymentId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid paymentId is required"
            });
        }

        const rows = await sequelize.query(
            `SELECT p.*, u.id AS userId, u.username, u.email, u.phoneNumber
             FROM ${paymentTableName(tenant.code)} p
             LEFT JOIN users u ON u.id = p.user_id
             WHERE p.id = ?
             LIMIT 1`,
            {
                replacements: [paymentId],
                type: QueryTypes.SELECT
            }
        );

        const row = rows[0];
        if (!row) {
            return res.status(404).json({
                success: false,
                message: "No payment found with this id"
            });
        }

        const payment = {
            ...row,
            user: row.userId
                ? {
                        id: row.userId,
                        username: row.username,
                        email: row.email,
                        phoneNumber: row.phoneNumber
                    }
                : null
        };

        delete payment.userId;
        delete payment.username;
        delete payment.email;
        delete payment.phoneNumber;

        return res.status(200).json({
            success: true,
            message: "Payment fetched successfully",
            data: payment
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

// by user
const getUserPayments = async (req, res) => {
    try {
        const tenant = await resolveTenantContext(req);
        if (!tenant) {
            return res.status(400).json({
                success: false,
                message: "Valid futsal context is required"
            });
        }

        const userId = Number(req.userId || req.body?.userId || req.body?.user_id);
        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid userId is required"
            });
        }

        const payments = await sequelize.query(
            `SELECT * FROM ${paymentTableName(tenant.code)} WHERE user_id = ? ORDER BY created_at DESC`,
            {
                replacements: [userId],
                type: QueryTypes.SELECT
            }
        );

        return res.status(200).json({
            success: true,
            message: "User payments fetched successfully",
            data: payments
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

// by user
const getPaymentByBookingId = async (req, res) => {
    try {
        const tenant = await resolveTenantContext(req);
        if (!tenant) {
            return res.status(400).json({
                success: false,
                message: "Valid futsal context is required"
            });
        }

        const userId = Number(req.userId || req.body?.userId || req.body?.user_id);
        const bookingId = Number(req.params.bookingId);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid userId is required"
            });
        }

        if (!Number.isInteger(bookingId) || bookingId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid bookingId is required"
            });
        }

        const rows = await sequelize.query(
            `SELECT p.*, u.id AS userId, u.username, u.email, u.phoneNumber
             FROM ${paymentTableName(tenant.code)} p
             LEFT JOIN users u ON u.id = p.user_id
             WHERE p.booking_id = ? AND p.user_id = ?
             ORDER BY p.created_at DESC
             LIMIT 1`,
            {
                replacements: [bookingId, userId],
                type: QueryTypes.SELECT
            }
        );

        const row = rows[0];
        if (!row) {
            return res.status(404).json({
                success: false,
                message: "No payment found for this booking"
            });
        }

        const payment = {
            ...row,
            user: row.userId
                ? {
                        id: row.userId,
                        username: row.username,
                        email: row.email,
                        phoneNumber: row.phoneNumber
                    }
                : null
        };

        delete payment.userId;
        delete payment.username;
        delete payment.email;
        delete payment.phoneNumber;

        return res.status(200).json({
            success: true,
            message: "Booking payment fetched successfully",
            data: payment
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

const createPayment = async (req, res) => {
    try {
        const tenant = await resolveTenantContext(req);
        if (!tenant) {
            return res.status(400).json({
                success: false,
                message: "Valid futsal context is required"
            });
        }

        const userId = Number(req.userId || req.body?.userId || req.body?.user_id);
        const bookingId = Number(req.body?.booking_id);
        const gateway = String(req.body?.gateway || "").toLowerCase().trim();

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid userId is required"
            });
        }

        if (!Number.isInteger(bookingId) || bookingId <= 0 || !gateway) {
            return res.status(400).json({
                success: false,
                message: "booking_id and gateway are required"
            });
        }

        if (!VALID_GATEWAYS.has(gateway)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment gateway"
            });
        }

        const booking = await sequelize.query(
            `SELECT id, user_id, amount FROM ${bookingTableName(tenant.code)} WHERE id = ? LIMIT 1`,
            {
                replacements: [bookingId],
                type: QueryTypes.SELECT
            }
        );

        if (!booking[0]) {
            return res.status(404).json({
                success: false,
                message: "Booking not found for this futsal"
            });
        }

        if (Number(booking[0].user_id) !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only pay for your own booking"
            });
        }

        const amount = Number(req.body?.amount ?? booking[0].amount);
        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid amount is required"
            });
        }

        let providerOrderId = req.body?.provider_order_id
            ? String(req.body.provider_order_id).trim()
            : null;
        let providerTxnId = req.body?.provider_txn_id
            ? String(req.body.provider_txn_id).trim()
            : null;
        let gatewayResponse = null;
        let rawResponse = null;
        let isLive = false;

        if (gateway === "cash") {
            if (providerOrderId || providerTxnId) {
                return res.status(400).json({
                    success: false,
                    message: "provider_order_id and provider_txn_id should not be provided for cash payments"
                });
            }

            providerOrderId = null;
            providerTxnId = null;
        } else if (gateway === "bank_transfer") {
            if (!providerOrderId) {
                return res.status(400).json({
                    success: false,
                    message: "provider_order_id is required for bank transfer payments"
                });
            }

            if (providerTxnId) {
                return res.status(400).json({
                    success: false,
                    message: "provider_txn_id should not be provided for bank transfer payments"
                });
            }

            providerTxnId = null;
        } else {
            const paymentConfig = await getGatewayConfig({
                futsalId: tenant.futsalId,
                gateway
            });
            
            if (paymentConfig) isLive = paymentConfig.isLive;

            if (!paymentConfig) {
                return res.status(400).json({
                    success: false,
                    message: `Active ${gateway} payment configuration not found for this futsal`
                });
            }

            if (!paymentConfig.secretKey) {
                return res.status(400).json({
                    success: false,
                    message: `${gateway} secret key is missing in payment configuration`
                });
            }

            const transactionUuid = crypto.randomUUID();
            providerOrderId = transactionUuid;

            if (gateway === "esewa") {
                if (!paymentConfig.merchantCode) {
                    return res.status(400).json({
                        success: false,
                        message: "eSewa merchant code is missing in payment configuration"
                    });
                }

                gatewayResponse = createEsewaPayment_user_futsal({
                    amount,
                    transactionUuid,
                    merchantCode: paymentConfig.merchantCode,
                    secretKey: paymentConfig.secretKey
                });

                rawResponse = gatewayResponse;
            }

            if (gateway === "khalti") {
                const user = await getUserBasicInfo(userId);
                const khaltiResponse = await initiateKhaltiPayment({
                    amount,
                    transactionUuid,
                    user,
                    secretKey: paymentConfig.secretKey
                });

                rawResponse = khaltiResponse;

                if (!khaltiResponse?.payment_url || !khaltiResponse?.pidx) {
                    return res.status(400).json({
                        success: false,
                        message: "Khalti payment initiation failed",
                        error: khaltiResponse
                    });
                }

                providerTxnId = khaltiResponse.pidx;
                gatewayResponse = {
                    payment_url: khaltiResponse.payment_url,
                    pidx: khaltiResponse.pidx,
                    expires_at: khaltiResponse.expires_at || null
                };
            }
        }

        if (providerTxnId) {
            const existingPayment = await sequelize.query(
                `SELECT id FROM ${paymentTableName(tenant.code)} WHERE provider_txn_id = ? AND gateway = ? LIMIT 1`,
                {
                    replacements: [providerTxnId, gateway],
                    type: QueryTypes.SELECT
                }
            );

            if (existingPayment[0]) {
                return res.status(409).json({
                    success: false,
                    message: "Payment with this provider_txn_id and gateway already exists"
                });
            }
        }

        const insertResult = await sequelize.query(
            `INSERT INTO ${paymentTableName(tenant.code)}
            (booking_id, user_id, gateway, provider_order_id, provider_txn_id, amount, status, raw_response)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            {
                replacements: [
                    bookingId,
                    userId,
                    gateway,
                    providerOrderId,
                    providerTxnId,
                    amount,
                    "pending",
                    rawResponse ? JSON.stringify(rawResponse) : null
                ],
                type: QueryTypes.INSERT
            }
        );

        let paymentId = Array.isArray(insertResult) ? insertResult[0] : insertResult;

        if (!paymentId && providerOrderId) {
            const inserted = await sequelize.query(
                `SELECT id FROM ${paymentTableName(tenant.code)} WHERE provider_order_id = ? AND gateway = ? ORDER BY id DESC LIMIT 1`,
                {
                    replacements: [providerOrderId, gateway],
                    type: QueryTypes.SELECT
                }
            );
            paymentId = inserted[0]?.id;
        }

        const payment = paymentId
            ? await sequelize.query(
                    `SELECT * FROM ${paymentTableName(tenant.code)} WHERE id = ?`,
                    {
                        replacements: [paymentId],
                        type: QueryTypes.SELECT
                    }
                )
            : [];

        const responsePayload = {
            success: true,
            message: `${gateway} payment created successfully`,
            data: {
                ...(payment[0] || {}),
                ...(gatewayResponse || {}),
                isLive
            }
        };

        return res.status(201).json(responsePayload);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const tenant = await resolveTenantContext(req);
        if (!tenant) {
            return res.status(400).json({
                success: false,
                message: "Valid futsal context is required"
            });
        }

        const paymentIdParam = req.params?.paymentId || req.body?.paymentId;
        const pidxFromReq = req.body?.pidx;

        let payment = null;
        if (Number.isInteger(Number(paymentIdParam)) && Number(paymentIdParam) > 0) {
            const paymentRows = await sequelize.query(
                `SELECT * FROM ${paymentTableName(tenant.code)} WHERE id = ? LIMIT 1`,
                {
                    replacements: [Number(paymentIdParam)],
                    type: QueryTypes.SELECT
                }
            );
            payment = paymentRows[0];
        }

        // If not found by ID, try finding by provider_txn_id (pidx etc.) or transaction_uuid
        if (!payment) {
            const lookupValue = pidxFromReq || paymentIdParam;
            if (lookupValue) {
                const paymentRows = await sequelize.query(
                    `SELECT * FROM ${paymentTableName(tenant.code)} 
                     WHERE provider_txn_id = ? OR provider_order_id = ? LIMIT 1`,
                    {
                        replacements: [lookupValue, lookupValue],
                        type: QueryTypes.SELECT
                    }
                );
                payment = paymentRows[0];
            }
        }

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "No payment found with this ID or transaction identifier"
            });
        }
        
        const paymentId = payment.id;

        if (payment.status === "success") {
            return res.status(400).json({
                success: false,
                message: "Payment is already verified"
            });
        }

        let nextStatus = "failed";
        let providerTxnId = payment.provider_txn_id || null;
        let verificationResponse = null;

        if (payment.gateway === "khalti") {
            const paymentConfig = await getGatewayConfig({
                futsalId: tenant.futsalId,
                gateway: "khalti"
            });

            if (!paymentConfig || !paymentConfig.secretKey) {
                return res.status(400).json({
                    success: false,
                    message: "Khalti payment configuration not found for this futsal"
                });
            }

            const pidx = req.body?.pidx || payment.provider_txn_id;
            if (!pidx) {
                return res.status(400).json({
                    success: false,
                    message: "pidx is required for Khalti verification"
                });
            }

            const khaltiResponse = await verifyKhaltiPayment({
                pidx,
                secretKey: paymentConfig.secretKey
            });

            verificationResponse = khaltiResponse;
            providerTxnId = payment.provider_txn_id || pidx;

            const khaltiStatus = String(khaltiResponse?.status || "").toLowerCase();
            if (khaltiStatus === "completed" || khaltiStatus === "complete") {
                nextStatus = "success";
            } else if (khaltiStatus === "pending" || khaltiStatus === "initiated") {
                nextStatus = "pending";
            } else {
                nextStatus = "failed";
            }
        } else if (payment.gateway === "esewa") {
            const paymentConfig = await getGatewayConfig({
                futsalId: tenant.futsalId,
                gateway: "esewa"
            });

            if (!paymentConfig) {
                return res.status(400).json({
                    success: false,
                    message: "eSewa payment configuration not found for this futsal"
                });
            }

            const callbackData = req.body?.data;
            if (!callbackData) {
                return res.status(400).json({
                    success: false,
                    message: "eSewa callback data is required"
                });
            }

            let decodedData;
            if (typeof callbackData === "string") {
                try {
                    decodedData = JSON.parse(Buffer.from(callbackData, "base64").toString("utf-8"));
                } catch (decodeError) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid eSewa callback data"
                    });
                }
            } else if (typeof callbackData === "object" && callbackData !== null) {
                decodedData = callbackData;
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid eSewa callback data"
                });
            }

            verificationResponse = decodedData;

            const callbackUuid = String(decodedData.transaction_uuid || "");
            if (payment.provider_order_id && callbackUuid && payment.provider_order_id !== callbackUuid) {
                return res.status(400).json({
                    success: false,
                    message: "eSewa transaction UUID mismatch"
                });
            }

            const callbackAmount = Number(
                decodedData.total_amount !== undefined ? decodedData.total_amount : decodedData.amount
            );

            if (Number.isFinite(callbackAmount) && Number(callbackAmount) !== Number(payment.amount)) {
                return res.status(400).json({
                    success: false,
                    message: "eSewa amount mismatch"
                });
            }

            providerTxnId = decodedData.transaction_code
                ? String(decodedData.transaction_code)
                : payment.provider_txn_id;

            nextStatus = String(decodedData.status || "").toUpperCase() === "COMPLETE" ? "success" : "failed";
        } else {
            // Manual verification (cash, bank_transfer) should only be allowed for admins/futsal owners
            // If the request comes from isUserAuthenticated, they might not have the rights
            // Check if req.user or req.futsal exists to determine role
            if (!req.futsal && !req.futsalCode) {
                return res.status(403).json({
                    success: false,
                    message: "Manual verification is only allowed for administrators"
                });
            }

            const manualStatus = String(req.body?.status || "success").toLowerCase();
            if (!VALID_STATUSES.has(manualStatus)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid payment status"
                });
            }

            nextStatus = manualStatus;
            verificationResponse = req.body?.raw_response || { manually_verified: true };
        }

        await sequelize.query(
            `UPDATE ${paymentTableName(tenant.code)}
             SET status = ?, provider_txn_id = ?, raw_response = ?, verified_at = ?
             WHERE id = ?`,
            {
                replacements: [
                    nextStatus,
                    providerTxnId,
                    verificationResponse ? JSON.stringify(verificationResponse) : payment.raw_response,
                    nextStatus === "success" ? new Date() : null,
                    paymentId
                ],
                type: QueryTypes.UPDATE
            }
        );

        // Update booking status if payment is successful
        if (nextStatus === "success" && payment.booking_id) {
            await sequelize.query(
                `UPDATE booking_${tenant.code} SET status = 'confirmed' WHERE id = ?`,
                {
                    replacements: [payment.booking_id],
                    type: QueryTypes.UPDATE
                }
            );
        }

        const updatedPayment = await sequelize.query(
            `SELECT * FROM ${paymentTableName(tenant.code)} WHERE id = ? LIMIT 1`,
            {
                replacements: [paymentId],
                type: QueryTypes.SELECT
            }
        );

        return res.status(200).json({
            success: nextStatus === "success",
            message:
                nextStatus === "success"
                    ? "Payment verified successfully"
                    : "Payment verification completed with non-success status",
            data: updatedPayment[0]
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

module.exports = {
    getPayments,
    getPaymentById,
    getUserPayments,
    createPayment,
    verifyPayment,
    getPaymentByBookingId,
    getPaymentConfigs,
    upsertPaymentConfig,
    disablePaymentConfig,
};
