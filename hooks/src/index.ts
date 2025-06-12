import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();


// https://hooks.zapier.com/hooks/catch/1234567/2342424/

// password logic

app.post('/hooks/catch/:hookId/:zapId?', async (req, res) => {
    const userId = req.params.hookId;
    const zapId = req.params.zapId;
    const body = req.body;
    console.log('Received hook:', { userId, zapId, body });=
    await prisma.$transaction(async tx => {
        const run = await prisma.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        });
        await prisma.zapRunOutbox.create({
            data: {
                zapRunId: run.id,
            }
        })
    })
    // store in db a new trigger
    await prisma.zapRun.create({
        data: {
            zapId: zapId

        }
    })
})