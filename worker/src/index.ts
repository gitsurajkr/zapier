import { Kafka } from "kafkajs";

const TOPIC_NAMES = "zap-events";

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
})

async function main() {
    const consumer = kafka.consumer({ groupId: 'main-worker' });
    await consumer.connect();

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

            await new Promise(r => setTimeout(r, 1000))

            // publish some events for testing

            await consumer.commitOffsets([{
                topic: TOPIC_NAMES,
                partition: partition,
                offset: message.offset
                // offset: (parseInt(message.offset)+1).toString();
            }])
        }
    })
}

main();