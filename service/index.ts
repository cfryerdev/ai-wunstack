import express from "express";
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger";
import HealthController from "./routes/health";
import ChatController from "./routes/chat";
import ragService from "./services/rag-service";
import { logMessage } from "./utilities/logger";

import * as dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 8080;

(async () => {
  try {
    const app = express();

    app.use(cors());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.use(HealthController);
    app.use(ChatController);
    
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    
    app.get("/swagger.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerDocument);
    });

    if (process.env.TRAIN_ON_START === 'true') {
      logMessage(`Training Rag...`);
      await ragService.TeachPrompt();
    }
    
    app.listen(port, (err?: any) => {
      if (err) throw err;
      logMessage(`Service Ready: http://localhost:${port}/api-docs/`);
    });
    
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();