import 'dotenv/config';
import express from "express";
const app = express();
app.use(express.urlencoded({ extended: false }));
import http from 'http';
const server = http.createServer(app);

//-----------------------------
// Layouts EJS
app.set("view engine", "ejs");
import expressEjsLayouts from 'express-ejs-layouts';
app.use(expressEjsLayouts);
app.set("layout", "./src/views/layouts/panel");

//-----------------------------
// cookies
import cookieSession from 'cookie-session';
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_KEYS1, process.env.SESSION_KEYS2],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
import cookieParser from 'cookie-parser';
app.use(cookieParser());

//-----------------------------
// Limiter
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	limit: 30,
	standardHeaders: true,
	legacyHeaders: false,
});


//-----------------------------
// Routes
import * as mainRoutes from "./src/routes/mainRoutes.js";
app.use("/", mainRoutes.router);

/* const panelRoutes = require("./src/routes/panelRoutes");
const { isNotLogged } = require("./src/middlewares/auth");
app.use("/panel", limiter, isNotLogged, panelRoutes);

const authRoutes = require("./src/routes/authRoutes");
app.use("/login", authRoutes);
app.use("/admin", authRoutes); */

app.use(express.static("public"));

app.use((req, res, next) => {
  res.status(404).redirect("/404.html");
});

//-----------------------------
// Server
const PORT = process.env.SERVERPORT;

server.listen(PORT, () => {
  console.log("Servidor activo en http://localhost:" + PORT);
});