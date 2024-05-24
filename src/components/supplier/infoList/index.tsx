import React from "react";
import { ISupplier } from "../../../interfaces";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  RightCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  EyeOutlined
} from "@ant-design/icons";
import { List, Typography, Space, theme, Card } from "antd";
import dayjs from "dayjs";
// import { UserStatus } from "../userStatus";
import { useTranslate } from "@refinedev/core";
import {
  CreateButton,
  EditButton,

} from "@refinedev/antd";

type Props = {
  supplier?: ISupplier;
};

export const SupplierInfoList = ({ supplier }: Props) => {
  const { token } = theme.useToken();
  const t = useTranslate();

  return (
    <Card
      bordered={false}
      styles={{
        body: {
          padding: "0 16px 0 16px",
        },
      }}
    >
      <List
        itemLayout="horizontal"
        dataSource={[
          {
            title: t("Contact"),
            icon: <PhoneOutlined />,
            value: <Typography.Text>{supplier?.phone}</Typography.Text>,
          },
          {
            title: t("Address"),
            icon: <EnvironmentOutlined />,
            value:(
              <Typography.Text>
               {supplier?.address}
              </Typography.Text>
            ),
          },
         
          {
            title: t("Company"),
            icon: <UserOutlined />,

            value: (
              <Typography.Text>
               {supplier?.phone}
              </Typography.Text>
            ),
          },
        ]}
        renderItem={(item) => {
          return (
            <List.Item>
              <List.Item.Meta
                avatar={item.icon}
                title={
                  <Typography.Text type="secondary">
                    {item.title}
                  </Typography.Text>
                }
                description={item.value}
              />
            </List.Item>
          );
        }}
      />
       <div style={{ display:"flex",justifyContent:"right"}}>
      <EditButton
                  recordItemId={supplier?.id}
                />
                </div>
    </Card>
  );
};
