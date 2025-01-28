import express, { Request, Response } from "express";
import jwt from "jsonwebtoken"
import { authMiddleware } from "./middlewares";
import { JWT_SECRET } from "@repo/backend-common/config"
import { CreateUserSchema, SignInSchema, CreateRoomSchema } from "@repo/common/types"
import { Prisma } from "@repo/db/client";
const app = express();

const port = 3001;

declare global {
    namespace Express {
      interface Request {
        userId?: string; // Add your expected type for `userId` here
      }
    }
  }

app.post("/signup", async (req: Request, res: Response) => {
    const parsedData = CreateUserSchema.safeParse(req.body)
    if(!parsedData.success){
        res.json({
            message: "Incorrect inputs"
        })
        return 
    } 

    try {
        const user = await Prisma.user.create({
            data: {
                email: parsedData.data.email,
                password: parsedData.data.password,
                name: parsedData.data.name,  
            }
        })
    
        res.json({
            userId: user.id
        })
    } catch (error) {
        console.error("Error in sign up logic: ", error)
    }

    
})
app.post("/signin", async (req: Request, res: Response) => {
    const parsedData = SignInSchema.safeParse(req.body)
    if(!parsedData.success){
        res.json({
            message: "Incorrect inputs"
        })
        return 
    }
    const user  = await Prisma.user.findFirst({
        where: {
            email: parsedData.data.email,
            password: parsedData.data.password
        }
    })
    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET)
    res.json({
        token
    })
})
app.post("/room", authMiddleware,  async (req: Request, res: Response) => {
    const userId  = req.userId
    const parsedData = CreateRoomSchema.safeParse(req.body)
    if(!parsedData.success){
        res.json({
            message: "Incorrect inputs "
        })
        return 
    }
    if(!userId){
        res.status(403).json({
            message: "Middleware didnt sent the userId"
        })
        return 
    }
    const room = await Prisma.room.create({
        data: {
            slug: parsedData.data.name,
            adminId: userId
        }
    })
    res.json({
        roomId: room.id
    })

})

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
});
