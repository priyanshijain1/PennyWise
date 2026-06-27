import React, { useState, useRef, useEffect } from "react";
import { Modal, Input, Button, Space, Typography, Spin, Alert } from "antd";
import {
  RobotOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import API from "../utils/api";

const { Text } = Typography;
const { TextArea } = Input;

const AiChat = ({ transactions }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(true);
  const listRef = useRef(null);
  const sendingRef = useRef(false);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || loading || sendingRef.current) return;

    sendingRef.current = true;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setLoading(true);

    try {
      const { data } = await API.post("/ai/query", {
        transactions,
        question,
      });

      if (data.success) {
        setMessages((prev) => [...prev, { role: "assistant", text: data.data.answer }]);
      }
    } catch (err) {
      if (err.response?.status === 503) {
        setConfigured(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "AI chat is not configured. Set GROQ_API_KEY in .env to enable." },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: err.response?.data?.message || "Failed to get answer. Please try again." },
        ]);
      }
    } finally {
      setLoading(false);
      sendingRef.current = false;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<RobotOutlined />}
        onClick={() => {
          setOpen(true);
          if (messages.length === 0 && configured) {
            setMessages([
              {
                role: "assistant",
                text: "Hi! Ask me anything about your transactions. For example:\n- \"How much did I spend on food this month?\"\n- \"What's my biggest expense category?\"\n- \"Compare my income vs expenses\"",
              },
            ]);
          }
        }}
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          width: 56,
          height: 56,
          zIndex: 1000,
          boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
        }}
      />

      <Modal
        title={
          <Space>
            <RobotOutlined style={{ color: "#667eea" }} />
            <Text strong>AI Assistant</Text>
          </Space>
        }
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={480}
        closable
        destroyOnClose
        style={{ top: 60 }}
      >
        <div
          ref={listRef}
          style={{
            height: 400,
            overflowY: "auto",
            padding: "12px 0",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: msg.role === "user" ? "#667eea" : "#f0f0f0",
                  color: msg.role === "user" ? "#fff" : "#333",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.5,
                }}
              >
                <Space size={6} style={{ marginBottom: 4 }}>
                  {msg.role === "user" ? <UserOutlined /> : <RobotOutlined style={{ color: "#667eea" }} />}
                  <Text strong style={{ fontSize: 12, color: msg.role === "user" ? "rgba(255,255,255,0.8)" : "#999" }}>
                    {msg.role === "user" ? "You" : "AI"}
                  </Text>
                </Space>
                <div style={{ marginTop: 4 }}>{msg.text}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: 12, background: "#f0f0f0" }}>
                <Spin size="small" /> <Text style={{ marginLeft: 8, color: "#999" }}>Thinking...</Text>
              </div>
            </div>
          )}
        </div>

        {!configured && (
          <Alert
            message="AI chat requires a Groq API key"
            description='Set GROQ_API_KEY in your .env file'
            type="warning"
            showIcon
            style={{ marginBottom: 12 }}
          />
        )}

        <Space.Compact style={{ width: "100%" }}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your spending..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={loading || !configured}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={sendMessage}
            loading={loading}
            disabled={!input.trim() || !configured}
          >
            Send
          </Button>
        </Space.Compact>
      </Modal>
    </>
  );
};

export default AiChat;