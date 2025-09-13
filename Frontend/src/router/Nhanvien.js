import Register from "@/components/Register.vue";
import Login from "@/components/Login.vue";
import Infomation from "@/components/Infomation.vue";
import Update from "@/components/Update.vue";

export const Nhanvien = [
    {path: "/", name: "Login", component: Login},
    {path: "/register", name: "Register", component: Register},
    {path: "/infomation-nv/:id", name: "Infomation", component: Infomation},
    {path: "/update-nv/:id", name: "Update", component: Update}

]
