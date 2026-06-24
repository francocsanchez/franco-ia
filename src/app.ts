import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import morgan from "morgan";
import { assistantRoutes } from "./routes/assistantRoutes";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/assistant", assistantRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    error: "Route not found"
  });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = error instanceof Error ? error.message : "Internal server error";

  res.status(500).json({
    ok: false,
    error: message
  });
});
