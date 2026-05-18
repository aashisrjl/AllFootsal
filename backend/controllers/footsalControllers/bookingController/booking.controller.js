const { sequelize, Footsal, User } = require("../../../models")
const {QueryTypes} = require("sequelize");
const sendEmail = require("../../../services/mail/sendEmail");
const { createUserNotification, createFutsalNotification } = require("../../../services/notifications/notificationService");
const { ensureBookingOfflineColumns } = require("../../../models/footsal_tanents/ensureBookingOfflineColumns");
const {
    isBookingInPast,
    isBookingDateBeforeToday,
} = require("../../../utils/bookingDateUtils");

const PAST_BOOKING_MSG =
    "Cannot modify a booking whose date or timeslot has already passed";

const fetchAdminBookingWithSlot = async (code, bookingId) => {
    const rows = await sequelize.query(
        `SELECT b.*, t.start_time, t.end_time
         FROM booking_${code} b
         JOIN timeslot_${code} t ON b.timeslot_id = t.id
         WHERE b.id = ?`,
        {
            replacements: [bookingId],
            type: QueryTypes.SELECT,
        }
    );
    return rows[0] || null;
};

const respondIfPastOrMissingBooking = (res, row) => {
    if (!row) {
        res.status(404).json({ success: false, message: "Booking not found" });
        return true;
    }
    if (isBookingInPast(row.booking_date, row.end_time)) {
        res.status(400).json({ success: false, message: PAST_BOOKING_MSG });
        return true;
    }
    return false;
};

const normalizePhone = (phone) => {
    const digits = String(phone || "").replace(/\D/g, "");
    if (digits.length === 10) return digits;
    if (digits.length === 13 && digits.startsWith("977")) return digits.slice(-10);
    return null;
};

/** Admin walk-in booking: customer data lives on booking_${code} columns only */
const isOfflineBookingRow = (row) =>
    row?.offline_phone != null && String(row.offline_phone).trim() !== "";

const resolveBookingTenantCode = async (req) => {
    const codeFromReq = req.futsalCode || req.tenant?.code || req.tanent?.code;
    if (codeFromReq) return codeFromReq;

    const futsalId = req.params?.futsalId;
    if (!futsalId) return null;

    const futsal = await Footsal.findOne({ where: { id: futsalId } });
    if (futsal?.futsalCode) return futsal.futsalCode;

    const futsalByCode = await Footsal.findOne({ where: { futsalCode: futsalId } });
    return futsalByCode?.futsalCode || null;
}

//by admin
const getBookingsByAdmin = async (req,res) => {
    const futsalCode = req?.futsalCode;
    await ensureBookingOfflineColumns(futsalCode);

    const bookings = await sequelize.query(
        `SELECT b.*,
                COALESCE(u.username, b.offline_username) AS user_name,
                COALESCE(u.phoneNumber, b.offline_phone) AS phone,
                (b.user_id IS NULL AND b.offline_phone IS NOT NULL) AS is_offline_booking,
                p.name AS pitch_name,
                t.start_time,
                t.end_time
         FROM booking_${futsalCode} b
         LEFT JOIN users u ON b.user_id = u.id
         JOIN pitch_${futsalCode} p ON b.pitch_id = p.id
         JOIN timeslot_${futsalCode} t ON b.timeslot_id = t.id
         ORDER BY b.created_at DESC, b.id DESC`,
        {
            type: QueryTypes.SELECT,
        }
    );
    if(bookings.length === 0){
        return res.status(200).json({
            success:true,
            message:"No bookings found",
            data:[]
        })
    }

    res.status(200).json({
        success:true,
        message:"Bookings fetched successfully",
        data:bookings
    })
}

