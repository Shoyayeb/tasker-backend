const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.4f4qc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        // connecting to mongodb
        await client.connect();
        const database = client.db("tasker");
        const tasksCollection = database.collection("tasks");
        const completedTasksCollection = database.collection("completed");

        // GET API's
        app.get("/tasks", async (req, res) => {
            const cursor = tasksCollection.find({});
            const tasks = await cursor.toArray();
            res.send(tasks);
        });
        app.get("/completedtasks", async (req, res) => {
            const cursor = completedTasksCollection.find({});
            const tasks = await cursor.toArray();
            res.send(tasks);
        });
        app.get("/tasks/:id", async (req, res) => {
            const id = req.params.id;
            const query = { uid: id };
            const cursor = await tasksCollection.find(query);
            const tasks = await cursor.toArray();
            res.json(tasks);
        });
        app.get("/task/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const task = await tasksCollection.findOne(query);
            res.json(task);
        });

        // POST API's
        app.post("/addtask", async (req, res) => {
            console.log(req.body);
            const task = req.body;
            const result = await tasksCollection.insertOne(task);
            res.json(result);
        });
        // POST API's
        app.post("/addcompletedtask", async (req, res) => {
            console.log(req.body);
            const task = req.body;
            const result = await completedTasksCollection.insertOne(task);
            res.json(result);
        });

        // PUT API's
        app.put("/tasks/updateTask/:id", async (req, res) => {
            const id = req.params.id;
            const updatedTask = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    uid: updatedTask.uid,
                    Done: updatedTask.Done,
                    Importance: updatedTask.Importance,
                    Time: updatedTask.Time,
                    Date: updatedTask.Date,
                    Task: updatedTask.Task,
                },
            };
            const result = await tasksCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.send(result);
        });

        // DELETE API's
        app.delete("/tasks/:id", async (req, res) => {
            const id = req.params.id;
            const querry = { _id: ObjectId(id) };
            const result = await tasksCollection.deleteOne(querry);
            console.log(result);
            console.log("deleting task with id", id);
            res.json(result);
        });
    } finally {
        // await client.close();
    }
}

run().catch(console.dir)


app.get("/", (req, res) => {
    res.send(`server running on ${port}`)
});
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})