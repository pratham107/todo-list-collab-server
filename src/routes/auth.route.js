import express from "express";
import jwt from "jsonwebtoken"
import User from "../schema/user.schema.js"
import bcrypt from "bcryptjs";
import verifyToken from "../middlewares/verifyJwt.middleware.js";


const router = express.Router();

router.post("/register",async (req,res)=>{
     
    const {username,email,password} = req.body;
   
      if(!username, !email, !password){
        return res.status(400).json({
            message: "Please fill in all fields",
            status:"false",
        }); 
      }

      const isEmailExist = await User.findOne({email});

      if(isEmailExist){
        return res.status(400).json({
            message: "Email already exist",
            status:"false",
        })
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password:hashedPassword
      })

      try {
        const savedUser = await user.save();
        res.status(201).json({
            message: "User created successfully",
            status:"true",
            user:savedUser
        })
      } catch (error) {
        res.status(400).json({
            message: "Failed to create user",
            status:false
        }) 
      }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill in all fields",
        status: false,
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email does not exist",
        status: false,
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Password is incorrect",
        status: false,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "myfallbacksecret",
      { expiresIn: "7d" }
    );

    // Send token in cookie and header
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .header("Authorization", `Bearer ${token}`)
      .status(200)
      .json({
        message: "User logged in successfully",
        status: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      status: false,
    });
  }
});

router.post("/logout", (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .status(200)
    .json({
      message: "User logged out successfully",
      status: true,
    });
});

router.get("/isLoggedIn",verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    res.status(200).json({
      message: "User is logged in",
      status: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", status: false });
  }
});


export default router;


