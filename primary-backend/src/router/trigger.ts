import { Router } from "express";
import { prismaClient } from "../db";

const router = Router();

// /api/v1/trigger/available
console.log("Reached trigger")
router.get("/available",async(req, res) => {
    const availableTriggers = await prismaClient.availableTrigger.findMany({})
    res.json({
        availableTriggers
    })
})

export const triggerRouter = router;