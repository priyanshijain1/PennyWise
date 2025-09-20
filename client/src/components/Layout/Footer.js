// import React from 'react'

// const Footer = () => {
//   return (
//     <div className = "bg-dark text-light p-4">
//         <h6 className = "text-center">All rights reserved &copy; abcdef</h6>
//     </div>
//   )
// }

// export default Footer

import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import { 
  DollarOutlined, 
  GithubOutlined, 
  LinkedinOutlined, 
  TwitterOutlined,
  MailOutlined,
  CopyrightOutlined 
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter 
      style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        color: '#f9fafb',
        padding: '48px 24px 24px',
        marginTop: 'auto'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Main Footer Content */}
        <Row gutter={[32, 32]} style={{ marginBottom: 32 }}>
          {/* Brand Section */}
          <Col xs={24} sm={12} lg={8}>
            <Space direction="vertical" size="middle">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <DollarOutlined 
                  style={{ 
                    fontSize: '32px', 
                    color: '#667eea',
                    background: 'rgba(102, 126, 234, 0.1)',
                    padding: '8px',
                    borderRadius: '8px'
                  }} 
                />
                <Title 
                  level={3} 
                  style={{ 
                    color: '#f9fafb', 
                    margin: 0,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  PennyWise
                </Title>
              </div>
              <Text style={{ color: '#d1d5db', fontSize: '16px', lineHeight: '1.6' }}>
                Your smart financial companion for tracking expenses, managing budgets, 
                and making informed financial decisions.
              </Text>
              <Space size="large">
                <Link 
                  href="https://github.com/priyanshijain1/Pennywise" 
                  target="_blank"
                  style={{ color: '#9ca3af', fontSize: '20px' }}
                >
                  <GithubOutlined />
                </Link>
                <Link 
                  // href="https://linkedin.com/in/yourprofile" 
                  target="_blank"
                  style={{ color: '#9ca3af', fontSize: '20px' }}
                >
                  <LinkedinOutlined />
                </Link>
                <Link 
                  // href="https://twitter.com/yourhandle" 
                  target="_blank"
                  style={{ color: '#9ca3af', fontSize: '20px' }}
                >
                  <TwitterOutlined />
                </Link>
                <Link 
                  // href="mailto:your.email@example.com"
                  style={{ color: '#9ca3af', fontSize: '20px' }}
                >
                  <MailOutlined />
                </Link>
              </Space>
            </Space>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} lg={5}>
            <Space direction="vertical" size="middle">
              <Title level={5} style={{ color: '#f9fafb', marginBottom: 16 }}>
                Features
              </Title>
              <Space direction="vertical" size="small">
                <Link style={{ color: '#d1d5db' }}>Transaction Tracking</Link>
                <Link style={{ color: '#d1d5db' }}>Budget Management</Link>
                <Link style={{ color: '#d1d5db' }}>Financial Analytics</Link>
                <Link style={{ color: '#d1d5db' }}>Category Reports</Link>
                <Link style={{ color: '#d1d5db' }}>Export Data</Link>
              </Space>
            </Space>
          </Col>



          {/* Contact & Support */}
          <Col xs={24} sm={12} lg={6}>
            <Space direction="vertical" size="middle">
              <Title level={5} style={{ color: '#f9fafb', marginBottom: 16 }}>
                Get in Touch
              </Title>
              <Space direction="vertical" size="small">
                <Text style={{ color: '#d1d5db' }}>
                  <MailOutlined style={{ marginRight: '8px' }} />
                  support@pennywise.com
                </Text>
                <Text style={{ color: '#d1d5db' }}>
                  Need help? We're here for you!
                </Text>
                <div style={{ marginTop: '12px' }}>
                  <Link 
                    style={{ 
                      color: '#667eea',
                      border: '1px solid #667eea',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      display: 'inline-block',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#667eea';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#667eea';
                    }}
                  >
                    Contact Support
                  </Link>
                </div>
              </Space>
            </Space>
          </Col>
        </Row>

        <Divider style={{ borderColor: '#374151', margin: '32px 0 24px' }} />

        {/* Bottom Section */}
        <Row justify="space-between" align="middle" style={{ flexWrap: 'wrap-reverse' }}>
          <Col xs={24} sm={12} style={{ textAlign: 'left' }}>
            <Space align="center">
              <CopyrightOutlined style={{ color: '#9ca3af' }} />
              <Text style={{ color: '#9ca3af' }}>
                {currentYear} PennyWise. All rights reserved.
              </Text>
            </Space>
          </Col>
          
          <Col xs={24} sm={12} style={{ textAlign: 'right', marginBottom: '16px' }}>
            <Space size="large">
              <Link style={{ color: '#9ca3af' }}>Privacy Policy</Link>
              <Link style={{ color: '#9ca3af' }}>Terms of Service</Link>
              <Link style={{ color: '#9ca3af' }}>Cookies</Link>
            </Space>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default Footer;