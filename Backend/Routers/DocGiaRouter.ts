import { Router } from "express";
import {addDG, updateDG, getDocGiaByCustomId, deleteDG, getallDG, getDocGiaById} from "../Controllers/DocGiaController";
const routerDocGia = Router();

routerDocGia.get("/get-dg-by-custom-id/:id", getDocGiaByCustomId);
routerDocGia.get("/get-dg/:id", getDocGiaById);
routerDocGia.post("/add-dg", addDG);
routerDocGia.put("/update-dg/:id", updateDG);
routerDocGia.delete("/delete-dg/:id", deleteDG);
routerDocGia.get("/get-all-dg", getallDG)

export default routerDocGia;