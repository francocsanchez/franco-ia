import { Router } from "express";
import { assistantController } from "../controllers/assistantController";

export const assistantRoutes = Router();

assistantRoutes.post("/chat", assistantController);
