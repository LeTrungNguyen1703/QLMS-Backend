import express, {Request, Response, NextFunction} from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routerSach from "./Routers/SachRouter";
import routerNhanVien from "./Routers/NhanVienRouter";
import routerTheoDoiMuonSach from "./Routers/TheoDoiMuonSachRouter";
import routerDocGia from "./Routers/DocGiaRouter";
import { errorHandler } from "./Middleware/ErrorHandler";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/nhanvien", routerNhanVien);
app.use("/api/docgia", routerDocGia);
app.use("/api/sach", routerSach);
app.use("/api/muonsach", routerTheoDoiMuonSach);

// Handle 404 routes - using a middleware without a path
// This will only be reached if no other middleware handles the request
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler - must be after routes and 404 handler
app.use(errorHandler);

const database = process.env.MONGODB as string;
mongoose.connect(database)
.then(() => {
    console.log("Kết nối cơ sở dữ liệu thành công");
})
.catch(() => {
    console.log("Kết nối cơ sở dữ liệu không thành công");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Local Web: http://localhost:${port}`);
});
