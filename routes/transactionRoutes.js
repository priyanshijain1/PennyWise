// const express = require("express");
// const {
//   addTransaction,
//   getAllTransaction,
//   editTransaction,
//   deleteTransaction
// } = require("../controllers/transactionCtrl");

// //router object
// const router = express.Router();

// //routes
// // add transaction POST Method
// router.post('/add-transaction', addTransaction)
// //Edit transection POST MEthod
// router.post("/edit-transaction", editTransaction);
// //Delete transection POST MEthod
// router.post("/delete-transaction", deleteTransaction);


// // get transactions
// router.post('/get-transaction', getAllTransaction)

// module.exports = router;



const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  addTransaction,
  getAllTransaction,
  editTransaction,
  deleteTransaction
} = require("../controllers/transactionCtrl");

const router = express.Router();

router.post('/add-transaction', protect, addTransaction);
router.post('/edit-transaction', protect, editTransaction);
router.post('/delete-transaction', protect, deleteTransaction);
router.post('/get-transaction', protect, getAllTransaction);

module.exports = router;
