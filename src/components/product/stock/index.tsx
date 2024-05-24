import { NumberField, useTable } from "@refinedev/antd";
import { IProduct } from "../../../interfaces";
import { Typography, Table } from "antd";
import { HttpError } from "@refinedev/core";

type Props = {
  product: IProduct;
};

export const ProductStock = ({ product }: Props) => {
  // const { stocks } = product;

  const columns = [
    {
      title: "Stock ID",
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
      render: (value: any) => (
        <Typography.Text style={{ whiteSpace: "nowrap" }}>{value}</Typography.Text>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (value: any) => (
        <Typography.Text style={{ whiteSpace: "nowrap" }}>{value}</Typography.Text>
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unitBuyPrice",
      key: "unitBuyPrice",
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
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
      render: (value: any) => (
        <Typography.Text style={{ whiteSpace: "nowrap" }}>{value}</Typography.Text>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={4}>Stocks</Typography.Title>
      <Table dataSource={product.stocks} columns={columns} rowKey="id" />
    </div>
  );
};