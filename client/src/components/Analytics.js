import React from "react";
import { Progress } from "antd";
const Analytics = ({ alltransaction }) => {
  // total transaction
  const totalTransaction = alltransaction.length;
  const totalIncomeTransactions = alltransaction.filter(
    (transaction) => transaction.type === "income"
  );
  const totalExpenseTransactions = alltransaction.filter(
    (transaction) => transaction.type === "expense"
  );
  const totalIncomePercent =
    totalTransaction === 0
      ? 0
      : (totalIncomeTransactions.length / totalTransaction) * 100;

  const totalExpensePercent =
    totalTransaction === 0
      ? 0
      : (totalExpenseTransactions.length / totalTransaction) * 100;


  //total turnover
  const totalTurnover = alltransaction.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalIncomeTurnover = alltransaction
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalExpenseTurnover = alltransaction
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalIncomeTurnoverPercent =
    totalTurnover === 0 ? 0 : (totalIncomeTurnover / totalTurnover) * 100;

  const totalExpenseTurnoverPercent =
    totalTurnover === 0 ? 0 : (totalExpenseTurnover / totalTurnover) * 100;
  return(
    <>
      <div className="row m-3">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              Total Transactions : {totalTransaction}
            </div>
            <div className="card-body">
              <h5 className="text-success">
                Income : {totalIncomeTransactions.length}
              </h5>
              <h5 className="text-danger">
                Expense : {totalExpenseTransactions.length}
              </h5>
              <div>
                <Progress
                  type="circle"
                  strokeColor={"green"}
                  className="mx-2"
                  percent={totalIncomePercent.toFixed(0)}
                />
                <Progress
                  type="circle"
                  strokeColor={"red"}
                  className="mx-2"
                  percent={totalExpensePercent.toFixed(0)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">Total TurnOver : {totalTurnover}</div>
            <div className="card-body">
              <h5 className="text-success">Income : {totalIncomeTurnover}</h5>
              <h5 className="text-danger">Expense : {totalExpenseTurnover}</h5>
              <div>
                <Progress
                  type="circle"
                  strokeColor={"green"}
                  className="mx-2"
                  percent={totalIncomeTurnoverPercent.toFixed(0)}
                />
                <Progress
                  type="circle"
                  strokeColor={"red"}
                  className="mx-2"
                  percent={totalExpenseTurnoverPercent.toFixed(0)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    );
};

export default Analytics;