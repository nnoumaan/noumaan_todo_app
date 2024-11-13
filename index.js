"use strict";
// index.ts
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
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { name, email, mobile, city } = req.body;
    try {
        const user = yield prisma.user.create({
            data: { name, email, mobile, city },
        });
        res.status(201).json(user);
    }
    catch (er) {
        res.status(400).json({ er: "Error creating user" });
    }
}));
app.get("/users", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany();
    res.status(200).json(users);
}));
app.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield prisma.user.findUnique({
        where: { id: Number(id) },
    });
    if (user) {
        res.status(200).send(user);
    }
    else {
        res.status(404).json({ msg: "User Not Found" });
    }
}));
app.put("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email, mobile, city } = req.body;
    try {
        const user = yield prisma.user.update({
            where: { id: Number(id) },
            data: { name, email, mobile, city },
        });
        res.json(user);
    }
    catch (err) {
        res.status(404).json({ err: "User not found" });
    }
}));
app.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.user.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "User deleted" });
    }
    catch (er) {
        res.status(404).json({ er: "User not found" });
    }
}));
app.post("/tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, description, dueDate } = req.body;
    try {
        const task = yield prisma.task.create({
            data: {
                description,
                dueDate,
                userId,
            },
        });
        res.json(task);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error: "Error creating task" });
    }
}));
app.get("/users/:userId/tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const tasks = yield prisma.task.findMany({
            where: {
                userId: Number(userId),
                taskDeleted: false,
            },
        });
        res.json(tasks);
    }
    catch (error) {
        res.status(400).json({ error: "Error fetching tasks" });
    }
}));
app.put("/tasks/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description, dueDate } = req.body;
    try {
        const task = yield prisma.task.update({
            where: { id: Number(id) },
            data: { description, dueDate },
        });
        res.json(task);
    }
    catch (error) {
        res.status(404).json({ error: "Task not found" });
    }
}));
app.delete("/tasks/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const task = yield prisma.task.update({
            where: { id: Number(id) },
            data: { taskDeleted: true },
        });
        res.json({ message: "Task was soft deleted" });
    }
    catch (error) {
        res.status(404).json({ error: "Task not found" });
    }
}));
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
