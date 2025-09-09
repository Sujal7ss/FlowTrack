import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Dropdown, Typography } from "antd";
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
    navigate("/login");
  };

  const menuItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard", onClick: () => navigate("/dashboard") },
    { key: "/transactions", icon: <TransactionOutlined />, label: "Transactions", onClick: () => navigate("/transactions") },
    { key: "/receipts", icon: <FileImageOutlined />, label: "Receipts", onClick: () => navigate("/receipts") },
  ];

  const userMenuItems = [{ key: "logout", icon: <LogoutOutlined />, label: "Logout", onClick: handleLogout }];

  
  return (
    <Layout className="min-h-screen">
      {isAuthenticated && (
        <Header className="bg-blue-600 shadow-md flex justify-between items-center px-4">
          <div className="text-white font-bold text-xl">Personal Finance Assistant</div>

          <div className="flex items-center gap-4">
            {!isMobile ? (
              <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={menuItems}
                className="bg-transparent border-none"
              />
            ) : (
              <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                <Button type="text" icon={<MenuOutlined />} className="text-white" />
              </Dropdown>
            )}

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" icon={<UserOutlined />} className="text-white" />
            </Dropdown>
          </div>
        </Header>
      )}

      <Content className="p-4">{children}</Content>

      {isAuthenticated && (
        <Footer className="text-center bg-gray-50">
          <Text type="secondary">Personal Finance Assistant ©2025</Text>
        </Footer>
      )}
    </Layout>
  );
};

export default AppLayout;
