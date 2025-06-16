import express from "express";
import { userRouter } from "./router/user";
import { zapRouter } from "./router/zap";
import cors from 'cors'
const app = express();

app.use(express.json());
app.use(cors());

console.log("Reached here")

app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter);

app.listen(3000, ()=>{
    console.log("your are running on localhost:3000")
})
