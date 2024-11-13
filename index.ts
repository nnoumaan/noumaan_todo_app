// index.ts

import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.post("/users", async (req: Request, res: Response) => {
  console.log(req.body);
  const { name, email, mobile, city } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email, mobile, city },
    });
    res.status(201).json(user);
  } catch (er) {
    res.status(400).json({ er: "Error creating user" });
  }
});

app.get("/users", async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (user) {
    res.status(200).send(user);
  } else {
    res.status(404).json({ msg: "User Not Found" });
  }
});

app.put("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, mobile, city } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email, mobile, city },
    });
    res.json(user);
  } catch (err) {
    res.status(404).json({ err: "User not found" });
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "User deleted" });
  } catch (er) {
    res.status(404).json({ er: "User not found" });
  }
});

app.post("/tasks", async (req: Request, res: Response) => {
  const { userId, description, dueDate } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        description,
        dueDate,
        userId,
      },
    });
    res.json(task);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Error creating task" });
  }
});

app.get("/users/:userId/tasks", async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: Number(userId),
        taskDeleted: false,
      },
    });
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: "Error fetching tasks" });
  }
});

app.put("/tasks/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, dueDate } = req.body;
  try {
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { description, dueDate },
    });
    res.json(task);
  } catch (error) {
    res.status(404).json({ error: "Task not found" });
  }
});

app.delete("/tasks/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { taskDeleted : true },
    });
    res.json({ message: "Task was soft deleted" });
  } catch (error) {
    res.status(404).json({ error: "Task not found" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
