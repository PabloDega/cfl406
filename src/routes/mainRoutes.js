import express from "express"
export const router = express.Router();
///const panelControllers = require("../controllers/panelControllers");
//const validar = require("../middlewares/validador");
//const auth = require("../middlewares/auth")

router.get("/", (req, res) => {res.send("hola")});

//router.get("/productos/card", auth.authProduccion, panelControllers.productosCard);