// Admin: full booking details (customer, pitch, timeslot, payment, source)
const getBookingByIdAdmin = async (req, res) => {
    try {
        const code = req.futsalCode;
        const bookingId = Number(req.params.bookingId);
        await ensureBookingOfflineColumns(code);

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Futsal code is required",
            });
        }

        if (!Number.isInteger(bookingId) || bookingId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid bookingId is required",
            });
        }

        const rows = await sequelize.query(
            `SELECT
                b.*,
                u.username,
                u.email,
                u.phoneNumber,
                p.id AS pitch_id,
                p.name AS pitch_name,
                p.pitch_type,
                p.surface_type,
                p.dimensions,
                p.price_per_hour,
                p.lighting,
                p.indoor,
                t.id AS timeslot_id,
                t.day_of_week,
                t.start_time,
                t.end_time,
                t.price AS timeslot_price,
                t.is_available AS timeslot_is_available,
                pay.id AS payment_id,
                pay.gateway AS payment_gateway,
                pay.provider_order_id,
                pay.provider_txn_id,
                pay.amount AS payment_amount,
                pay.status AS payment_status,
                pay.verified_at AS payment_verified_at,
                pay.created_at AS payment_created_at
             FROM booking_${code} b
             LEFT JOIN users u ON b.user_id = u.id
             JOIN pitch_${code} p ON b.pitch_id = p.id
             JOIN timeslot_${code} t ON b.timeslot_id = t.id
             LEFT JOIN payment_${code} pay ON pay.booking_id = b.id
             WHERE b.id = ?
             ORDER BY pay.id DESC
             LIMIT 1`,
            {
                replacements: [bookingId],
                type: QueryTypes.SELECT,
            }
        );

        const row = rows[0];
        if (!row) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        const isOfflineBooking = isOfflineBookingRow(row);
        const bookingSource = isOfflineBooking ? "offline_phone" : "website";
        const customerName = isOfflineBooking
            ? row.offline_username || "Walk-in customer"
            : row.username;
        const customerPhone = isOfflineBooking
            ? row.offline_phone
            : row.phoneNumber;

        return res.status(200).json({
            success: true,
            message: "Booking details fetched successfully",
            data: {
                booking: {
                    id: row.id,
                    status: row.status,
                    booking_date: row.booking_date,
                    amount: row.amount,
                    notes: row.notes,
                    offline_username: row.offline_username,
                    offline_phone: row.offline_phone,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                },
                customer: {
                    id: row.user_id,
                    name: customerName,
                    email: isOfflineBooking ? null : row.email,
                    phone: customerPhone,
                },
                pitch: {
                    id: row.pitch_id,
                    name: row.pitch_name,
                    pitch_type: row.pitch_type,
                    surface_type: row.surface_type,
                    dimensions: row.dimensions,
                    price_per_hour: row.price_per_hour,
                    lighting: row.lighting,
                    indoor: row.indoor,
                },
                timeslot: {
                    id: row.timeslot_id,
                    day_of_week: row.day_of_week,
                    start_time: row.start_time,
                    end_time: row.end_time,
                    price: row.timeslot_price,
                    is_available: row.timeslot_is_available,
                },
                payment: row.payment_id
                    ? {
                          id: row.payment_id,
                          gateway: row.payment_gateway,
                          provider_order_id: row.provider_order_id,
                          provider_txn_id: row.provider_txn_id,
                          amount: row.payment_amount,
                          status: row.payment_status,
                          verified_at: row.payment_verified_at,
                          created_at: row.payment_created_at,
                      }
                    : null,
                source: {
                    type: bookingSource,
                    label:
                        bookingSource === "offline_phone"
                            ? "Phone / Walk-in"
                            : "Website / App",
                    isOfflineBooking,
                },
            },
        });
    } catch (error) {
        console.error("Error fetching booking details:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch booking details",
            error: error.message,
        });
    }
};

//user
const getBookingsByUser = async (req,res) => {
    const code = await resolveBookingTenantCode(req);
    const userId = req.userId;

    if (!code) {
        return res.status(404).json({
            success: false,
            message: "Futsal not found",
        });
    }

    const bookings = await sequelize.query(
        `SELECT b.*, p.name as pitch_name, t.start_time, t.end_time 
         FROM booking_${code} b 
         JOIN pitch_${code} p ON b.pitch_id = p.id 
         JOIN timeslot_${code} t ON b.timeslot_id = t.id
         WHERE b.user_id = ?`,
        {
            replacements: [userId],
            type: QueryTypes.SELECT,
        }
    );

        if(bookings.length === 0){
        return res.status(200).json({
            success:true,
            message:"No bookings found for this user",
            data:[]
        })
    }

    res.status(200).json({
        success:true,
        message:"Bookings fetched successfully",
        data:bookings
    })
}

