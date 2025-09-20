import React from "react";
import { Progress, Card, Row, Col, Statistic, Typography, Space, Tag, Divider } from "antd";
import { RiseOutlined, FallOutlined, PieChartOutlined, BarChartOutlined,DollarOutlined,TransactionOutlined} from "@ant-design/icons";

const { Title, Text } = Typography;

const Analytics = ({ alltransaction }) => {
  const categories = [
    "salary",
    "tip", 
    "project",
    "food",
    "movie",
    "bills",
    "medical",
    "fee",
    "tax",
  ];

  // Category icons mapping
  const categoryIcons = {
    salary: "💼",
    tip: "🎯", 
    project: "📁",
    food: "🍕",
    movie: "🎬",
    bills: "📋",
    medical: "⚕️",
    fee: "💳",
    tax: "📊"
  };

  // Total transaction calculations
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

  // Total turnover calculations
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

  const balance = totalIncomeTurnover - totalExpenseTurnover;

  return (
    <div style={{ padding: "20px 0" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={3}>
          <BarChartOutlined /> Financial Analytics
        </Title>
        <Text type="secondary">
          Comprehensive overview of your financial transactions and spending patterns
        </Text>
      </div>

      {/* Summary Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {/* Transaction Count Card */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <TransactionOutlined />
                Transaction Overview
              </Space>
            }
            variant={false}
            style={{ height: "100%" }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Statistic
                  title="Total Transactions"
                  value={totalTransaction}
                  style={{ textAlign: "center", marginBottom: 16 }}
                />
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card size="small" style={{ textAlign: "center", background: "#f6ffed" }}>
                  <Statistic
                    title="Income"
                    value={totalIncomeTransactions.length}
                    valueStyle={{ color: "#52c41a", fontSize: "18px" }}
                    prefix={<RiseOutlined />}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ textAlign: "center", background: "#fff2f0" }}>
                  <Statistic
                    title="Expenses"
                    value={totalExpenseTransactions.length}
                    valueStyle={{ color: "#f5222d", fontSize: "18px" }}
                    prefix={<FallOutlined />}
                  />
                </Card>
              </Col>
            </Row>

            <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
              <Progress
                type="circle"
                size={80}
                strokeColor="#52c41a"
                percent={Math.round(totalIncomePercent)}
                format={() => `${Math.round(totalIncomePercent)}%`}
              />
              <Progress
                type="circle"
                size={80}
                strokeColor="#f5222d"
                percent={Math.round(totalExpensePercent)}
                format={() => `${Math.round(totalExpensePercent)}%`}
              />
            </div>
          </Card>
        </Col>

        {/* Turnover Card */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <DollarOutlined />
                Financial Summary
              </Space>
            }
            variant={false}
            style={{ height: "100%" }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Statistic
                  title="Total Turnover"
                  value={totalTurnover}
                  prefix="₹"
                  style={{ textAlign: "center", marginBottom: 16 }}
                />
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card size="small" style={{ textAlign: "center", background: "#f6ffed" }}>
                  <Statistic
                    title="Total Income"
                    value={totalIncomeTurnover}
                    prefix="₹"
                    valueStyle={{ color: "#52c41a", fontSize: "16px" }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ textAlign: "center", background: "#fff2f0" }}>
                  <Statistic
                    title="Total Expenses"
                    value={totalExpenseTurnover}
                    prefix="₹"
                    valueStyle={{ color: "#f5222d", fontSize: "16px" }}
                  />
                </Card>
              </Col>
            </Row>

            <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
              <Progress
                type="circle"
                size={80}
                strokeColor="#52c41a"
                percent={Math.round(totalIncomeTurnoverPercent)}
                format={() => `${Math.round(totalIncomeTurnoverPercent)}%`}
              />
              <Progress
                type="circle"
                size={80}
                strokeColor="#f5222d"
                percent={Math.round(totalExpenseTurnoverPercent)}
                format={() => `${Math.round(totalExpenseTurnoverPercent)}%`}
              />
            </div>
          </Card>
        </Col>

        {/* Balance Card */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <PieChartOutlined />
                Current Balance
              </Space>
            }
            variant={false}
            style={{ height: "100%" }}
          >
            <div style={{ textAlign: "center" }}>
              <Statistic
                title="Net Balance"
                value={balance}
                prefix="₹"
                valueStyle={{ 
                  color: balance >= 0 ? "#52c41a" : "#f5222d",
                  fontSize: "32px",
                  fontWeight: "bold"
                }}
                suffix={balance >= 0 ? <RiseOutlined /> : <FallOutlined />}
              />
              
              <div style={{ marginTop: 24 }}>
                <Tag 
                  color={balance >= 0 ? "green" : "red"} 
                  style={{ padding: "8px 16px", fontSize: "14px" }}
                >
                  {balance >= 0 ? "Surplus" : "Deficit"}: ₹{Math.abs(balance).toLocaleString()}
                </Tag>
              </div>
              
              <div style={{ marginTop: 16 }}>
                <Progress
                  percent={balance >= 0 ? 100 : 0}
                  strokeColor={balance >= 0 ? "#52c41a" : "#f5222d"}
                  showInfo={false}
                />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Financial Health Indicator
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Category Analysis */}
      <Title level={4} style={{ marginBottom: 24 }}>
        <PieChartOutlined /> Category-wise Analysis
      </Title>

      <Row gutter={[24, 24]}>
        {/* Income Categories */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <RiseOutlined style={{ color: "#52c41a" }} />
                <span>Income by Category</span>
              </Space>
            }
            variant={false}
          >
            {totalIncomeTurnover > 0 ? (
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                {categories.map((category) => {
                  const amount = alltransaction
                    .filter(
                      (transaction) =>
                        transaction.type === "income" &&
                        transaction.category === category
                    )
                    .reduce((acc, transaction) => acc + transaction.amount, 0);
                  
                  if (amount > 0) {
                    const percentage = ((amount / totalIncomeTurnover) * 100);
                    return (
                      <Card 
                        key={category}
                        size="small" 
                        style={{ background: "#f6ffed" }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <Space>
                            <span style={{ fontSize: "18px" }}>{categoryIcons[category]}</span>
                            <Text strong style={{ textTransform: "capitalize" }}>
                              {category}
                            </Text>
                          </Space>
                          <Text strong style={{ color: "#52c41a" }}>
                            ₹{amount.toLocaleString()}
                          </Text>
                        </div>
                        <Progress
                          percent={Math.round(percentage)}
                          strokeColor="#52c41a"
                          format={(percent) => `${percent}%`}
                        />
                      </Card>
                    );
                  }
                  return null;
                })}
              </Space>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Text type="secondary">No income transactions found</Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Expense Categories */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <FallOutlined style={{ color: "#f5222d" }} />
                <span>Expenses by Category</span>
              </Space>
            }
            variant={false}
          >
            {totalExpenseTurnover > 0 ? (
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                {categories.map((category) => {
                  const amount = alltransaction
                    .filter(
                      (transaction) =>
                        transaction.type === "expense" &&
                        transaction.category === category
                    )
                    .reduce((acc, transaction) => acc + transaction.amount, 0);
                  
                  if (amount > 0) {
                    const percentage = ((amount / totalExpenseTurnover) * 100);
                    return (
                      <Card 
                        key={category}
                        size="small" 
                        style={{ background: "#fff2f0" }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <Space>
                            <span style={{ fontSize: "18px" }}>{categoryIcons[category]}</span>
                            <Text strong style={{ textTransform: "capitalize" }}>
                              {category}
                            </Text>
                          </Space>
                          <Text strong style={{ color: "#f5222d" }}>
                            ₹{amount.toLocaleString()}
                          </Text>
                        </div>
                        <Progress
                          percent={Math.round(percentage)}
                          strokeColor="#f5222d"
                          format={(percent) => `${percent}%`}
                        />
                      </Card>
                    );
                  }
                  return null;
                })}
              </Space>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Text type="secondary">No expense transactions found</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;