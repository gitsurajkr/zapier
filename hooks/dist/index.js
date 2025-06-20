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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
console.log("Reached Here 1");
// https://hooks.zapier.com/hooks/catch/1234567/2342424/
// password logic
app.post('/hooks/catch/:hookId/:zapId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.hookId;
    const zapId = req.params.zapId;
    const body = req.body;
    console.log('Received hook:', { userId, zapId, body });
    console.log("Reached Here 2");
    yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const run = yield tx.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        });
        yield tx.zapRunOutbox.create({
            data: {
                zapRunId: run.id,
            }
        });
    }));
    console.log("Reached Here 3");
    // store in db a new trigger
    res.json({
        message: "Webhook Received"
    });
}));
app.listen(3002, () => {
    console.log('Server is running on port 3002');
});