//user
const cancelBooking = async (req,res) => {
    const code = await resolveBookingTenantCode(req);
    const userId = req.userId;
    const bookingId = req.params.bookingId;

    if (!code) {
        return res.status(404).json({
            success: false,
            message: "Futsal not found",
        });
    }


    const booking = await sequelize.query(
        `SELECT b.*, t.start_time, t.end_time, p.name as pitch_name
         FROM booking_${code} b
         JOIN timeslot_${code} t ON b.timeslot_id = t.id
         JOIN pitch_${code} p ON b.pitch_id = p.id
         WHERE b.id = ? AND b.user_id = ?`,
        {
            replacements: [bookingId, userId],
            type: QueryTypes.SELECT,
        }
    );

    if (booking.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Booking not found"
        });
    }

    const bookingItem = booking[0];
    const bookingDateTime = new Date(`${bookingItem.booking_date}T${bookingItem.start_time}:00`);
    const cancellationCutoff = new Date(bookingDateTime.getTime() - 2 * 60 * 60 * 1000);

    if (new Date() > cancellationCutoff) {
        return res.status(400).json({
            success: false,
            message: "Cancellation period has expired. You can only cancel at least 2 hours before the booking time."
        });
    }

    await sequelize.query(
        `UPDATE booking_${code} SET status = 'cancelled' 
         WHERE id = ? AND user_id = ?`,
        {
            replacements: [bookingId, userId],
            type: QueryTypes.UPDATE,
        }
    );

    try {
        const [user, futsal] = await Promise.all([
            User.findByPk(userId),
            Footsal.findOne({ where: { futsalCode: code } }),
        ]);

        if (user?.email) {
            await sendEmail({
                option: {
                    to: user.email,
                    subject: "Booking cancelled successfully",
                    text: `Your booking for ${bookingItem.pitch_name} on ${bookingItem.booking_date} at ${bookingItem.start_time} - ${bookingItem.end_time} has been cancelled successfully.`,
                },
            });
        }

        if (futsal?.email) {
            await sendEmail({
                option: {
                    to: futsal.email,
                    subject: "A booking was cancelled",
                    text: `A booking for ${bookingItem.pitch_name} on ${bookingItem.booking_date} at ${bookingItem.start_time} - ${bookingItem.end_time} was cancelled by the user.`,
                },
            });
        }

        // In-app notifications
        await Promise.all([
            createUserNotification({
                userId,
                type: "booking_cancelled",
                title: "Booking Cancelled",
                message: `Your booking for ${bookingItem.pitch_name} on ${bookingItem.booking_date} at ${bookingItem.start_time} - ${bookingItem.end_time} has been cancelled.`,
                relatedId: bookingId,
                relatedType: "booking",
            }),
            futsal && createFutsalNotification({
                futsalId: futsal.id,
                type: "booking_cancelled",
                title: "Booking Cancelled by User",
                message: `A booking for ${bookingItem.pitch_name} on ${bookingItem.booking_date} at ${bookingItem.start_time} - ${bookingItem.end_time} was cancelled by the user.`,
                relatedId: bookingId,
                relatedType: "booking",
            }),
        ]);
    } catch (notificationError) {
        console.error("Error sending booking cancellation notifications:", notificationError);
    }

    res.status(200).json({
        success:true,
        message:"Booking cancelled successfully"
    })
}

//admin can cancel any booking
const cancelBookingByAdmin = async (req,res) => {
    const code = req.futsalCode;
    const bookingId = req.params.bookingId;

    const row = await fetchAdminBookingWithSlot(code, bookingId);
    if (respondIfPastOrMissingBooking(res, row)) return;

    await sequelize.query(
        `UPDATE booking_${code} SET status = 'cancelled' 
         WHERE id = ?`,
        {
            replacements: [bookingId],
            type: QueryTypes.UPDATE,
        }
    );

    res.status(200).json({
        success:true,
        message:"Booking cancelled successfully by admin"
    })
}

