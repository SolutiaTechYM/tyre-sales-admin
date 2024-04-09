import { NumberField, useTable } from "@refinedev/antd";
import { IUser, IOrder, IOrderFilterVariables,IProduct } from "../../../interfaces";
import { HttpError, useNavigation, useTranslate } from "@refinedev/core";
import { Flex, Table, Typography } from "antd";
import { OrderStatus, OrderTableColumnProducts } from "../../order";

type Props = {
  product?: IProduct;
};

export const ProductStock = ({ product }: Props) => {
  const t = useTranslate();
  const { show } = useNavigation();

  const { tableProps } = useTable<IOrder, HttpError, IOrderFilterVariables>({
    resource: "orders",
    initialSorter: [
      {
        field: "createdAt",
        order: "desc",
      },
    ],
    permanentFilter: [
      {
        field: "user.id",
        operator: "eq",
        value: product?.id,
      },
    ],
    initialPageSize: 4,
    queryOptions: {
      enabled: product !== undefined,
    },
    syncWithLocation: false,
  });

  return (
    <div>
      <Typography.Title level={4}>Stocks</Typography.Title>
    
    <Table
      {...tableProps}
      rowKey="id"
      
      // onRow={(record) => {
      //   return {
      //     onClick: () => {
      //       show("orders", record.id);
      //     },
      //   };
      // }}
      pagination={{
        ...tableProps.pagination,
        hideOnSinglePage: true,
      }}
    >
      <Table.Column
        title={"ID"}
        dataIndex="stockid"
        key="stockid"
        render={(valuee) => (
          <Typography.Text
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {valuee}
          </Typography.Text>
        )}
      />

<Table.Column
        title={"Date"}
        dataIndex="date"
        key="date"
        render={(value) => (
          <Typography.Text
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </Typography.Text>
        )}
      />

<Table.Column
        title={"Quantity"}
        dataIndex="quantity"
        key="quantity"
        render={(value) => (
          <Typography.Text
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </Typography.Text>
        )}
      />

      
      {/* <Table.Column
        key="date"
        dataIndex="date"
        title={t("Date")}
        render={(status) => {
          return <OrderStatus status={status.text} />;
        }}
      /> */}
      {/* <Table.Column<IOrder>
        key="products"
        dataIndex="products"
        title={t("orders.fields.products")}
        render={(_, record) => {
          return <OrderTableColumnProducts order={record} />;
        }}
      /> */}
      <Table.Column<IOrder>
        dataIndex="unitprice"
        align="end"
        title={t("Unit Price")}
        render={(amount) => {
          return (
            <NumberField
              value={amount}
              style={{
                whiteSpace: "nowrap",
              }}
              options={{
                style: "currency",
                currency: "LKR",
              }}
            />
          );
        }}
      />
    <Table.Column
        title={"Supplier"}
        dataIndex="supplier"
        key="supplier"
        render={(value) => (
          <Typography.Text
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </Typography.Text>
        )}
      />
    </Table>
    </div>
  );
};




















// 



// import { NumberField, useTable } from "@refinedev/antd";
// import { Table, Typography } from "antd";
// import { OrderStatus, OrderTableColumnProducts } from "../../order";
// import { useNavigation } from "react-router-dom";

// // Hardcoded data for demonstration purposes
// const hardcodedOrders = [
//   {
//     id: 1,
//     status: { text: "Pending" },
//     products: ["Product 1", "Product 2"],
//     amount: 1500,
//     store: { title: "Store A" }
//   },
//   {
//     id: 2,
//     status: { text: "Shipped" },
//     products: ["Product 3", "Product 4"],
//     amount: 2500,
//     store: { title: "Store B" }
//   },
//   // Add more hardcoded orders as needed
// ];

// export const Pr = () => {
//   const show: any = null; 

//   const tableProps = {
//     dataSource: hardcodedOrders,
//     pagination: { hideOnSinglePage: true },
//     rowKey: "id",
//     onRow: (record: { id: any; }) => ({
//       onClick: () => {
//         show("orders", record.id);
//       },
//     }),
//   };

//   return (
//     <Table {...tableProps}>
//       <Table.Column
//         title="Order #"
//         dataIndex="id"
//         key="id"
//         render={(value) => (
//           <Typography.Text style={{ whiteSpace: "nowrap" }}>#{value}</Typography.Text>
//         )}
//       />
//       <Table.Column
//         key="status.text"
//         dataIndex="status"
//         title="Status"
//         render={(status) => <OrderStatus status={status.text} />}
//       />
//       {/* <Table.Column
//         key="products"
//         dataIndex="products"
//         title="Products"
//         render={(_, record) => <OrderTableColumnProducts order={record} />}
//       /> */}
//       <Table.Column
//         dataIndex="amount"
//         align="end"
//         title="Amount"
//         render={(amount) => (
//           <NumberField
//             value={amount / 100}
//             style={{ whiteSpace: "nowrap" }}
//             options={{ style: "currency", currency: "USD" }}
//           />
//         )}
//       />
//       <Table.Column
//         key="store.title"
//         dataIndex={["store", "title"]}
//         title="Store"
//       />
//     </Table>
//   );
// };
