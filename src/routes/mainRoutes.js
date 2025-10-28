import express from "express"
export const router = express.Router();
import * as mainControllers from "../controllers/mainControllers.js";
import * as authControllers from "../controllers/authControllers.js";

router.get("/", mainControllers.index);

router.get("/formulario",mainControllers.formulario);

router.post("/formulario", mainControllers.postFormulario);

router.get("/login", authControllers.login);

router.post("/login", authControllers.postLogin);

router.post("/logout", authControllers.logout);

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: true, msg: "Error al cerrar sesión" });
        }
        res.redirect("/");
    });
});