//admin can confirm any booking
const confirmBookingByAdmin = async (req,res) => {
    const code = req.futsalCode;
    const bookingId = req.params.bookingId;

    const booking = await sequelize.query(
        `SELECT b.*, t.start_time, t.end_time, p.name as pitch_name, u.email as user_email
         FROM booking_${code} b
         JOIN timeslot_${code} t ON b.timeslot_id = t.id
         JOIN pitch_${code} p ON b.pitch_id = p.id
         LEFT JOIN users u ON b.user_id = u.id
         WHERE b.id = ?`,
        {
            replacements: [bookingId],
            type: QueryTypes.SELECT,
        }
    );

    const row = booking[0];
    if (!row) {
        return res.status(404).json({ success: false, message: "Booking not found" });
    }
    if (isBookingInPast(row.booking_date, row.end_time)) {
        return res.status(400).json({ success: false, message: PAST_BOOKING_MSG });
    }

    await sequelize.query(
        `UPDATE booking_${code} SET status = 'confirmed' 
         WHERE id = ?`,
        {
            replacements: [bookingId],
            type: QueryTypes.UPDATE,
        }
    );

    if (row?.user_id && row?.user_email) {
        try {
            await sendEmail({
                option: {
                    to: row.user_email,
                    subject: "Booking confirmed",
                    text: `Your booking for ${row.pitch_name} on ${row.booking_date} at ${row.start_time} - ${row.end_time} has been confirmed.`,
                },
            });

            const futsalRecord = await Footsal.findOne({ where: { futsalCode: code } });
            await Promise.all([
                createUserNotification({
                    userId: row.user_id,
                    type: "booking_confirmed",
                    title: "Booking Confirmed! ✅",
                    message: `Great news! Your booking for ${row.pitch_name} on ${row.booking_date} at ${row.start_time} - ${row.end_time} has been confirmed.`,
                    relatedId: bookingId,
                    relatedType: "booking",
                }),
                futsalRecord && createFutsalNotification({
                    futsalId: futsalRecord.id,
                    type: "booking_confirmed",
                    title: "Booking Confirmed",
                    message: `You confirmed booking for ${row.pitch_name} on ${row.booking_date} at ${row.start_time} - ${row.end_time}.`,
                    relatedId: bookingId,
                    relatedType: "booking",
                }),
            ]);
        } catch (notificationError) {
            console.error("Error sending booking confirmation email:", notificationError);
        }
    }

    res.status(200).json({
        success:true,
        message:"Booking confirmed successfully by admin"
    })
}

// admin can reject any booking with reason
const rejectBookingByAdmin = async (req,res) => {
    const code = req.futsalCode;
    const bookingId = req.params.bookingId;
    const { reason } = req.body;

    const booking = await sequelize.query(
        `SELECT b.*, t.start_time, t.end_time, p.name as pitch_name, u.email as user_email
         FROM booking_${code} b
         JOIN timeslot_${code} t ON b.timeslot_id = t.id
         JOIN pitch_${code} p ON b.pitch_id = p.id
         LEFT JOIN users u ON b.user_id = u.id
         WHERE b.id = ?`,
        {
            replacements: [bookingId],
            type: QueryTypes.SELECT,
        }
    );

    const row = booking[0];
    if (!row) {
        return res.status(404).json({ success: false, message: "Booking not found" });
    }
    if (isBookingInPast(row.booking_date, row.end_time)) {
        return res.status(400).json({ success: false, message: PAST_BOOKING_MSG });
    }
    const rejectionNotes = reason
        ? row?.notes
            ? `${row.notes}\nRejected: ${reason}`
            : `Rejected: ${reason}`
        : row?.notes ?? null;

    await sequelize.query(
        `UPDATE booking_${code} SET status = 'rejected', notes = ?
         WHERE id = ?`,
        {
            replacements: [rejectionNotes, bookingId],
            type: QueryTypes.UPDATE,
        }
    );

    if (row?.user_id && row?.user_email) {
        try {
            await sendEmail({
                option: {
                    to: row.user_email,
                    subject: "Booking rejected",
                    text: `Your booking for ${row.pitch_name} on ${row.booking_date} at ${row.start_time} - ${row.end_time} has been rejected.${reason ? ` Reason: ${reason}` : ''}`,
                },
            });

            const futsalRecord = await Footsal.findOne({ where: { futsalCode: code } });
            await Promise.all([
                createUserNotification({
                    userId: row.user_id,
                    type: "booking_rejected",
                    title: "Booking Rejected ❌",
                    message: `Your booking for ${row.pitch_name} on ${row.booking_date} has been rejected.${reason ? ` Reason: ${reason}` : ''}`,
                    relatedId: bookingId,
                    relatedType: "booking",
                }),
                futsalRecord && createFutsalNotification({
                    futsalId: futsalRecord.id,
                    type: "booking_cancelled",
                    title: "Booking Rejected",
                    message: `You rejected a booking for ${row.pitch_name} on ${row.booking_date}.${reason ? ` Reason: ${reason}` : ''}`,
                    relatedId: bookingId,
                    relatedType: "booking",
                }),
            ]);
        } catch (notificationError) {
            console.error("Error sending booking rejection notifications:", notificationError);
        }
    }

    res.status(200).json({
        success:true,
        message:"Booking rejected successfully by admin"
    })
}

