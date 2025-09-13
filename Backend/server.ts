import express, {Request, Response, NextFunction} from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routernv from "./Routers/Nhanvien";
import routerdg from "./Routers/Docgia";
import routersach from "./Routers/Sach";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/nhanvien", routernv);
app.use("/api/docgia", routerdg);
app.use("/api/sach", routersach);

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