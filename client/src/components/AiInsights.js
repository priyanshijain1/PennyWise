import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, Space, Typography, Skeleton, Alert, Button, Divider } from "antd";
import {
  BulbOutlined,
  WarningOutlined,
  SafetyOutlined,
  ReloadOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import API from "../utils/api";

const { Title, Text, Paragraph } = Typography;

const AiInsights = ({ transactions }) => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);
  const [configured, setConfigured] = useState(true);
  const prevTxRef = useRef("");
  const fetchingRef = useRef(false);

  const fetchInsights = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post("/ai/insights", { transactions });
      if (data.success) {
        setInsights(data.data);
      }
    } catch (err) {
      if (err.response?.status === 503) {
        setConfigured(false);
      } else {
        setError(err.response?.data?.message || "Failed to load insights");
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [transactions]);

  useEffect(() => {
    const txKey = JSON.stringify(transactions);
    if (txKey !== prevTxRef.current && transactions.length > 0) {
      prevTxRef.current = txKey;
      fetchInsights();
    }
  }, [transactions, fetchInsights]);

  if (!configured) {
    return (
      <Card style={{ marginBottom: 24, background: "#fafafa" }}>
        <Space direction="vertical" align="center" style={{ width: "100%", padding: "24px 0" }}>
          <RobotOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
          <Text type="secondary" style={{ fontSize: 16 }}>
AI Insights require a Groq API key
            </Text>
            <Text type="secondary">
              Set <code>GROQ_API_KEY</code> in your .env file to enable smart analysis
          </Text>
        </Space>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return null;
  }

  return (
    <Card
      style={{ marginBottom: 24 }}
      title={
        <Space>
          <RobotOutlined style={{ color: "#667eea" }} />
          <Text strong>AI Insights</Text>
        </Space>
      }
      extra={
        <Button
          size="small"
          icon={<ReloadOutlined />}
          onClick={fetchInsights}
          loading={loading}
        >
          Refresh
        </Button>
      }
    >
      {loading && !insights ? (
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Skeleton active paragraph={{ rows: 1 }} />
          <Skeleton active paragraph={{ rows: 2 }} />
          <Skeleton active paragraph={{ rows: 1 }} />
        </Space>
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : insights ? (
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Paragraph style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>
            {insights.summary}
          </Paragraph>

          {insights.keyInsights?.length > 0 && (
            <>
              <Divider style={{ margin: "8px 0" }} />
              <Space direction="vertical" style={{ width: "100%" }} size="small">
                {insights.keyInsights.map((item, i) => (
                  <Space key={i} align="start">
                    <BulbOutlined style={{ color: "#faad14", marginTop: 4 }} />
                    <Text>{item}</Text>
                  </Space>
                ))}
              </Space>
            </>
          )}

          {insights.anomalies?.length > 0 && (
            <>
              <Divider style={{ margin: "8px 0" }} />
              <Title level={5} style={{ margin: 0 }}>
                <WarningOutlined style={{ color: "#ff4d4f" }} /> Anomalies
              </Title>
              <Space direction="vertical" style={{ width: "100%" }} size="small">
                {insights.anomalies.map((item, i) => (
                  <Alert key={i} message={item} type="warning" showIcon style={{ padding: "8px 12px" }} />
                ))}
              </Space>
            </>
          )}

          {insights.savingsTip && (
            <>
              <Divider style={{ margin: "8px 0" }} />
              <Space align="start">
                <SafetyOutlined style={{ color: "#52c41a", marginTop: 4 }} />
                <Text>{insights.savingsTip}</Text>
              </Space>
            </>
          )}
        </Space>
      ) : null}
    </Card>
  );
};

export default AiInsights;