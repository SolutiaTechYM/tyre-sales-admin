import { NumberField, useTable } from "@refinedev/antd";
import {  IOrder, ICustomer } from "../../../interfaces";
import { HttpError, useNavigation, useTranslate } from "@refinedev/core";
import { Table, Typography } from "antd";
import { OrderStatus, OrderTableColumnProducts } from "../../order";

type Props = {
  customer: ICustomer;
};

export const CustomerOrderHistory = ({ customer }: Props) => {
  
  const columns = [
    {
      title: "Purcase ID",
      dataIndex: "id",
      key: "id",
      render: (value: any) => (
        <Typography.Text style={{ whiteSpace: "nowrap" }}>{value}</Typography.Text>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align:"center" as const,
      render: (value: any) => (
        <Typography.Text style={{ whiteSpace: "nowrap" }}>{value}</Typography.Text>
      ),
    },
    {
      title: "Due Amount",
      dataIndex: "dueAmount",
      key: "dueAmount",
      align: "end" as const,
      render: (amount: any) => (
        <NumberField
          value={amount}
          style={{ whiteSpace: "nowrap" }}
          options={{            minimumFractionDigits: 2,
            maximumFractionDigits: 2, }}
        />
      ),
    },
    {
      title: "Total",
      dataIndex: "value",
      key: "value",
      align: "end" as const,
      render: (amount: any) => (
        <NumberField
          value={amount}
          style={{ whiteSpace: "nowrap" }}
          options={{            minimumFractionDigits: 2,
            maximumFractionDigits: 2, }}
        />
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (value: any) => (
        <Typography.Text style={{ whiteSpace: "nowrap" }}>{value}</Typography.Text>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={4}>Trades</Typography.Title>
      <Table dataSource={customer?.trades} columns={columns} rowKey="id" />
    </div>
  );
};