//admin can unconfirm any booking
const unconfirmBookingByAdmin = async (req,res) => {
    const code = req.futsalCode;
    const bookingId = req.params.bookingId;

    const row = await fetchAdminBookingWithSlot(code, bookingId);
    if (respondIfPastOrMissingBooking(res, row)) return;

    await sequelize.query(
        `UPDATE booking_${code} SET status = 'pending' 
         WHERE id = ?`,
        {
            replacements: [bookingId],
            type: QueryTypes.UPDATE,
        }
    );

    res.status(200).json({
        success:true,
        message:"Booking unconfirmed successfully by admin"
    })
}

//user
const deleteBookingByUser = async (req,res) => {
    const code = await resolveBookingTenantCode(req);
    const userId = req.userId;
    const bookingId = req.params.bookingId;

    if (!code) {
        return res.status(404).json({
            success: false,
            message: "Futsal not found",
        });
    }

    await sequelize.query(
        `DELETE FROM booking_${code} 
         WHERE id = ? AND user_id = ?`,
        {
            replacements: [bookingId, userId],
            type: QueryTypes.DELETE,
        }
    );

    res.status(200).json({
        success:true,
        message:"Booking deleted successfully"
    })
}

//admin
const deleteBookingByAdmin = async (req,res) => {
    const code = req.futsalCode;
    const bookingId = req.params.bookingId;

    await sequelize.query(
        `DELETE FROM booking_${code} 
         WHERE id = ?`,
        {
            replacements: [bookingId],
            type: QueryTypes.DELETE,
        }
    );

    res.status(200).json({
        success:true,
        message:"Booking deleted successfully by admin"
    })
}

//admin dashboard stats
const getBookingStats = async (req,res) => {
    const code = req.futsalCode;
    const stats = await sequelize.query(
        `SELECT 
            (SELECT COUNT(*) FROM booking_${code}) as total_bookings,
            (SELECT COUNT(*) FROM booking_${code} WHERE status = 'confirmed') as confirmed_bookings,
            (SELECT COUNT(*) FROM booking_${code} WHERE status = 'cancelled') as cancelled_bookings,
            (SELECT COUNT(*) FROM booking_${code} WHERE status = 'completed') as completed_bookings`,
        {
            type: QueryTypes.SELECT,
        }
    );

    res.status(200).json({
        success:true,
        message:"Booking stats fetched successfully",
        data:stats[0]
    })
}

