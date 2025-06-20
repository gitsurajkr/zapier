import { PrismaClient } from "@prisma/client";
import{ Kafka }from "kafkajs";
const client = new PrismaClient();

const TOPIC_NAMES = "zap-events";

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
})

async function main() {

    const producer = kafka.producer();
    await producer.connect();
    while (1){
        const pendingRows = await client.zapRunOutbox.findMany({
            where: {},
            take: 10,
        })
        console.log(pendingRows)

        pendingRows.forEach(r => {
            producer.send({
                topic: TOPIC_NAMES,
                messages: 
                    pendingRows.map(r => ({
                        value: JSON.stringify({ zapRunId: r.zapRunId, stage: 0})
                    }))
            }).then(() => {
                console.log("Sent message to Kafka", r);
            }).catch(err => {
                console.error("Error sending message to Kafka", err);
            })
        })

    //      producer.send({
    //     topic: TOPIC_NAMES,
    //     messages: pendingRows.map(r => {
    //         return{
    //             value: JSON.stringify({zapRunId: r.zapRunId, stage: 0})
    //         }
    //     })
    //    })

        await client.zapRunOutbox.deleteMany({
            where: {
                id: {
                    in: pendingRows.map(r => r.id) 
                }
            }
        })

        await new Promise(r => setTimeout(r, 3000))
    }
}

main()