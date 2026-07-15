import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
export const protect = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      let token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
      return res.status(404).json({
      success: false,
      message: "User not found"
    });
}
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token"
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed"
    });
  }
};
