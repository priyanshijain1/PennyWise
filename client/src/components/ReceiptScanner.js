import React, { useState, useRef } from "react";
import { Modal, Button, Space, Card, Descriptions, Tag, Image, Alert, Upload, Typography } from "antd";
import { CameraOutlined, UploadOutlined, CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import API from "../utils/api";

const { Text, Title } = Typography;

const ReceiptScanner = ({ onScanComplete }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = (fileObj) => {
    setError(null);
    setResult(null);
    setFile(fileObj);
    setPreview(URL.createObjectURL(fileObj));
    return false;
  };

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("receipt", file);
      const { data } = await API.post("/ai/receipt", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        setResult(data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to scan receipt.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseData = () => {
    if (!result) return;
    const total = result.total || 0;
    if (total > 0) {
      onScanComplete({
        amount: total,
        date: result.date || new Date().toISOString().split("T")[0],
        description: result.merchant
          ? `Receipt from ${result.merchant}`
          : "Scanned receipt expense",
        type: "expense",
      });
    }
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <>
      <Button icon={<CameraOutlined />} onClick={() => setOpen(true)}>
        Scan Receipt
      </Button>

      <Modal
        title={<Space><CameraOutlined /> Scan Receipt</Space>}
        open={open}
        onCancel={handleClose}
        footer={null}
        width={520}
        destroyOnClose
      >
        {!result ? (
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <Upload.Dragger
              accept="image/jpeg,image/png,image/webp"
              showUploadList={false}
              beforeUpload={handleFile}
            >
              {preview ? (
                <Image src={preview} preview={false} style={{ maxHeight: 200 }} />
              ) : (
                <Space direction="vertical" style={{ padding: 24 }}>
                  <UploadOutlined style={{ fontSize: 48, color: "#999" }} />
                  <Text type="secondary">Click or drag a receipt photo here</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>JPEG, PNG, or WebP — max 5MB</Text>
                </Space>
              )}
            </Upload.Dragger>

            {preview && !loading && (
              <Button type="primary" block size="large" onClick={handleScan} icon={<CheckOutlined />}>
                Scan Receipt
              </Button>
            )}

            {loading && (
              <Card>
                <Space>
                  <LoadingOutlined style={{ fontSize: 24 }} />
                  <Text>Reading receipt...</Text>
                </Space>
              </Card>
            )}

            {error && <Alert message={error} type="error" showIcon />}
          </Space>
        ) : (
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <Alert message="Receipt scanned successfully" type="success" showIcon />

            <Card size="small" title="Extracted Data">
              <Descriptions column={1} size="small">
                {result.merchant && <Descriptions.Item label="Merchant">{result.merchant}</Descriptions.Item>}
                {result.date && <Descriptions.Item label="Date">{result.date}</Descriptions.Item>}
                {result.total && (
                  <Descriptions.Item label="Total">
                    <Text strong style={{ fontSize: 16 }}>₹{result.total.toLocaleString()}</Text>
                  </Descriptions.Item>
                )}
              </Descriptions>

              {result.items && result.items.length > 0 && (
                <>
                  <Title level={5} style={{ marginTop: 12 }}>Items</Title>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {result.items.map((item, i) => (
                      <Space key={i} style={{ width: "100%", justifyContent: "space-between" }}>
                        <Text>{item.name}</Text>
                        <Text>₹{item.price.toLocaleString()}</Text>
                      </Space>
                    ))}
                  </Space>
                </>
              )}
            </Card>

            {result.raw && (
              <details>
                <summary style={{ cursor: "pointer", color: "#888" }}>
                  Raw OCR text
                </summary>
                <pre style={{ fontSize: 11, maxHeight: 150, overflow: "auto", background: "#f5f5f5", padding: 8, borderRadius: 4, marginTop: 8 }}>{result.raw}</pre>
              </details>
            )}

            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="primary" onClick={handleUseData} icon={<CheckOutlined />}>
                Create Transaction
              </Button>
            </Space>
          </Space>
        )}
      </Modal>
    </>
  );
};

export default ReceiptScanner;
