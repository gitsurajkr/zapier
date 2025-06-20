import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

    console.log("Reached Here 1");

// https://hooks.zapier.com/hooks/catch/1234567/2342424/

// password logic

app.post('/hooks/catch/:hookId/:zapId', async (req, res) => {
    const userId = req.params.hookId;
    const zapId = req.params.zapId;
    const body = req.body;
    console.log('Received hook:', { userId, zapId, body });

    console.log("Reached Here 2");

    await prisma.$transaction(async tx => {
        const run = await tx.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        });
        await tx.zapRunOutbox.create({
            data: {
                zapRunId: run.id,
            }
        })
    })

    console.log("Reached Here 3");

    // store in db a new trigger

    res.json({
        message: "Webhook Received"
    })
    
})

app.listen(3002, () => {
    console.log('Server is running on port 3002');
});