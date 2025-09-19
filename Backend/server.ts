import "reflect-metadata"; // This import is required for class-transformer and class-validator decorators
import express, {Request, Response, NextFunction} from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import routerSach from "./Routers/SachRouter";
import routerNhanVien from "./Routers/NhanVienRouter";
import routerTheoDoiMuonSach from "./Routers/TheoDoiMuonSachRouter";
import routerDocGia from "./Routers/DocGiaRouter";
import routerNhaXuatBan from "./Routers/NhaXuatBanRouter";
import AuthRouter from "./Routers/AuthRouter";
import { errorHandler } from "./Middleware/ErrorHandler";
import swaggerDocs from "./Utils/SwaggerConfig";
import NhanVien from "./Models/NHANVIEN";
import { UserRole } from "./Enums/UserRole";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }'
}));

// Authentication routes
app.use("/api/auth", AuthRouter);

app.use("/api/nhanvien", routerNhanVien);
app.use("/api/docgia", routerDocGia);
app.use("/api/sach", routerSach);
app.use("/api/muonsach", routerTheoDoiMuonSach);
app.use("/api/nhaxuatban", routerNhaXuatBan);

// Handle 404 routes - using a middleware without a path
// This will only be reached if no other middleware handles the request
app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler - must be after routes and 404 handler
app.use(errorHandler);

// Hàm tạo admin mặc định
const createDefaultAdmin = async () => {
    try {
        // Kiểm tra xem đã có admin nào chưa
        const existingAdmin = await NhanVien.findOne({ ChucVu: UserRole.ADMIN });

        if (!existingAdmin) {
            const defaultAdmin = new NhanVien({
                TenTaiKhoan: "admin",
                HoTenNV: "Administrator",
                MatKhau: "admin123", // Mật khẩu sẽ được mã hóa tự động bởi pre-save hook
                DiaChi: "Hệ thống",
                SoDienThoai: "0000000000",
                ChucVu: UserRole.ADMIN,
                Email: "admin@qlms.com"
            });

            await defaultAdmin.save();
            console.log("✅ Đã tạo admin mặc định:");
            console.log("   - Tên tài khoản: admin");
            console.log("   - Mật khẩu: admin123");
            console.log("   - Email: admin@qlms.com");
            console.log("   - MSNV:", defaultAdmin.MSNV);
        } else {
            console.log("ℹ️  Admin đã tồn tại trong hệ thống");
        }
    } catch (error) {
        console.error("❌ Lỗi khi tạo admin mặc định:", error);
    }
};

const database = process.env.MONGODB as string;
mongoose.connect(database)
.then(async () => {
    console.log("Kết nối cơ sở dữ liệu thành công");
    // Tạo admin mặc định sau khi kết nối DB thành công
    await createDefaultAdmin();
})
.catch(() => {
    console.log("Kết nối cơ sở dữ liệu không thành công");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Local Web: http://localhost:${port}`);
    console.log(`API Documentation: http://localhost:${port}/api-docs`);
});
