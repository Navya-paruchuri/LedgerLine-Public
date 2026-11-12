const express = require("express");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");
const router = express.Router();

// GET ALL MY TRANSACTIONS
router.get("/", auth, async (req, res) => {
  const list = await Transaction.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(list);
});

// ADD ONE
router.post("/", auth, async (req, res) => {
  const { desc, amount, type } = req.body;
  const t = new Transaction({ user: req.userId, desc, amount, type });
  await t.save();
  res.json(t);
});

// DELETE ONE
router.delete("/:id", auth, async (req, res) => {
  await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });
  res.json({ message: "Deleted" });
});

// CLEAR ALL
router.delete("/", auth, async (req, res) => {
  await Transaction.deleteMany({ user: req.userId });
  res.json({ message: "All cleared" });
});

module.exports = router;