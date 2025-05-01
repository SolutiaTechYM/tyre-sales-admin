import { NumberField, useTable } from "@refinedev/antd";
import { IOrder, ISupplier } from "../../../interfaces";
import { HttpError, useNavigation, useTranslate } from "@refinedev/core";
import { Table, Typography } from "antd";
// import { OrderStatus, OrderTableColumnProducts } from "../../order";

type Props = {
  supplier: ISupplier;
};

export const SupplierOrderHistory = ({ supplier }: Props) => {
   
  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (value: any) => (
        <Typography.Text style={{ whiteSpace: "nowrap" }}>{value}</Typography.Text>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
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
          style={{ whiteSpace: "nowrap" ,fontWeight:'bold'}}
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
          style={{ whiteSpace: "nowrap" ,fontWeight:'bold'}}
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
      <Table dataSource={supplier?.trades} columns={columns} rowKey="id" />
    </div>
  );
};