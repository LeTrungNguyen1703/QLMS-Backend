import Register from "@/components/pages/Register.vue";
import Login from "@/components/pages/Login.vue";
import Infomation from "@/components/employee/Infomation.vue";
import Update from "@/components/pages/updates/Update.vue";

export const Nhanvien = [
    {path: "/", name: "Login", component: Login},
    {path: "/register", name: "Register", component: Register},
    {path: "/infomation-nv/:id", name: "Infomation", component: Infomation},
    {path: "/update-nv/:id", name: "Update", component: Update}
]
