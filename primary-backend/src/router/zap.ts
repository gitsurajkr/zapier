import { Request, Response, Router } from "express";
import { authMiddleware } from "../middleware";
import { zapCreateSchema } from "../types";
import { prismaClient } from "../db";

export const zapRouter = Router();

zapRouter.post("/", authMiddleware, async (req: Request, res: Response) => {
    console.log("Create a zap");
    // @ts-ignore
    const id = req.id
    const body = req.body;

    const parsedData = zapCreateSchema.safeParse(body)

    if (!parsedData.success) {
        res.status(411).json({
            message: "Incorrect inputs"
        })
        return;
    }

    const zapId = await prismaClient.$transaction(async tx => {
        const zap = await tx.zap.create({
            data: {
                userId: id,
                triggerId: "",
                actions: {
                    create: parsedData.data.actions.map((x, index) => ({
                        actionId: x.availableActionId,
                        sortingOrder: index
                    }))
                }
            }
        })
        const trigger = await tx.trigger.create({
            data: {
                triggerId: parsedData.data.availableTriggerId,
                zapId: zap.id
            }
        })
        await tx.zap.update({
            where: { id: zap.id },
            data: {
                triggerId: trigger.id
            }
        })

        return zap.id;
    })

    res.json({
        zapId
    })

})

zapRouter.get("/", authMiddleware, async (req, res) => {
    // @ts-ignore
    const id = req.id;
    const zaps = await prismaClient.zap.findMany({
        where: {
            userId: id
        },
        include: {
            actions: {
                include: {
                    type: true
                }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    })
    console.log("Get all the zap")
    res.json({
        zaps
    })
    return;
})

zapRouter.get("/:zapid", authMiddleware, async (req, res) => {
    // @ts-ignore
    const id = req.id
    const zapId = req.params.zapId;
    const zap = await prismaClient.zap.findFirst({
        where: {
            id: zapId,
            userId: id

        },
        include: {
            actions: {
                include: {
                    type: true
                }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    })
    console.log("Get the zap")
    res.json({
        zap
    })
    return;
})
