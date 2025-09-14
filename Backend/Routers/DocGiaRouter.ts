import { Router } from "express";
import {addDG, updateDG, getDG, deleteDG} from "../Controllers/DocGiaController";
const routerDocGia = Router();

routerDocGia.get("/get-dg/:id", getDG);
routerDocGia.post("/add-dg", addDG);
routerDocGia.put("/update-dg/:id", updateDG);
routerDocGia.delete("/delete-dg/:id", deleteDG);

export default routerDocGia;