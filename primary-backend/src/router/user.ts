import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware";
import { signinSchema, signupSchema } from "../types";
import { prismaClient } from "../db";
import jwt from 'jsonwebtoken'
import { JWT_PASSWORD } from "../config/config";



export const userRouter = Router();


userRouter.post("/signup", async (req: Request, res: Response) => {

    const body = req.body;
    const parsedData = signupSchema.safeParse(body);
    console.log("Reached here 1")

    if(!parsedData.success){
        res.status(411).json({
            message: "Incorret inputs"
        })
        return;
    }

    console.log("Reached here 2")


    const userExists = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username
        }
    });
    if(userExists){
        res.status(403).json({
            message: "User already exists"
        })
        return;
    }

    await prismaClient.user.create({
        data: {
            email: parsedData.data.username,
            password: parsedData.data.password,
            name: parsedData.data.name
        }
    })

    console.log("Reached here 3")

    // await sendEmail();
    console.log("signup handler");
    res.json({
        message: "Please verify your email",
    })
    return

    
    // res.status(200).send("Signup successful");
});

userRouter.post("/signin", async (req: Request, res: Response) => {
    const body = req.body;
    const parsedData = signinSchema.safeParse(body);

    if(!parsedData.success){
        res.status(411).json({
            message: "Incorret inputs"
        })
        return;
    }

    const user = await prismaClient.user.findFirst({
        where:{
            email: parsedData.data.username,
            password: parsedData.data.password
        }
    })
    if(!user){
        res.status(403).json({
            message: "Sorry credentials are incorrect"
        })
        return;
    }


    const token = jwt.sign({
        id: user?.id
    }, JWT_PASSWORD)

    res.json({
        token: token
    })
});



userRouter.get("/", authMiddleware, async(req: Request, res: Response)=>{
    // fix the type id
    // @ts-ignore
    const id = req.id;
    const user = await prismaClient.user.findFirst({
        where:{
            id  
        },
        select:{
            name: true,
            email: true
        }
    })
    res.json({
        user
    })
})
