import express, { Request, Response } from "express";
import jwt from "jsonwebtoken"
import { authMiddleware } from "./middlewares";
import { JWT_SECRET } from "@repo/backend-common/config"
import { CreateUserSchema, SignInSchema, CreateRoomSchema } from "@repo/common/types"
import { Prisma } from "@repo/db/client";
const app = express();

const port = 3001;

app.post("/signup", async (req: Request, res: Response) => {
    const parsedData = CreateUserSchema.safeParse(req.body)
    if(!parsedData.success){
        res.json({
            message: "Incorrect inputs"
        })
        return 
    } 

    try {
        await Prisma.user.create({
            data: {
                email: parsedData.data.email,
                password: parsedData.data.password,
                name: parsedData.data.name,  
            }
        })
    
        res.json({
            userId: 123123
        })
    } catch (error) {
        console.error("Error in sign up logic: ", error)
    }

    
})
app.post("/signin", (req: Request, res: Response) => {
    const data = SignInSchema.safeParse(req.body)
    if(!data.success){
        res.json({
            message: "Incorrect inputs"
        })
        return 
    }
    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET)
    res.json({
        token
    })
})
app.post("/room", authMiddleware,  (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body)
    if(!data.success){
        res.json({
            message: "Incorrect inputs "
        })
        return 
    }
    res.json({
        roomId: 123
    })
})

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
});