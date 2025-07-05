import { Request, Response, Router } from "express";

const healthRouter: Router = Router();

/**
 * @swagger
 * /v1/health:
 *   get:
 *      description: Health check
 *      responses: 
 *        200:
 *          description: OK
 *      tags:
 *        - Health
 */
healthRouter.get("/", (req: Request, res: Response) => {
  res.status(200).send("OK");
});

export default healthRouter