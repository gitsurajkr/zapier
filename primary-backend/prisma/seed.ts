import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient()


async function main() {

    await prismaClient.availableTrigger.create({
        data: {
            id: "webhook",
            name: "webhook",
            image:"https://www.svix.com/resources/assets/images/color-webhook-240-1deccb0e365ff4ea493396ad28638fb7.png"
        }
    })


    await prismaClient.availableAction.create({
        data:{
            id:"sol",
            name:"solana",
            image: "https://s3.coinmarketcap.com/static-gravity/image/5cc0b99a8dd84fbfa4e150d84b5531f2.png"
        },

    })

     await prismaClient.availableAction.create({
        data:{
            id:"email",
            name:"Email",
            image: "https://t4.ftcdn.net/jpg/05/66/97/39/360_F_566973947_qXKNAvHWVY7UR710ACO4MkAdbDKIsaJu.jpg"
        },

    })

}

main()