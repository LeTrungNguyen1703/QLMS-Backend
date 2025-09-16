// filepath: c:\Users\Lenovo\WebstormProjects\QLMS\Backend\Routers\NhaXuatBanRouter.ts
import { Router } from "express";
import { 
    addNXB,
    updateNXB, 
    getNhaXuatBanByCustomId, 
    deleteNXB, 
    getAllNXB, 
    getNhaXuatBanById 
} from "../Controllers/NhaXuatBanController";

const routerNhaXuatBan = Router();

routerNhaXuatBan.get("/get-nxb-by-custom-id/:id", getNhaXuatBanByCustomId);
routerNhaXuatBan.get("/get-nxb/:id", getNhaXuatBanById);
routerNhaXuatBan.post("/add-nxb", addNXB);
routerNhaXuatBan.put("/update-nxb/:id", updateNXB);
routerNhaXuatBan.delete("/delete-nxb/:id", deleteNXB);
routerNhaXuatBan.get("/get-all-nxb", getAllNXB);

export default routerNhaXuatBan;
