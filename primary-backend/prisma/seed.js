"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prismaClient = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prismaClient.availableTrigger.create({
            data: {
                id: "webhook",
                name: "webhook",
                image: "https://www.svix.com/resources/assets/images/color-webhook-240-1deccb0e365ff4ea493396ad28638fb7.png"
            }
        });
        yield prismaClient.availableAction.create({
            data: {
                id: "sol",
                name: "solana",
                image: "https://s3.coinmarketcap.com/static-gravity/image/5cc0b99a8dd84fbfa4e150d84b5531f2.png"
            },
        });
        yield prismaClient.availableAction.create({
            data: {
                id: "email",
                name: "Email",
                image: "https://t4.ftcdn.net/jpg/05/66/97/39/360_F_566973947_qXKNAvHWVY7UR710ACO4MkAdbDKIsaJu.jpg"
            },
        });
    });
}
main();
