import express, { Request, Response } from "express";
import { logMessage } from "../utilities/logger";
const router = express.Router();

logMessage('Found Controller: Health');

/**
 * @swagger
 * /api/health:
 *    get:
 *      tags:
 *        - Health
 *      summary: Determines if the service is in a healthy state
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: The service is in a healthy state
 */
router.get("/api/health/", (_: Request, res: Response) => {
    return res.send({ 
        message: "The service is operating correctly."
    })
});

/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Health check endpoint
 */
export default router;