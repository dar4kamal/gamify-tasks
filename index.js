const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;

const users = require("./routes/users");
const tasks = require("./routes/tasks");

app.use(express.json({ extended: false }));
app.use(cors());
app.use(morgan("tiny"));

app.use("/api/tasks", tasks);
app.use("/api/users", users);

app.use("/", (req, res) => {
  res.send("API is working ....");
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
