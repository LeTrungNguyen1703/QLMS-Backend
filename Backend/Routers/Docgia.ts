
import { Router } from "express";
import {addDG, deleteDG, getallDG, getDG, updateDG} from "../Controllers/DocGia";
const routerdg = Router();
routerdg.get("/get-dg/:id", getDG);
routerdg.get("/getall-dg", getallDG);
routerdg.post("/add-dg", addDG);
routerdg.put("/update-dg/:id", updateDG);
routerdg.delete("/delete-dg/:id", deleteDG);

export default routerdg;