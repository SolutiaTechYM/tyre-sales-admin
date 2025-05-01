import React from "react";
import { ICustomer } from "../../../interfaces";
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
import { UserStatus } from "../userStatus";
import { useGetToPath, useGo, useTranslate } from "@refinedev/core";
import {
  CreateButton,
  DeleteButton,
  EditButton,

} from "@refinedev/antd";
import { useSearchParams } from "react-router-dom";

type Props = {
  customer?: ICustomer;
};

export const CustomerInfoList = ({ customer }: Props) => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();

  const handleDrawerClose = () => {


    go({
      to:
        searchParams.get("to") ??
        getToPath({
          action: "list",
        }) ??
        "",
      query: {
        to: undefined,
      },
      options: {
        keepQuery: true,
      },
      type: "replace",
    });
  };

  return (
    <Card
      bordered={false}
      styles={{
        body: {
          padding: "0 16px 16px 16px",
        },
      }}
    >
      <List
        itemLayout="horizontal"
        dataSource={[
          {
            title: t("Contact"),
            icon: <PhoneOutlined />,
            value: <Typography.Text>{customer?.contact_person}</Typography.Text>,
          },
          {
            title: t("Address"),
            icon: <EnvironmentOutlined />,
            value:(
              <Typography.Text>
               {customer?.address}
              </Typography.Text>
            ),
          },
         
          {
            title: t("Company"),
            icon: <UserOutlined />,

            value: (
              <Typography.Text>
               {customer?.contact_person}
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

       <div style={{ display:"flex",justifyContent:"space-between",}}>
       <DeleteButton
          type="text"
          recordItemId={customer?.id}
          resource="customers"
          onSuccess={() => {
            handleDrawerClose();
          }}
          style={{border:"1px solid"}}
        />
             <EditButton
                  recordItemId={customer?.id}
                />
                </div>
    </Card>
  );
};
