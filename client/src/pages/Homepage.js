import React, { useState, useEffect, useCallback } from "react";
import {Form,Input,message,Modal,Select,Table,DatePicker,Card,Row,Col,Statistic,Tag,
  Button,Space,Tooltip,Typography,Divider,Badge} from "antd";
import {UnorderedListOutlined,AreaChartOutlined,EditOutlined,DeleteOutlined,PlusOutlined,
  DollarOutlined,RiseOutlined,FallOutlined,CalendarOutlined,FilterOutlined,ExclamationCircleOutlined,WalletOutlined,
} from "@ant-design/icons";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import Spinner from "./../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { confirm } = Modal;

const HomePage = () => {
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alltransaction, setAlltransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);

  // Calculate summary statistics
  const totalIncome = alltransaction
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = alltransaction
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;

  // Enhanced table columns with better styling
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => (
        <Text strong>{moment(text).format("MMM DD, YYYY")}</Text>
      ),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount, record) => (
        <Text
          strong
          style={{
            color: record.type === "income" ? "#52c41a" : "#f5222d",
            fontSize: "16px"
          }}
        >
          {record.type === "income" ? "+" : "-"}₹{amount.toLocaleString()}
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type) => (
        <Tag
          color={type === "income" ? "green" : "red"}
          icon={type === "income" ? <RiseOutlined /> : <FallOutlined />}
        >
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (category) => (
        <Tag color="blue">{category.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Reference",
      dataIndex: "reference",
      render: (text) => text || <Text type="secondary">-</Text>,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (
        <Tooltip title={text}>
          <Text ellipsis style={{ maxWidth: 150 }}>
            {text || <Text type="secondary">No description</Text>}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Transaction">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete Transaction">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    setEditable(record);
    form.setFieldsValue({
      ...record,
      date: moment(record.date).format("YYYY-MM-DD"),
    });
    setShowModal(true);
  };

  const showDeleteConfirm = (record) => {
    confirm({
      title: 'Are you sure you want to delete this transaction?',
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently delete the ${record.type} of ₹${record.amount}`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        handleDelete(record);
      },
    });
  };

  // Get all transactions
  const getAllTransactions = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      const res = await axios.post("transactions/get-transaction", {
        userid: user._id,
        frequency,
        selectedDate,
        type,
      });

      setLoading(false);
      setAlltransaction(res.data);
      console.log("Fetched transactions:", res.data);
    } catch (error) {
      setLoading(false);
      console.log("Fetch error:", error);
      message.error("Failed to fetch transactions");
    }
  }, [frequency, selectedDate, type]);

  useEffect(() => {
    getAllTransactions();
  }, [getAllTransactions]);

  // Delete handler
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post("/transactions/delete-transaction", {
        transactionId: record._id,
      });
      setLoading(false);
      message.success("Transaction deleted successfully!");
      await getAllTransactions();
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Failed to delete transaction");
    }
  };

  // Form handling
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      
      if (editable) {
        await axios.post("/transactions/edit-transaction", {
          payload: {
            ...values,
            userId: user._id,
          },
          transactionId: editable._id,
        });
        setLoading(false);
        message.success("Transaction updated successfully");
      } else {
        const transactionData = {
          ...values,
          amount: Number(values.amount),
          userid: user._id,
        };

        await axios.post("/transactions/add-transaction", transactionData);
        setLoading(false);
        message.success("Transaction added successfully");
      }
      
      setShowModal(false);
      setEditable(null);
      form.resetFields();
      await getAllTransactions();
    } catch (error) {
      setLoading(false);
      console.log("Submit error:", error);
      message.error(
        error.response?.data?.message || "Failed to save transaction"
      );
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditable(null);
    form.resetFields();
  };

  return (
    <Layout>
      {loading && <Spinner />}
      
      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Income"
              value={totalIncome}
              prefix="₹"
              valueStyle={{ color: "#3f8600" }}
              suffix={<RiseOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Expenses"
              value={totalExpense}
              prefix="₹"
              valueStyle={{ color: "#cf1322" }}
              suffix={<FallOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Current Balance"
              value={balance}
              prefix="₹"
              valueStyle={{ 
                color: balance >= 0 ? "#3f8600" : "#cf1322" 
              }}
              suffix={<WalletOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Controls */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text strong>
                <CalendarOutlined /> Time Period
              </Text>
              <Select
                value={frequency}
                onChange={(values) => setFrequency(values)}
                style={{ width: "100%" }}
              >
                <Select.Option value="7">Last 7 Days</Select.Option>
                <Select.Option value="30">Last 30 Days</Select.Option>
                <Select.Option value="365">Last Year</Select.Option>
                <Select.Option value="custom">Custom Range</Select.Option>
              </Select>
            </Space>
          </Col>

          <Col xs={24} sm={6}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text strong>
                <FilterOutlined /> Transaction Type
              </Text>
              <Select
                value={type}
                onChange={(values) => setType(values)}
                style={{ width: "100%" }}
              >
                <Select.Option value="all">All Types</Select.Option>
                <Select.Option value="income">Income Only</Select.Option>
                <Select.Option value="expense">Expenses Only</Select.Option>
              </Select>
            </Space>
          </Col>

          {frequency === "custom" && (
            <Col xs={24} sm={6}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Text strong>Date Range</Text>
                <RangePicker
                  value={selectedDate}
                  onChange={(values) => setSelectedate(values)}
                  style={{ width: "100%" }}
                />
              </Space>
            </Col>
          )}

          <Col xs={24} sm={6}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text strong>View Mode</Text>
              <Space.Compact style={{ width: "100%" }}>
                <Button
                  type={viewData === "table" ? "primary" : "default"}
                  icon={<UnorderedListOutlined />}
                  onClick={() => setViewData("table")}
                >
                  Table
                </Button>
                <Button
                  type={viewData === "analytics" ? "primary" : "default"}
                  icon={<AreaChartOutlined />}
                  onClick={() => setViewData("analytics")}
                >
                  Analytics
                </Button>
              </Space.Compact>
            </Space>
          </Col>

          <Col xs={24} sm={6} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditable(null);
                form.resetFields();
                setShowModal(true);
              }}
            >
              Add Transaction
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Main Content */}
      <Card>
        {viewData === "table" ? (
          <>
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Title level={4}>
                Recent Transactions
                <Badge count={alltransaction.length} style={{ marginLeft: 8 }} />
              </Title>
            </div>
            <Table
              columns={columns}
              dataSource={alltransaction}
              rowKey="_id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} transactions`,
              }}
              scroll={{ x: 800 }}
            />
          </>
        ) : (
          <Analytics alltransaction={alltransaction} />
        )}
      </Card>

      {/* Enhanced Modal */}
      <Modal
        title={
          <Space>
            <DollarOutlined />
            {editable ? "Edit Transaction" : "Add New Transaction"}
          </Space>
        }
        open={showModal}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <Divider />
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          size="large"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Amount"
                name="amount"
                rules={[
                  { required: true, message: "Please enter amount" },
                  { pattern: /^\d+$/, message: "Please enter valid amount" }
                ]}
              >
                <Input
                  prefix="₹"
                  placeholder="0"
                  type="number"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Type"
                name="type"
                rules={[{ required: true, message: "Please select type" }]}
              >
                <Select placeholder="Select type">
                  <Select.Option value="income">
                    <RiseOutlined style={{ color: "#52c41a" }} /> Income
                  </Select.Option>
                  <Select.Option value="expense">
                    <FallOutlined style={{ color: "#f5222d" }} /> Expense
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select placeholder="Select category">
                  <Select.Option value="salary">💼 Salary</Select.Option>
                  <Select.Option value="tip">🎯 Tip</Select.Option>
                  <Select.Option value="project">📁 Project</Select.Option>
                  <Select.Option value="food">🍕 Food</Select.Option>
                  <Select.Option value="movie">🎬 Movie</Select.Option>
                  <Select.Option value="bills">📋 Bills</Select.Option>
                  <Select.Option value="medical">⚕️ Medical</Select.Option>
                  <Select.Option value="fee">💳 Fee</Select.Option>
                  <Select.Option value="tax">📊 Tax</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please select date" }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Reference" name="reference">
            <Input placeholder="Reference ID or number" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea
              placeholder="Add a note about this transaction..."
              rows={3}
            />
          </Form.Item>

          <div style={{ textAlign: "right", marginTop: 24 }}>
            <Space>
              <Button onClick={handleModalClose}>Cancel</Button>
              <Button type="primary" htmlType="submit" size="large">
                {editable ? "Update Transaction" : "Add Transaction"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;