import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import dbConnect from './DB/dbConnect.js';
import authRuter from './routes/authUser.js';
import messageRouter from './routes/messageRouter.js';
import userRouter from './routes/userRoute.js';
import cors from 'cors';

import {app, server} from './Socket/socket.js';

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hi from the server");
})

app.use("/api/auth", authRuter);
app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);

const port = process.env.PORT || 8080;

server.listen(port, () => {
    dbConnect();
    console.log(`App is listening at ${port}`);
});
