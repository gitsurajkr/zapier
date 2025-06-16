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
exports.userRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parsedData = types_1.signupSchema.safeParse(body);
    console.log("Reached here 1");
    if (!parsedData.success) {
        res.status(411).json({
            message: "Incorret inputs"
        });
        return;
    }
    console.log("Reached here 2");
    const userExists = yield db_1.prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username
        }
    });
    if (userExists) {
        res.status(403).json({
            message: "User already exists"
        });
        return;
    }
    yield db_1.prismaClient.user.create({
        data: {
            email: parsedData.data.username,
            password: parsedData.data.password,
            name: parsedData.data.name
        }
    });
    console.log("Reached here 3");
    // await sendEmail();
    console.log("signup handler");
    res.json({
        message: "Please verify your email",
    });
    return;
    // res.status(200).send("Signup successful");
}));
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parsedData = types_1.signinSchema.safeParse(body);
    if (!parsedData.success) {
        res.status(411).json({
            message: "Incorret inputs"
        });
        return;
    }
    const user = yield db_1.prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username,
            password: parsedData.data.password
        }
    });
    if (!user) {
        res.status(403).json({
            message: "Sorry credentials are incorrect"
        });
        return;
    }
    const token = jsonwebtoken_1.default.sign({
        id: user === null || user === void 0 ? void 0 : user.id
    }, config_1.JWT_PASSWORD);
    res.json({
        token: token
    });
}));
exports.userRouter.get("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // fix the type id
    // @ts-ignore
    const id = req.id;
    const user = yield db_1.prismaClient.user.findFirst({
        where: {
            id
        },
        select: {
            name: true,
            email: true
        }
    });
    res.json({
        user
    });
}));
