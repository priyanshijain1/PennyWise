import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, message, Modal, Select, Table, DatePicker } from "antd";
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined,
  DeleteOutlined,} from "@ant-design/icons";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import Spinner from "./../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";
const { RangePicker } = DatePicker;


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

  //table data
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            className="mx-2"
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  //getall transactions
  

  //useEffect Hook
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
    message.error("Fetch Issue With Transaction");
  }
}, [frequency, selectedDate, type]);

//useEffect Hook
useEffect(() => {
  getAllTransactions();
}, [getAllTransactions]);

  //delete handler
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post("/transactions/delete-transaction", {
        transacationId: record._id,
      });
      setLoading(false);
      message.success("Transaction Deleted!");
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Unable to delete");
    }
  };




  // form handling
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
          transacationId: editable._id,
        });
        setLoading(false);
        message.success("Transaction Updated Successfully");
      } 
      else{

        const transactionData = {
          ...values,
          amount: Number(values.amount),
          userid: user._id,
        };
    
        console.log("Submitting transaction:", transactionData);
    
        const response = await axios.post("/transactions/add-transaction", transactionData);
        
        console.log("Transaction saved successfully:", response.data);
    
        setLoading(false);
        message.success("Transaction Added Successfully");
      }
    setShowModal(false);
    setEditable(null);
    form.resetFields(); //clear form values after submit
    
    // Refresh the transactions list
    await getAllTransactions();
    
  } catch (error) {
    setLoading(false);
    console.log("Submit error:", error);
    
    if (error.response) {
      console.log("Error Response Data:", error.response.data);
      console.log("Error Status:", error.response.status);
      message.error(error.response.data?.message || "Failed to add transaction");
    } else {
      message.error("Network error. Please try again.");
    }
  }
};

// const handleModalClose = () => {
//   setShowModal(false);
//   form.resetFields(); // Clear form when closing
// };
// onCancel={handleModalClose}

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="7">LAST 1 Week</Select.Option>
            <Select.Option value="30">LAST 1 Month</Select.Option>
            <Select.Option value="365">LAST 1 year</Select.Option>
            <Select.Option value="custom">custom</Select.Option>
          </Select>
          {/* {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedate(values)}
            />
          )} */}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value="all">ALL</Select.Option>
            <Select.Option value="income">INCOME</Select.Option>
            <Select.Option value="expense">EXPENSE</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedate(values)}
            />
          )}
        </div>
        <div className="switch-icons">
          <UnorderedListOutlined
            className={`mx-2 ${
              viewData === "table" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setViewData("table")}
          />
          <AreaChartOutlined
            className={`mx-2 ${
              viewData === "analytics" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setViewData("analytics")}
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Add New
          </button>
        </div>
      </div>
      <div className="content">
        {viewData === "table" ?(
          <Table columns={columns} dataSource={alltransaction} rowKey="_id"/>
        ) : (
          <Analytics alltransaction = {alltransaction} />
        )}
      </div>
      <Modal
        title={editable ? "Edit Transaction" : "Add Transaction"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}> {/* ✅ attach form instance */}
          <Form.Item label="Amount" name="amount">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="tax">TAX</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              {" "}
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;