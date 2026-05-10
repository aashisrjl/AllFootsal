const { sequelize, Footsal, User } = require("../../../models")
const {QueryTypes} = require("sequelize");
const sendEmail = require("../../../services/mail/sendEmail");
const { createUserNotification, createFutsalNotification } = require("../../../services/notifications/notificationService");

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
         JOIN users u ON b.user_id = u.id
         WHERE b.id = ?`,
        {
            replacements: [bookingId],
            type: QueryTypes.SELECT,
        }
    );

    await sequelize.query(
        `UPDATE booking_${code} SET status = 'confirmed' 
         WHERE id = ?`,
        {
            replacements: [bookingId],
            type: QueryTypes.UPDATE,
        }
    );

    if (booking[0]?.user_email) {
        try {
            await sendEmail({
                option: {
                    to: booking[0].user_email,
                    subject: "Booking confirmed",
                    text: `Your booking for ${booking[0].pitch_name} on ${booking[0].booking_date} at ${booking[0].start_time} - ${booking[0].end_time} has been confirmed.`,
                },
            });

            const futsalRecord = await Footsal.findOne({ where: { futsalCode: code } });
            await Promise.all([
                createUserNotification({
                    userId: booking[0].user_id,
                    type: "booking_confirmed",
                    title: "Booking Confirmed! ✅",
                    message: `Great news! Your booking for ${booking[0].pitch_name} on ${booking[0].booking_date} at ${booking[0].start_time} - ${booking[0].end_time} has been confirmed.`,
                    relatedId: bookingId,
                    relatedType: "booking",
                }),
                futsalRecord && createFutsalNotification({
                    futsalId: futsalRecord.id,
                    type: "booking_confirmed",
                    title: "Booking Confirmed",
                    message: `You confirmed booking for ${booking[0].pitch_name} on ${booking[0].booking_date} at ${booking[0].start_time} - ${booking[0].end_time}.`,
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
         JOIN users u ON b.user_id = u.id
         WHERE b.id = ?`,
        {
            replacements: [bookingId],
            type: QueryTypes.SELECT,
        }
    );

    await sequelize.query(
        `UPDATE booking_${code} SET status = 'rejected', notes = ?
         WHERE id = ?`,
        {
            replacements: [reason || null, bookingId],
            type: QueryTypes.UPDATE,
        }
    );

    if (booking[0]?.user_email) {
        try {
            await sendEmail({
                option: {
                    to: booking[0].user_email,
                    subject: "Booking rejected",
                    text: `Your booking for ${booking[0].pitch_name} on ${booking[0].booking_date} at ${booking[0].start_time} - ${booking[0].end_time} has been rejected.${reason ? ` Reason: ${reason}` : ''}`,
                },
            });

            const futsalRecord = await Footsal.findOne({ where: { futsalCode: code } });
            await Promise.all([
                createUserNotification({
                    userId: booking[0].user_id,
                    type: "booking_rejected",
                    title: "Booking Rejected ❌",
                    message: `Your booking for ${booking[0].pitch_name} on ${booking[0].booking_date} has been rejected.${reason ? ` Reason: ${reason}` : ''}`,
                    relatedId: bookingId,
                    relatedType: "booking",
                }),
                futsalRecord && createFutsalNotification({
                    futsalId: futsalRecord.id,
                    type: "booking_rejected",
                    title: "Booking Rejected",
                    message: `You rejected a booking for ${booking[0].pitch_name} on ${booking[0].booking_date}.${reason ? ` Reason: ${reason}` : ''}`,
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
        const [insertedId] = await sequelize.query(
            `INSERT INTO booking_${code} (user_id, pitch_id, timeslot_id, booking_date, amount, notes) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            {
                replacements: [userId, pitch_id, timeslot_id, booking_date, amount, notes],
                type: QueryTypes.INSERT,
            }
        );

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
                    type: "new_booking",
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
    getBookingsByUser,
    cancelBooking,
    cancelBookingByAdmin,
    confirmBookingByAdmin,
    rejectBookingByAdmin,
    unconfirmBookingByAdmin,
    deleteBookingByUser,
    deleteBookingByAdmin,
    getBookingStats,
    createBooking
}
