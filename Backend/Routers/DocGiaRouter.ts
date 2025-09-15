import { Router } from "express";
import {addDG, updateDG, getDG, deleteDG, getallDG} from "../Controllers/DocGiaController";
const routerDocGia = Router();

routerDocGia.get("/get-dg/:id", getDG);
routerDocGia.post("/add-dg", addDG);
routerDocGia.put("/update-dg/:id", updateDG);
routerDocGia.delete("/delete-dg/:id", deleteDG);
routerDocGia.get("/get-all-dg", getallDG)

export default routerDocGia;