import express, {Request, Response, NextFunction} from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routerDocGia from "./Routers/DocGia";
import routerSach from "./Routers/Sach";
import routerNhanVien from "./Routers/NhanVien";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/nhanvien", routerNhanVien);
app.use("/api/docgia", routerDocGia);
app.use("/api/sach", routerSach);

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
})