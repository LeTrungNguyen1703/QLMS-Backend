import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Không có token, từ chối truy cập" });
  }

  try {
    // Sử dụng KEY_SECRET thay vì JWT_SECRET để khớp với phần tạo token
    req.user = jwt.verify(token, process.env.KEY_SECRET as string); 
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};

// Giữ lại export default để tránh phá vỡ code hiện tại
export default verifyToken;
