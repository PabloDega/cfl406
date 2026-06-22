// Winston, registro de eventos
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({ level: "debug" }),
    new winston.transports.File({ filename: "logs/error/app-error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/info/app.log", level: "info" }),
    new winston.transports.File({ filename: "logs/info/debug.log", level: "debug" })
  ],
});

export default logger;