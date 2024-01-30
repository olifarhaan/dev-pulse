import express from "express"
import dotenv from "dotenv/config"
import userRouter from "./routes/userRoute.js"
import authRouter from "./routes/authRoute.js"
import postRouter from "./routes/postRoute.js"
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js"
import responseMiddleware from "./middlewares/responseMiddleware.js"
import connect from "./db/connect.js"
import { PORT } from "./utils/constants.js"
import cookieParser from "cookie-parser"

const app = express()

//Middleware for parsing request & response------>
app.use(express.json())
app.use(cookieParser())
app.use(responseMiddleware)

//Routes ------------------------------------>
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/post", postRouter)

//Error hnadling middlewares------------------->
app.use(errorHandlerMiddleware)

// Server start code----------------------->
const start = async () => {
  try {
    await connect(process.env.MONGODB_CONNECTION_URI)
    console.log("MongoDB connected successfully")
    app.listen(PORT, () => {
      console.log("Server running at port:", PORT)
    })
  } catch (error) {
    console.log(error.message)
  }
}

start()
