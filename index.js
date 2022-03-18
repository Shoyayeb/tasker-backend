const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;



app.get("/", (req, res) => {
    res.send(`server running on ${port}`)
});
app.listen(port, () => {
    console.log(`http://localhost:${port}`, port);
})