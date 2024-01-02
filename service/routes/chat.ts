import express, { Request, Response } from "express";
import { ResponsePrompt } from "../models/response-prompt";
import { logMessage } from "../utilities/logger";
import ragService from "../services/rag-service";

const router = express.Router();
import { Readable } from "stream";



logMessage('Found Controller: Chat');

/**
 * @swagger
 * /api/chat:
 *    post:
 *      tags:
 *        - Chat
 *      summary: Have dialog with the openai client
 *      consumes:
 *          - application/json
 *      parameters:
 *          - name: Prompt
 *            required: true
 *            in: body
 *            schema:
 *              $ref: "#/definitions/RequestPrompt"
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: String based responses
 */
router.post("/api/chat/", async (req: Request, res: Response) => {
    if (!req.body.prompt || req.body.prompt === "") {
        return res.status(400).send({ message: "You must supply a valid prompt." });
    }
    const stream = await ragService.AskPrompt(req.body.prompt);
    for await (const chunk of stream) {
        res.write(chunk);
    }
    return res.status(200).end();
});

/**
 * @swagger
 * tags:
 *   - name: Chat
 *     description: Dialog endpoints
 */
export default router;