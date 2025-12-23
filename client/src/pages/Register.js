import React, { useState, useEffect } from 'react';
import { Form, Input, message, Card, Typography, Button, Alert } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, MailOutlined, LockOutlined, UserAddOutlined } from "@ant-design/icons";
import axios from "axios";
import Spinner from "../components/Spinner";

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // form submit
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      await axios.post('http://localhost:8080/api/v1/users/register', values);
      message.success("Account created successfully! Please sign in.");
      setLoading(false);
      navigate('/login');
    } catch (error) {
      setLoading(false);
      
      // Check if it's a duplicate email error
      if (error.response?.status === 400 && 
          (error.response?.data?.message?.includes('already exists') || 
           error.response?.data?.error === 'DUPLICATE_EMAIL' ||
           error.response?.data?.message?.includes('E11000') ||
           error.response?.data?.error?.code === 11000)) {
        
        message.warning("This email is already registered. Redirecting to login...");
        setRedirecting(true);
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        message.error(error.response?.data?.message || "Registration failed. Please try again.");
      }
    }
  };

  //prevent for login user
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="register-page">
      {loading && <Spinner />}
      
      <Card className="auth-card" bordered={false}>
        {redirecting && (
          <Alert
            message="Email Already Registered"
            description="This email is already in our system. Redirecting you to the login page..."
            type="info"
            showIcon
            style={{ marginBottom: 24, borderRadius: 8 }}
          />
        )}

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Title level={2} className="auth-title">
            Create Account
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Join PennyWise to start managing your finances
          </Text>
        </div>

        <Form
          layout="vertical"
          onFinish={submitHandler}
          className="auth-form"
          size="large"
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: "Please enter your full name" },
              { min: 2, message: "Name must be at least 2 characters" }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your full name"
            />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email"
              type="email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please create a password" },
              { min: 6, message: "Password must be at least 6 characters" }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Create a strong password"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm your password"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="auth-submit-btn"
              loading={loading}
              icon={<UserAddOutlined />}
            >
              Create Account
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Text>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;