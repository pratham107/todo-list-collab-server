import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  // Check token in header or cookies

  // console.log(req.cookies.token)
  const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "No token provided. Access denied.",
      status: false,
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "myfallbacksecret");
    // Attach user info to request object
    req.user = decoded;

    next(); 
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token, Please Login again",
      status: false,
    });
  }
};

export default verifyToken;
