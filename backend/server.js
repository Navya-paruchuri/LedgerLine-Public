const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("LedgerLine Backend Running"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/transactions", require("./routes/transactions"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));