const { sequelize, Footsal } = require("../../../models")
const {QueryTypes} = require("sequelize");

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
    // bookings, userId, pitchId, timeslotId
    const bookings = await sequelize.query(
        `SELECT b.*, u.username as user_name, p.name as pitch_name, t.start_time, t.end_time 
         FROM booking_${futsalCode} b 
         JOIN users u ON b.user_id = u.id 
         JOIN pitch_${futsalCode} p ON b.pitch_id = p.id 
         JOIN timeslot_${futsalCode} t ON b.timeslot_id = t.id`,
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

    await sequelize.query(
        `UPDATE booking_${code} SET status = 'cancelled' 
         WHERE id = ? AND user_id = ?`,
        {
            replacements: [bookingId, userId],
            type: QueryTypes.UPDATE,
        }
    );

    res.status(200).json({
        success:true,
        message:"Booking cancelled successfully"
    })
}

//admin can cancel any booking
const cancelBookingByAdmin = async (req,res) => {
    const code = req.futsalCode;
    const bookingId = req.params.bookingId;

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

        // 2. Double-Booking Protection: No one can book an already booked confirmed/pending slot
        const existingSlot = await sequelize.query(
            `SELECT * FROM booking_${code} 
             WHERE pitch_id = ? AND timeslot_id = ? AND booking_date = ? AND status != 'cancelled'`,
            {
                replacements: [pitch_id, timeslot_id, booking_date],
                type: QueryTypes.SELECT
            }
        );

        if (existingSlot.length > 0) {
            return res.status(400).json({ success: false, message: "This slot is already booked by another user." });
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
            return (requestedStart < booking.end_time && requestedEnd > booking.start_time);
        });

        if (isOverlapping) {
             return res.status(400).json({ success: false, message: "You already have a booking that overlaps with this time." });
        }

        // Insert validated booking
        await sequelize.query(
            `INSERT INTO booking_${code} (user_id, pitch_id, timeslot_id, booking_date, amount, notes) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            {
                replacements: [userId, pitch_id, timeslot_id, booking_date, amount, notes],
                type: QueryTypes.INSERT,
            }
        );
    } catch(err) {
        console.error("Error creating booking:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error during booking creation."
        });
    }

    res.status(201).json({
        success:true,
        message:"Booking created successfully"
    })
}

module.exports = {
    getBookingsByAdmin,
    getBookingsByUser,
    cancelBooking,
    cancelBookingByAdmin,
    deleteBookingByUser,
    deleteBookingByAdmin,
    getBookingStats,
    createBooking
}
