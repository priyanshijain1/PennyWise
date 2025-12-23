const transactionModel = require('../models/transactionModel');
const moment = require("moment");

const getAllTransaction = async (req, res) => {
  try {
    const { frequency, selectedDate, type } = req.body;

    const transactions = await transactionModel.find({
      userid: req.user,   // 🔐 FROM JWT, NOT FRONTEND
      ...(frequency !== "custom"
        ? {
            date: {
              $gt: moment().subtract(Number(frequency), "d").toDate(),
            },
          }
        : {
            date: {
              $gte: selectedDate[0],
              $lte: selectedDate[1],
            },
          }),
      ...(type !== "all" && { type }),
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json(error);
  }
};

const addTransaction = async (req, res) => {
  try {
    const newTransaction = new transactionModel({
      ...req.body,
      userid: req.user, // 🔐 FROM TOKEN
    });

    await newTransaction.save();

    res.status(201).json({
      success: true,
      message: "Transaction Created",
      data: newTransaction,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const editTransaction = async (req, res) => {
  try {
    await transactionModel.findOneAndUpdate(
      { _id: req.body.transactionId, userid: req.user },
      req.body.payload
    );
    res.status(200).send("Edited Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteTransaction = async (req, res) => {
  try {
    await transactionModel.findOneAndDelete({
      _id: req.body.transactionId,
      userid: req.user,
    });
    res.status(200).send("Transaction Deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getAllTransaction,
  addTransaction,
  editTransaction,
  deleteTransaction,
};
