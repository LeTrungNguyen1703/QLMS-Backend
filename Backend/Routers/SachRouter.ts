import { Router } from "express";
import {addSach, updateSach, getSach, deleteSach, getallSach} from "../Controllers/SachController";

const routerSach = Router();

routerSach.get("/get-sach/:id", getSach);
routerSach.post("/add-sach", addSach);
routerSach.put("/update-sach/:id", updateSach);
routerSach.delete("/delete-sach/:id", deleteSach);
routerSach.get("/get-all-sach", getallSach);

export default routerSach;