// Admin: phone / walk-in booking — stored on booking row only (no users table)
const createBookingByAdmin = async (req, res) => {
    const code = req.futsalCode;
    const {
        phoneNumber,
        offline_phone,
        customerName,
        offline_username,
        pitch_id,
        timeslot_id,
        booking_date,
        amount,
        description,
        notes,
        status,
    } = req.body;

    if (!code) {
        return res.status(400).json({
            success: false,
            message: "Futsal code is required",
        });
    }

    const rawPhone = offline_phone || phoneNumber;
    const rawName = offline_username || customerName;

    if (!rawPhone || !pitch_id || !timeslot_id || !booking_date || amount === undefined || amount === null) {
        return res.status(400).json({
            success: false,
            message: "offline_phone (or phoneNumber), pitch_id, timeslot_id, booking_date and amount are required",
        });
    }

    const normalizedPhone = normalizePhone(rawPhone);
    if (!normalizedPhone) {
        return res.status(400).json({
            success: false,
            message: "Valid 10-digit offline_phone is required",
        });
    }

    if (isBookingDateBeforeToday(booking_date)) {
        return res.status(400).json({
            success: false,
            message: "Cannot create a booking for a past date",
        });
    }

    const offlineUsername = (rawName || `Walk-in ${normalizedPhone}`).trim().slice(0, 100);
    const bookingNotes = description || notes || null;

    const bookingStatus = ["pending", "confirmed", "completed"].includes(status)
        ? status
        : "confirmed";

    try {
        await ensureBookingOfflineColumns(code);

        const timeslotCheck = await sequelize.query(
            `SELECT * FROM timeslot_${code} WHERE id = ? AND pitch_id = ?`,
            {
                replacements: [timeslot_id, pitch_id],
                type: QueryTypes.SELECT,
            }
        );

        if (timeslotCheck.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid timeslot for this pitch",
            });
        }

        const existingSlot = await sequelize.query(
            `SELECT id FROM booking_${code}
             WHERE pitch_id = ? AND timeslot_id = ? AND booking_date = ?
               AND status IN ('confirmed', 'completed', 'pending')`,
            {
                replacements: [pitch_id, timeslot_id, booking_date],
                type: QueryTypes.SELECT,
            }
        );

        if (existingSlot.length > 0) {
            return res.status(400).json({
                success: false,
                message: "This slot is already booked for the selected date",
            });
        }

        const insertResult = await sequelize.query(
            `INSERT INTO booking_${code}
             (user_id, offline_username, offline_phone, pitch_id, timeslot_id, booking_date, amount, notes, status, created_at)
             VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            {
                replacements: [
                    offlineUsername,
                    normalizedPhone,
                    pitch_id,
                    timeslot_id,
                    booking_date,
                    amount,
                    bookingNotes,
                    bookingStatus,
                ],
                type: QueryTypes.INSERT,
            }
        );

        let bookingId = Array.isArray(insertResult) ? insertResult[0] : insertResult;
        if (!bookingId) {
            const rows = await sequelize.query(
                `SELECT id FROM booking_${code}
                 WHERE pitch_id = ? AND timeslot_id = ? AND booking_date = ?
                 ORDER BY id DESC LIMIT 1`,
                {
                    replacements: [pitch_id, timeslot_id, booking_date],
                    type: QueryTypes.SELECT,
                }
            );
            bookingId = rows[0]?.id;
        }

        const futsal = await Footsal.findOne({ where: { futsalCode: code } });
        const reqSlot = timeslotCheck[0];
        const pitchRows = await sequelize.query(
            `SELECT name FROM pitch_${code} WHERE id = ?`,
            { replacements: [pitch_id], type: QueryTypes.SELECT }
        );
        const pitchName = pitchRows[0]?.name || `Pitch ${pitch_id}`;

        if (futsal) {
            try {
                await createFutsalNotification({
                    futsalId: futsal.id,
                    type: "booking_confirmed",
                    title: "Walk-in Booking Added",
                    message: `Walk-in booking for ${pitchName} on ${booking_date} (${reqSlot.start_time}-${reqSlot.end_time}). Phone: ${normalizedPhone}.`,
                    relatedId: bookingId,
                    relatedType: "booking",
                });
            } catch (notificationError) {
                console.error("Offline booking notification error:", notificationError);
            }
        }

        return res.status(201).json({
            success: true,
            message: "Offline booking created successfully",
            data: {
                id: bookingId,
                user_id: null,
                offline_username: offlineUsername,
                offline_phone: normalizedPhone,
                pitch_id,
                timeslot_id,
                booking_date,
                amount,
                notes: bookingNotes,
                status: bookingStatus,
                is_offline_booking: true,
            },
        });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
                success: false,
                message: "This slot was just booked by someone else",
            });
        }

        console.error("Error creating offline booking:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create offline booking",
            error: error.message,
        });
    }
};

//user create bokings -> payment ( after payment success then booking will be confirmed, otherwise it will be pending or cancelled based on payment status)
const createBooking = async (req,res) => {
    const code = await resolveBookingTenantCode(req);
    const userId = req.userId;
    const {pitch_id, timeslot_id, booking_date, amount, notes} = req.body;

    if (!code) {
        return res.status(404).json({
            success: false,
            message: "Futsal not found",
        });
    }

    if(!pitch_id || !timeslot_id || !booking_date || !amount){
        return res.status(400).json({
            success:false,
            message:"pitch_id, timeslot_id, booking_date and amount are required"
        })
    }

    // 0. Prevent booking past dates or past slots for today
    const now = new Date();
    const selectedDate = new Date(booking_date);
    
    // Normalize dates to midnight for comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

    if (targetDate < today) {
        return res.status(400).json({
            success: false,
            message: "You cannot book a date in the past."
        });
    }

    try {
        // 1. Verify Timeslot Existence and Association
        const timeslotCheck = await sequelize.query(
            `SELECT * FROM timeslot_${code} WHERE id = ? AND pitch_id = ?`,
            {
                replacements: [timeslot_id, pitch_id],
                type: QueryTypes.SELECT
            }
        );
        
        if (timeslotCheck.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid timeslot for this pitch." });
        }

        const reqSlot = timeslotCheck[0];

        // 1.1 If it's today, check if the start time has already passed
        if (targetDate.getTime() === today.getTime()) {
            const [hours, minutes] = reqSlot.start_time.split(':').map(Number);
            const slotStartTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
            
            if (slotStartTime < now) {
                return res.status(400).json({
                    success: false,
                    message: "This timeslot has already passed for today."
                });
            }
        }

        // 2. Double-Booking Protection: 
        // Hard fail if confirmed or completed
        const existingSlot = await sequelize.query(
            `SELECT * FROM booking_${code} 
             WHERE pitch_id = ? AND timeslot_id = ? AND booking_date = ? AND status IN ('confirmed', 'completed')`,
            {
                replacements: [pitch_id, timeslot_id, booking_date],
                type: QueryTypes.SELECT
            }
        );

        if (existingSlot.length > 0) {
            return res.status(400).json({ success: false, message: "This slot is already booked by another user." });
        }

        // Soft fail if someone else is currently in the 5-minute checkout window
        const pendingSlot = await sequelize.query(
            `SELECT * FROM booking_${code} 
             WHERE pitch_id = ? AND timeslot_id = ? AND booking_date = ? 
               AND status = 'pending' AND user_id != ? AND created_at > (NOW() - INTERVAL 5 MINUTE)`,
            {
                replacements: [pitch_id, timeslot_id, booking_date, userId],
                type: QueryTypes.SELECT
            }
        );

        if (pendingSlot.length > 0) {
            return res.status(400).json({ success: false, message: "This slot is currently being reviewed by another user. Please try again in 5 minutes." });
        }

        // 3. Simultaneous Booking Prevention: Ensure user's existing bookings don't overlap with this time
        const userActiveBookings = await sequelize.query(
            `SELECT b.*, t.start_time, t.end_time 
             FROM booking_${code} b
             JOIN timeslot_${code} t ON b.timeslot_id = t.id
             WHERE b.user_id = ? AND b.booking_date = ? AND b.status != 'cancelled'`,
             {
                 replacements: [userId, booking_date],
                 type: QueryTypes.SELECT
             }
        );

        const requestedStart = reqSlot.start_time;
        const requestedEnd = reqSlot.end_time;

        const isOverlapping = userActiveBookings.some(booking => {
            // Ignore the exact same slot so the user can retry checkout for it
            if (Number(booking.pitch_id) === Number(pitch_id) && Number(booking.timeslot_id) === Number(timeslot_id)) {
                return false;
            }
            return (requestedStart < booking.end_time && requestedEnd > booking.start_time);
        });

        if (isOverlapping) {
             return res.status(400).json({ success: false, message: "You already have a booking that overlaps with this time." });
        }

        // Insert validated booking using upsert so we can overwrite abandoned pending bookings
        await sequelize.query(
            `INSERT INTO booking_${code} (user_id, pitch_id, timeslot_id, booking_date, amount, notes, status, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
             ON DUPLICATE KEY UPDATE 
                user_id = VALUES(user_id),
                amount = VALUES(amount),
                notes = VALUES(notes),
                status = 'pending',
                created_at = NOW()`,
            {
                replacements: [userId, pitch_id, timeslot_id, booking_date, amount, notes],
                type: QueryTypes.INSERT,
            }
        );

        // Fetch the ID directly safely
        const fetchInserted = await sequelize.query(
             `SELECT id FROM booking_${code} WHERE pitch_id = ? AND timeslot_id = ? AND booking_date = ?`,
             { replacements: [pitch_id, timeslot_id, booking_date], type: QueryTypes.SELECT }
        );
        const insertedId = fetchInserted[0].id;

        try {
            const [user, futsal, pitch] = await Promise.all([
                User.findByPk(userId),
                Footsal.findOne({ where: { futsalCode: code } }),
                sequelize.query(
                    `SELECT name FROM pitch_${code} WHERE id = ?`,
                    {
                        replacements: [pitch_id],
                        type: QueryTypes.SELECT,
                    }
                )
            ]);

            const pitchName = pitch?.[0]?.name || `Pitch ${pitch_id}`;
            const bookingSummary = `Booking details: ${pitchName}, date ${booking_date}, slot ${reqSlot.start_time} - ${reqSlot.end_time}, amount ${amount}.`;

            if (user?.email) {
                await sendEmail({
                    option: {
                        to: user.email,
                        subject: "Booking Received - Pending Payment/Approval",
                        text: `Your booking request has been received. ${bookingSummary} Please complete your payment if you haven't already. Your booking will be confirmed once payment is verified or approved by the futsal provider.`,
                    },
                });
            }

            if (futsal?.email) {
                await sendEmail({
                    option: {
                        to: futsal.email,
                        subject: "New Booking Request",
                        text: `A new booking request has been received. ${bookingSummary} Please review and approve if it's a cash booking.`,
                    },
                });
            }

            // In-app notifications
            await Promise.all([
                user && createUserNotification({
                    userId: user.id,
                    type: "booking_created",
                    title: "Booking Request Received 🎉",
                    message: `Your booking for ${pitchName} on ${booking_date} at ${reqSlot.start_time} - ${reqSlot.end_time} is pending. Amount: Rs. ${amount}.`,
                    relatedId: insertedId,
                    relatedType: "booking",
                }),
                futsal && createFutsalNotification({
                    futsalId: futsal.id,
                    type: "booking_request",
                    title: "New Booking Request 📋",
                    message: `New booking received for ${pitchName} on ${booking_date} at ${reqSlot.start_time} - ${reqSlot.end_time}. Amount: Rs. ${amount}.`,
                    relatedId: insertedId,
                    relatedType: "booking",
                }),
            ]);
        } catch (notificationError) {
            console.error("Error sending booking notifications:", notificationError);
        }

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: { id: insertedId }
        });
    } catch(err) {
        console.error("Error creating booking:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error during booking creation."
        });
    }

}

module.exports = {
    getBookingsByAdmin,
    getBookingByIdAdmin,
    getBookingsByUser,
    cancelBooking,
    cancelBookingByAdmin,
    confirmBookingByAdmin,
    rejectBookingByAdmin,
    unconfirmBookingByAdmin,
    deleteBookingByUser,
    deleteBookingByAdmin,
    getBookingStats,
    createBooking,
    createBookingByAdmin,
}
