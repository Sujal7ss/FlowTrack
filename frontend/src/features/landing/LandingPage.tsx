import React from "react";
import { Layout, Typography, Button, Row, Col, Card, Space, Grid } from "antd";
import {
  BarChartOutlined,
  LockOutlined,
  WalletOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const { useBreakpoint } = Grid;
const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const LandingPage: React.FC = () => {
  const screens = useBreakpoint();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(90deg, #2563eb, #4f46e5)",
          padding: screens.xs ? "0 16px" : "0 40px",
        }}
      >
        <Title level={3} style={{ color: "white", margin: 0 }}>
          FlowTrack
        </Title>
        <Space size={screens.xs ? 4 : 16}>
          {!screens.xs && (
            <>
              <Button type="link" href="#features" style={{ color: "white" }}>
                Features
              </Button>
              <Button type="link" href="#about" style={{ color: "white" }}>
                About
              </Button>
            </>
          )}
          <Button type="primary" href="/login" size={screens.xs ? "small" : "middle"}>
            Login
          </Button>
        </Space>
      </Header>

      {/* Hero Section */}
      <Content
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          color: "white",
          padding: screens.xs ? "60px 16px" : "100px 20px",
          textAlign: "center",
        }}
      >
        <Title
          level={1}
          style={{
            color: "white",
            marginBottom: 20,
            fontSize: screens.xs ? "28px" : "42px",
          }}
        >
          Track Smarter. Live Better.
        </Title>
        <Paragraph
          style={{
            fontSize: screens.xs ? "16px" : "18px",
            color: "white",
            maxWidth: 600,
          }}
        >
          FlowTrack helps you monitor expenses, manage budgets, and achieve
          financial freedom with ease.
        </Paragraph>
        <div style={{ marginTop: 30 }}>
          <Space direction={screens.xs ? "vertical" : "horizontal"} size="middle">
            <Button
              type="primary"
              size={screens.xs ? "middle" : "large"}
              href="/signup"
              icon={<ArrowRightOutlined />}
              block={screens.xs}
            >
              Get Started
            </Button>
          </Space>
        </div>
      </Content>

      {/* Features Section */}
      <Content style={{ padding: screens.xs ? "40px 16px" : "60px 40px", background: "#fff" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Title level={2} style={{ fontSize: screens.xs ? "24px" : "32px" }}>
            Why Choose FlowTrack?
          </Title>
        </div>
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <Card hoverable bordered={false} style={{ textAlign: "center", height: "100%" }}>
              <WalletOutlined style={{ fontSize: 36, color: "#2563eb" }} />
              <Title level={4} style={{ marginTop: 12 }}>
                Expense Tracking
              </Title>
              <Paragraph>
                Easily log and categorize expenses with AI-powered receipt scanning.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable bordered={false} style={{ textAlign: "center", height: "100%" }}>
              <BarChartOutlined style={{ fontSize: 36, color: "#10b981" }} />
              <Title level={4} style={{ marginTop: 12 }}>
                Smart Insights
              </Title>
              <Paragraph>
                Get analytics and visual charts to understand your spending habits.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable bordered={false} style={{ textAlign: "center", height: "100%" }}>
              <LockOutlined style={{ fontSize: 36, color: "#f59e0b" }} />
              <Title level={4} style={{ marginTop: 12 }}>
                Secure & Private
              </Title>
              <Paragraph>
                Your data is encrypted and stored safely with enterprise-level security.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </Content>

      {/* Footer */}
      <Footer
        style={{
          textAlign: "center",
          background: "#111827",
          color: "#9ca3af",
          padding: screens.xs ? "20px 16px" : "30px 40px",
        }}
      >
        © {new Date().getFullYear()} FlowTrack. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default LandingPage;
