import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "./config/data.config";
import { redisMiddleWare } from "./middleware/redis.middleware";
import { errorHandling } from "./middleware/error.middleware";
import { authRouter } from "./routes/auth.router";
import { propertyRouter } from "./routes/property.router";
import { roomRouter } from "./routes/room.router";
import { notificationRouter } from "./routes/notification.router";

const app = express();

app.set("trust proxy", 1);
app.use(morgan("dev"));
app.use(helmet());

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1000,
    }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(compression());

app.use(
    cors({
        origin: config.frontendUrl,
        credentials: true,
    }),
);

app.use(redisMiddleWare);

app.use("/api/auth", authRouter);
app.use("/api/property", propertyRouter);
app.use("/api/room", roomRouter);
app.use("/api/notification", notificationRouter);

app.get("/test", (_: Request, res: Response) => {
    res.send("Server is running");
});

app.use((_: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.use(errorHandling);

export default app;
