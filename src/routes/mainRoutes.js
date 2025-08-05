import express from "express"
export const router = express.Router();
import * as mainControllers from "../controllers/mainControllers.js";

router.get("/", mainControllers.index);

router.get("/login", mainControllers.login);