//check futsal and user both are authenticated and return futsal and user id
const jwt = require("jsonwebtoken");

const isBothAuthenticated = (req, res, next) => {
    const ftoken = req.cookies?.ftoken || req.headers?.ftoken;
    const utoken = req.cookies?.utoken || req.headers?.utoken;

    if (!ftoken && !utoken) {
        return res.status(401).json({ error: "Access token required" });
    }
    try {
        if (ftoken) {
            const decodedFutsal = jwt.verify(ftoken, process.env.JWT_SECRET_FUTSAL);
            if (decodedFutsal.role === "futsal") {
                req.futsal = decodedFutsal;
                req.futsalId = decodedFutsal.id;
                req.futsalCode = decodedFutsal.code;
            }
        }
        if (utoken) {
            const decodedUser = jwt.verify(utoken, process.env.JWT_SECRET_USER);
            if (decodedUser.role === "user") {
                req.user = decodedUser;
                req.userId = decodedUser.id;
            }
        }
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
}

// const isBothAuthenticated = (req, res, next) => {
//     let ftoken = req.headers?.ftoken || req.cookies?.ftoken;
//     let utoken = req.headers?.utoken || req.cookies?.utoken;

//     // ✅ handle Authorization header
//     if (!ftoken && req.headers.authorization) {
//         const authHeader = req.headers.authorization;

//         // support both formats
//         if (authHeader.startsWith("Bearer ")) {
//             ftoken = authHeader.split(" ")[1];
//         } else {
//             ftoken = authHeader; // raw token (your current case)
//         }
//     }

//     if (!ftoken && !utoken) {
//         return res.status(401).json({ error: "Access token required" });
//     }

//     try {
//         if (ftoken) {
//             const decodedFutsal = jwt.verify(ftoken, process.env.JWT_SECRET_FUTSAL);
//             req.futsal = decodedFutsal;
//             req.futsalId = decodedFutsal.id;
//             req.futsalCode = decodedFutsal.code;
//         }

//         if (utoken) {
//             const decodedUser = jwt.verify(utoken, process.env.JWT_SECRET_USER);
//             req.user = decodedUser;
//             req.userId = decodedUser.id;
//         }

//         next();
//     } catch (error) {
//         return res.status(401).json({ error: "Invalid token" });
//     }
// };

module.exports = isBothAuthenticated;