import { Request, Response, Router } from "express";

const router = Router();
router.post("/auth/webhook", (req, res) => {
    const authHeader = req.headers["authorization"];
    // console.log("Header:", authHeader);
    // console.log("Secret:", process.env.HELIUS_DEVNET_SECRET);
    // console.log("Equal:", authHeader === process.env.HELIUS_DEVNET_SECRET);
    if (authHeader !== process.env.HELIUS_DEVNET_SECRET) {
        return res.status(403).send("Forbidden");
    }
    console.log(req.body);
    res.status(200).send("OK");
});
export default router;
