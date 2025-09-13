import { Router } from "express";
import {addDG, updateDG, getDG, deleteDG} from "../Controllers/Docgia";
const routerdg = Router();

routerdg.get("/get-dg/:id", getDG);
routerdg.post("/add-dg", addDG);
routerdg.put("/update-dg/:id", updateDG);
routerdg.delete("/delete-dg/:id", deleteDG);

export default routerdg;