import { useNavigation } from "@refinedev/core";
import { NumberField, useTable } from "@refinedev/antd";
import { Typography, Table, theme, Space, Flex, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

import { IOrder } from "../../../interfaces";
import { useStyles } from "./styled";
import { getUniqueListWithCount } from "../../../utils";

export const RecentOrders: React.FC = () => {
  const { token } = theme.useToken();
  const { styles } = useStyles();

  const { tableProps } = useTable<IOrder>({
    resource: "misc/recentSales",
    initialSorter: [
      {
        field: "createdAt",
        order: "desc",
      },
    ],
    initialPageSize: 15,
    syncWithLocation: false,
  });

  const { show } = useNavigation();

  return (
    <Table
      {...tableProps}
      pagination={{
        ...tableProps.pagination,
        hideOnSinglePage: true,
        showSizeChanger: false,
        className: styles.pagination,
      }}
      showHeader={false}
      rowKey="id"
    >
      <Table.Column<IOrder>
        dataIndex="id"
        className={styles.column}
        render={(_, record) => (
          <Typography.Link
            strong
            style={{
              whiteSpace: "nowrap",
              color: token.colorTextHeading,
            }}
          >
            {record.code}
          </Typography.Link>
        )}
      />
      <Table.Column<IOrder>
        dataIndex="id"
        className={styles.column}
        render={(_, record) => {
          return (
            <Space
              size={0}
              direction="vertical"
              style={{
                maxWidth: "220px",
              }}
            >
              <Typography.Text
                style={{
                  fontSize: 14,
                }}
              >
                {record?.customer?.name}
              </Typography.Text>
              <Typography.Text
                ellipsis
                style={{
                  fontSize: 12,
                }}
                type="secondary"
              >
                {record?.customer?.address}
              </Typography.Text>
            </Space>
          );
        }}
      />
      <Table.Column<IOrder>
        dataIndex="products"
        className={styles.column}
        render={(products: IOrder["products"]) => {
          if (!products.length) {
            return <Typography.Text>-</Typography.Text>;
          }

          const uniqueProducts = getUniqueListWithCount<
            IOrder["products"][number]
          >({ list: products, field: "id" });

          return (
            <Collapse
              ghost
              size="small"
              expandIcon={({ isActive }) => (
                <CaretRightOutlined
                  rotate={isActive ? 90 : 0}
                  style={{ fontSize: '12px', color: token.colorTextSecondary }}
                />
              )}
              items={[
                {
                  key: '1',
                  label: (
                    <Typography.Text style={{ fontSize: '14px' }}>
                      {uniqueProducts.length} {uniqueProducts.length === 1 ? 'Product' : 'Products'}
                    </Typography.Text>
                  ),
                  children: (
                    <Space
                      size={0}
                      direction="vertical"
                      style={{
                        maxWidth: "220px",
                        paddingLeft: "8px",
                      }}
                    >
                      {uniqueProducts.map((product) => (
                        <Flex key={product.id} gap={4}>
                          <Typography.Text ellipsis>{product.name}</Typography.Text>
                          <span
                            style={{
                              color: token.colorTextSecondary,
                            }}
                          >
                            x{product.count}
                          </span>
                        </Flex>
                      ))}
                    </Space>
                  ),
                },
              ]}
            />
          );
        }}
      />
      <Table.Column<IOrder>
        dataIndex="amount"
        className={styles.column}
        align="end"
        render={(amount) => {
          return (
            <NumberField
              value={amount / 100}
              style={{
                whiteSpace: "nowrap",
              }}
              options={{
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }}
            />
          );
        }}
      />
    </Table>
  );
};