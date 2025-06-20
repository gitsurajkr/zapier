import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";
import { parse } from "./parser";
import { JsonObject } from "@prisma/client/runtime/library";
import { sendEmail } from "./email";
import { sendSol } from "./solana";

const TOPIC_NAMES = "zap-events";
const prismaClient = new PrismaClient()
const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
})

async function main() {
    const consumer = kafka.consumer({ groupId: 'main-worker' });
    await consumer.connect();

    const producer = kafka.producer();
    await producer.connect();
    

    await consumer.subscribe({
        topic: TOPIC_NAMES, fromBeginning: true
    })

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString()
            })
            
            if(!message.value?.toString()){
                return;
            }

            const parsedValue = JSON.parse(message.value.toString());
            const zapRunId = parsedValue.zapRunId;
            const stage = parsedValue.stage;

            const zapRunDetails = await prismaClient.zapRun.findFirst({
                where:{
                    id:zapRunId
                },
                include:{
                    zap:{
                        include: {
                            actions: {
                                include: {
                                    type: true
                                }
                            }

                        }
                    }
                }
            })

            console.log("................Zap run details...............")
            console.log(zapRunDetails)

            const currentAction = zapRunDetails?.zap?.actions.find(x => x.sortingOrder === stage)
            console.log(currentAction)

            if(!currentAction){
                console.log("Action Not found")
                return;
            }

            const zapRunMetadata = zapRunDetails?.metadata
            console.log(".................................Reached here..............")

            if(currentAction.type.id === "email"){
                const body = parse((currentAction.metadata as JsonObject)?.body as string, zapRunMetadata)
                const to = parse((currentAction.metadata as JsonObject)?.email as string, zapRunMetadata)
                console.log("sent email", to)

                console.log(`Sending out email to ${to} body is ${body}`)
                await sendEmail(to, body)
                console.log("sent email");
               
            }

            if(currentAction.type.id === "sol"){
                const amount = parse((currentAction.metadata as JsonObject)?.amount as string,zapRunMetadata)
                const address = parse((currentAction.metadata as JsonObject)?.address as string, zapRunMetadata)
                console.log(`Sending out Sol ${amount} address is ${address}`)
                console.log("Sent out Solana");
                await sendSol(address, amount)
            }


            await new Promise(r => setTimeout(r, 1000))

            // const zapId = message.value?.toString();
            const lastStage = (zapRunDetails?.zap?.actions?.length || 1) - 1;

            if(lastStage !== stage){
              console.log("publishing to another queue")
            await producer.send({
                topic: TOPIC_NAMES,
                messages: [{
                    value: JSON.stringify({
                        stage: stage+1,
                        zapRunId
                    })
                }]
                   
           
        })
            }
            console.log("Processing Done");

            // publish some events for testing

            await consumer.commitOffsets([{
                topic: TOPIC_NAMES,
                partition: partition,
                offset: (parseInt(message.offset)+1).toString()

                // offset: message.offset,
            }])
        }
    })
}

main();