import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Dropdown, Typography, Space } from "antd";
import {
  DashboardOutlined,
  TransactionOutlined,
  FileImageOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  const isAuthenticated = !!localStorage.getItem("accessToken");

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/dashboard"),
    },
    {
      key: "/transactions",
      icon: <TransactionOutlined />,
      label: "Transactions",
      onClick: () => navigate("/transactions"),
    },
    {
      key: "/receipts",
      icon: <FileImageOutlined />,
      label: "Receipts",
      onClick: () => navigate("/receipts"),
    },
  ];

  const userMenuItems = [
    { key: "logout", icon: <LogoutOutlined />, label: "Logout", onClick: handleLogout },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {isAuthenticated && (
        <Header
          style={{
            background: "linear-gradient(90deg, #2563eb, #4f46e5)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 24px",
          }}
        >
          {/* Brand */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <img src="/src/assets/logo.png" alt="logo" className="w-60 rounded-full" />
            
          </div>

          {/* Menu + User */}
          <Space size="middle">
            {!isMobile ? (
              <Menu
                mode="horizontal"
                theme="dark"
                selectedKeys={[location.pathname]}
                items={menuItems}
                style={{
                  background: "transparent",
                  borderBottom: "none",
                }}
              />
            ) : (
              <Dropdown
                menu={{ items: menuItems }}
                placement="bottomRight"
                overlayClassName="rounded-lg shadow-lg"
              >
                <Button type="text" icon={<MenuOutlined />} style={{ color: "white" }} />
              </Dropdown>
            )}

            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              overlayClassName="rounded-lg shadow-lg"
            >
              <Button type="text" icon={<UserOutlined />} style={{ color: "white" }} />
            </Dropdown>
          </Space>
        </Header>
      )}

      {/* Content */}
      <Content style={{ padding: "24px", background: "#f9fafb" }}>{children}</Content>

      {/* Footer */}
      {isAuthenticated && (
        <Footer
          style={{
            textAlign: "center",
            background: "#fff",
            borderTop: "1px solid #e5e7eb",
            padding: "12px 24px",
          }}
        >
          <Text type="secondary">FlowTrack © {new Date().getFullYear()}</Text>
        </Footer>
      )}
    </Layout>
  );
};

export default AppLayout;
