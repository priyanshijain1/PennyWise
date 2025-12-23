import React, { useState, useEffect } from "react";
import { Form, Input, message, Card, Typography, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import axios from "axios";
import Spinner from "../components/Spinner";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //form submit
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("http://localhost:8080/api/v1/users/login", values);
      setLoading(false);
      message.success("Welcome back! Login successful");
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        'user',
        JSON.stringify({ ...data.user, password: "" })
      );
      navigate("/");
    } catch (error) {
      setLoading(false);
      message.error("Invalid credentials. Please try again.");
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
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Title level={2} className="auth-title">
            Welcome Back
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Sign in to continue to PennyWise
          </Text>
        </div>

        <Form
          layout="vertical"
          onFinish={submitHandler}
          className="auth-form"
          size="large"
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your email"
              type="email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="auth-submit-btn"
              loading={loading}
              icon={<LoginOutlined />}
            >
              Sign In
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Text>
              Don't have an account?{" "}
              <Link to="/register" className="auth-link">
                Create one here
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;






// import React, { useState, useEffect } from "react";
// import { Form, Input, message, Card, Typography, Button } from "antd";
// import { Link, useNavigate } from "react-router-dom";
// import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
// import API from "../utils/api";
// import Spinner from "../components/Spinner";

// const { Title, Text } = Typography;

// const Login = () => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const submitHandler = async (values) => {
//     try {
//       setLoading(true);

//       const { data } = await API.post("/users/login", values);

//       // 🔐 STORE JWT
//       localStorage.setItem("token", data.token);

//       // store user (safe fields only)
//       localStorage.setItem("user", JSON.stringify(data.user));

//       setLoading(false);
//       message.success("Login successful");
//       navigate("/");
//     } catch (error) {
//       setLoading(false);
//       message.error("Invalid email or password");
//     }
//   };

//   // If already logged in, redirect
//   useEffect(() => {
//     if (localStorage.getItem("token")) {
//       navigate("/");
//     }
//   }, [navigate]);

//   return (
//     <div className="register-page">
//       {loading && <Spinner />}

//       <Card className="auth-card">
//         <div style={{ textAlign: "center", marginBottom: 24 }}>
//           <Title level={2}>Welcome Back</Title>
//           <Text type="secondary">Sign in to PennyWise</Text>
//         </div>

//         <Form layout="vertical" onFinish={submitHandler} size="large">
//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[{ required: true, message: "Please enter email" }]}
//           >
//             <Input prefix={<UserOutlined />} placeholder="Email" />
//           </Form.Item>

//           <Form.Item
//             label="Password"
//             name="password"
//             rules={[{ required: true, message: "Please enter password" }]}
//           >
//             <Input.Password prefix={<LockOutlined />} placeholder="Password" />
//           </Form.Item>

//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={loading}
//               icon={<LoginOutlined />}
//               block
//             >
//               Login
//             </Button>
//           </Form.Item>

//           <Text>
//             New here? <Link to="/register">Create an account</Link>
//           </Text>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default Login;

