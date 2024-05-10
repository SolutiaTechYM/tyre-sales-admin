import {
  HttpError,
  getDefaultFilter,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import {
  FilterDropdown,
  NumberField,
  getDefaultSortOrder,
  useSelect,
  useTable,
} from "@refinedev/antd";
import { IProduct, IPurchase } from "../../../interfaces";
import {
  Avatar,
  Button,
  Input,
  InputNumber,
  Select,
  Table,
  Typography,
  theme,
} from "antd";
import { PaginationTotal } from "../../paginationTotal";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

export const SalesListTable = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { tableProps, sorters, filters } = useTable<IPurchase, HttpError>({
    filters: {
      initial: [
        {
          field: "description",
          operator: "contains",
          value: "",
        },
        {
          field: "date",
          operator: "contains",
          value: "",
        },
        {
          field: "id",
          operator: "in",
          value: [],
        },
        
      ],
    },
  });

  return (
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => (
          <PaginationTotal total={total} entityName="Purchases" />
        ),
      }}
    >
      <Table.Column
        title={
          <Typography.Text
            style={{
              whiteSpace: "nowrap",
            }}
          >
            ID 
          </Typography.Text>
        }
        dataIndex="id"
        key="id"
        width={80}
        render={(value) => (
          <Typography.Text
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </Typography.Text>
        )}
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <InputNumber
              // addonBefore="#"
              style={{ width: "100%" }}
              placeholder={t("products.filter.id.placeholder")}
            />
          </FilterDropdown>
        )}
      />
      <Table.Column
        title={t("purchases.fields.createdAt")}
        dataIndex="createdAt"
        key="createdAt"
        align="right"
        sorter
        // defaultSortOrder={getDefaultSortOrder("price", sorters)}
        render={(value: string) => {
          return (
            <Typography.Text
              style={{
                whiteSpace: "nowrap",
              }}
            >
              {value.split("T")[0]}
            </Typography.Text>
          );
        }}
      />
      <Table.Column
        title={t("purchases.fields.supplier")}
        dataIndex="supplier"
        key="supplier"
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("name", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t("purchases.filter.supplier.placeholder")} />
          </FilterDropdown>
        )}
        render={(value: string) => {
          return (
            <Typography.Text
              style={{
                whiteSpace: "nowrap",
              }}
            >
              {value}
            </Typography.Text>
          );
        }}
      />
      <Table.Column
        title={t("purchases.fields.note")}
        dataIndex="description"
        key="description"
        width={432}
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter(
          "description",
          filters,
          "contains"
        )}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t("purchases.filter.note.placeholder")} />
          </FilterDropdown>
        )}
        render={(description: string) => {
          return (
            <Typography.Paragraph
              ellipsis={{ rows: 1, tooltip: true }}
              style={{
                maxWidth: "400px",
                marginBottom: 0,
              }}
            >
              {description}
            </Typography.Paragraph>
          );
        }}
      />
      <Table.Column
        title={t("products.fields.price")}
        dataIndex="price"
        key="price"
        align="right"
        sorter
        defaultSortOrder={getDefaultSortOrder("price", sorters)}
        render={(price: number) => {
          return (
            <NumberField
              value={price}
              style={{
                width: "80px",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}
              options={{
                style: "currency",
                currency: "USD",
              }}
            />
          );
        }}
      />
      <Table.Column
        title={t("purchases.fields.credit")}
        dataIndex="payment"
        key="payment"
        align="right"
        sorter
        //defaultSortOrder={getDefaultSortOrder("price", sorters)}
        render={(credit: number) => {
          return (
            <NumberField
              value={credit}
              style={{
                width: "80px",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}
              options={{
                style: "currency",
                currency: "USD",
              }}
            />
          );
        }}
      />
      <Table.Column
        title={t("table.actions")}
        key="actions"
        fixed="right"
        align="center"
        render={(_, record: IProduct) => {
          return (
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                return go({
                  to: `${showUrl("products", record.id)}`,
                  query: {
                    to: pathname,
                  },
                  options: {
                    keepQuery: true,
                  },
                  type: "replace",
                });
              }}
            />
          );
        }}
      />
    </Table>
  );
};
