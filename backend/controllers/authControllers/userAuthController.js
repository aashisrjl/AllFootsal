const bcrypt = require("bcryptjs");
const { User } = require("../../models/index");
const generateJwt = require("../../utils/jwt/generateJwt");
const {USER_PASSWORD_SALT_ROUNDS, USER_TOKEN_EXPIRATION, JWT_SECRET_USER } = process.env;

// register user api
module.exports = userRegister = async (req, res) => {
  const { username, email, password,confirmPassword, phoneNumber } = req.body;

  // basic validation
  if (!username || !email || !phoneNumber || !password || !confirmPassword) {
    return res.status(400).json({
      error: "Please provide all required fields",
    });
  }
  if(password !== confirmPassword){
    return res.status(400).json({
      error: "Passwords do not match",
    });
  }

  // Check if user already exists
  const emailExists = await User.findOne({
    where: { email },
  });

  const phoneExists = await User.findOne({
    where: { phoneNumber },
  });

    const userExists = emailExists || phoneExists;

  if (userExists) {
    return res.status(400).json({
      error: "User with this email,phone already exists",
    });
  }

  // Hash password
  const hashedPassword = password ? await bcrypt.hash(password,USER_PASSWORD_SALT_ROUNDS ) : null;

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    phoneNumber,
  });

  if (newUser) {
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
        is_active: newUser.is_active,
      },
    });
  } else {
    res.status(400).json({
      error: "Invalid user data",
    });
  }
};


//Login user api
module.exports = userLogin = async(req,res)=>{
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
    
    if(!user){
        return res.status(400).json({
            error: "Invalid email or password"
        });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({
            error: "Invalid email or password"
        });
    }

    // // Generate JWT
    // const token = jwt.sign(
    //     {id: user.id, email: user.email, role: user.role},
    //     JWT_SECRET_USER || 'fallback-user-secret',
    //     {expiresIn: USER_TOKEN_EXPIRATION || '30d'}
    // );

    // Generate JWT
    const token = generateJwt(
        {id: user.id, email: user.email, role: user.role},
        JWT_SECRET_USER || 'fallback-user-secret',
        USER_TOKEN_EXPIRATION || '30d'
    )


    // Return user data and token
    res.status(200).json({
        message: "Login successful",
        token,
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

// google login user api
module.exports = userGoogleLogin_Register = async(req,res)=>{
    // to be implemented
    res.status(200).json({
        message: "Google login successful"
    });
}
