const bcryptjs = require("bcryptjs");
const generateJwt = require("../../utils/jwt/generateJwt");
const { redisClient } = require("../../config/redisConfig");
const { User } = require("../../models/index");
const { Footsal } = require("../../models/index");
const { TOKEN_EXPIRATION_USER, JWT_SECRET_USER, TOKEN_EXPIRATION_FUTSAL, JWT_SECRET_FUTSAL} = process.env;


//Login user api
const  Login = async(req,res)=>{
    const {email, password , phoneNumber} = req.body;
    //login using email or phone number
    
    // basic validation
    if((!email && !phoneNumber) || !password){
        return res.status(400).json({
            error: "Please provide email or phone number and password"
        });
    }

    const userEmail = await User.findOne({
        where: {email}
    });

    const userPhone = await User.findOne({
        where: {phoneNumber}
    });

    const user = userEmail || userPhone;

    const footsalEmail = await Footsal.findOne({
      where:{email}
    })

    const footsalPhone = await Footsal.findOne({
      where:{phoneNumber}
    })

    const footsalUser = footsalEmail || footsalPhone;

    if(user && !footsalUser){
      // check password
      const isMatch = await bcryptjs.compare(password, user.password);

      if(!isMatch){
          return res.status(400).json({
              error: "Invalid email/phone number or password"
          });
      }
      
      // Generate JWT
      const usertoken = generateJwt(
          {id: user.id, email: user.email, role: user.role},
          JWT_SECRET_USER || 'fallback-user-secret',
          TOKEN_EXPIRATION_USER || '30d'
      )
      
      // Return user data and token
      return res.status(200).json({
          message: "Login successful",
          usertoken,
          user: {
              id: user.id,
              username: user.username,
              email: user.email,
              phoneNumber: user.phoneNumber,
              role: user.role,
              is_active: user.is_active
          }
      });
    }

    if(footsalUser && !user){
    
      // Check password
      const isMatch = await bcrypt.compare(password, footsalUser.password);
      
      if(!isMatch){
          return res.status(400).json({
              error: "Invalid email/phone number or password"
          });
      }

      // Generate JWT
      const futsaltoken = generateJwt(
          {id: footsalUser.id, email: footsalUser.email, role: footsalUser.role, code: footsalUser.code},
          JWT_SECRET_FUTSAL || 'fallback-futsal-secret',
          TOKEN_EXPIRATION_FUTSAL || '7d'
      )

      // Return user data and token
      return res.status(200).json({
          message: "Login successful",
          futsaltoken,
          futsal: {
              id: footsalUser.id,
              username: footsalUser.username,
              email: footsalUser.email,
              phoneNumber: footsalUser.phoneNumber,
              role: footsalUser.role,
              is_active: footsalUser.is_active
          }
      });
    }
}

// google login user api
module.exports = userGoogleLogin_Register = async(req,res)=>{
    // to be implemented
    res.status(200).json({
        message: "Google login successful"
    });
}

//verify footsal by otp
const VerifyOtp = async (req, res) => {
  console.log("verigyig otp:")
  const { email } = req.query;
  const { otp } = req.body;

  console.log(email)
  console.log(otp)

  // check if footsal exists
  const footsalData = await Footsal.findOne({
    where: { email }
  });
  const userData = await User.findOne({
    where: { email }
  });

  // verify otp using redis
  const isValidOtp = await redisClient.get(`otp:${email}`);
  console.log(`Retrieved OTP for ${email} from Redis: ${isValidOtp}`);

  if (otp !== isValidOtp) {
    return res.status(400).json({
      error: "Invalid OTP",
    });
  }

  if (footsalData && !userData) {
    footsalData.isVerified = true;
    await footsalData.save();
    // delete otp from redis
    await redisClient.del(`otp:${email}`);
    return res.status(200).json({
      message: "Footsal verified successfully",
    });
  }

  if (userData && !footsalData) {
    userData.isVerified = true;
    await userData.save();
    // delete otp from redis
    await redisClient.del(`otp:${email}`);
    return res.status(200).json({
      message: "User verified successfully",
    });
  }

  return res.status(404).json({
    error: "User not found",
  });
};


//Logout user and futsal api
const  Logout = async(req,res)=>{
    //token
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(400).json({
            error: "No token provided"
        });
    }
    //logout clear cookies
    res.clearCookie('token');
    
    return res.status(200).json({
        message: "Logout successful"
    });

}

module.exports = AllAuthController = {
  VerifyOtp,
  Logout,
  Login
}

