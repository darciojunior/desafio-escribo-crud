import express from "express";
import path from 'path'
const app = express();

import "express-async-errors";
import "dotenv/config";
import mongoose from "mongoose";

//routers
import authRouter from './routes/authRouter.js'

app.use(express.json());

app.get("/", (req, res) => {
  res.send("");
});

app.use('/api/v1/auth', authRouter)

app.post("/", (req, res) => {
  console.log(req);
  res.json({ message: "data received", data: req.body });
});

const port = process.env.PORT || 5000;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
