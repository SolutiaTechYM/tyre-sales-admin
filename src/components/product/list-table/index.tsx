import {
  HttpError,
  getDefaultFilter,
  useGo,
  useModal,
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
import { ICategory, IProduct } from "../../../interfaces";
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
import { ProductStatus } from "../status";
import { PaginationTotal } from "../../paginationTotal";
import {
  EyeOutlined,
  FilePdfOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export const ProductListTable = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();
  const { show, visible, close } = useModal();

  const { tableProps, sorters, filters } = useTable<IProduct, HttpError>({
    filters: {
      initial: [
        {
          field: "description",
          operator: "contains",
          value: "",
        },
        {
          field: "name",
          operator: "contains",
          value: "",
        },
        {
          field: "category.id",
          operator: "in",
          value: [],
        },
      ],
    },
  });

  const { selectProps: categorySelectProps, queryResult } =
    useSelect<ICategory>({
      resource: "categories",
      optionLabel: "name",
      optionValue: "id",
      defaultValue: getDefaultFilter("category.id", filters, "in"),
    });

  const categories = queryResult?.data?.data || [];

  return (
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => (
          <PaginationTotal total={total} entityName="products" />
        ),
      }}
    >
      <Table.Column
        title={'Image'}
        dataIndex="images"
        key="images"
        align="center"
        render={(images: IProduct["images"]) => {
          return (
            <Avatar
              shape="square"
              // src={images?.url}
              // alt={images?.name}
              src={images?.[0]?.thumbnailUrl}
              // alt={images?.[0].name} || images?.[0]?.url
            />
          );
        }}
      />
      {/* <Table.Column
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
        sorter
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
              style={{ width: "100%" }}
              placeholder={t("products.filter.id.placeholder")}
            />
          </FilterDropdown>
        )}
      /> */}

      <Table.Column
        title={t("Code")}
        dataIndex="code"
        key="code"
        sorter
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("code", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t("search code")} />
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
        title={t("products.fields.name")}
        dataIndex="name"
        key="name"
        sorter
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
            <Input placeholder={t("products.filter.name.placeholder")} />
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

      {/* <Table.Column
        title={t("products.fields.description")}
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
            <Input placeholder={t("products.filter.description.placeholder")} />
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
      /> */}

      <Table.Column<IProduct>
        title={t("products.fields.category")}
        dataIndex={["category", "title"]}
        key="category.id"
        width={128}
        defaultFilteredValue={getDefaultFilter("category.id", filters, "in")}
        filterDropdown={(props) => {
          return (
            <FilterDropdown {...props}>
              <Select
                {...categorySelectProps}
                style={{ width: "200px" }}
                allowClear
                placeholder={t("products.filter.category.placeholder")}
              />
            </FilterDropdown>
          );
        }}
        render={(_, record) => {
          const category = categories.find(
            (category) => category?.id === record.category?.id
          );

          return (
            <Typography.Text
              style={{
                whiteSpace: "nowrap",
              }}
            >
              {category?.name || "-"}
            </Typography.Text>
          );
        }}
      />

<Table.Column
        title={t("Remaining Quantity")}
        dataIndex="quantityRemaining"
        key="quantityRemaining"
        align="right"
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

      {/* <Table.Column
        title={t("Current Price")}
        dataIndex="current_price"
        key="current_price"
        align="right"
        sorter
        defaultSortOrder={getDefaultSortOrder("current_price", sorters)}
        render={(current_price: number) => {
          return (
            <NumberField
              value={current_price}
              style={{
                width: "80px",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
                fontWeight: "bold",

              }}
              options={{
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }}
            />
          );
        }}
      /> */}
      {/* <Table.Column
        title={t("products.fields.isActive.label")}
        dataIndex="isActive"
        key="isActive"
        sorter
        defaultSortOrder={getDefaultSortOrder("isActive", sorters)}
        defaultFilteredValue={getDefaultFilter("isActive", filters, "in")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              style={{ width: "200px" }}
              allowClear
              mode="multiple"
              placeholder={t("products.filter.isActive.placeholder")}
            >
              <Select.Option value="true">
                {t("products.fields.isActive.true")}
              </Select.Option>
              <Select.Option value="false">
                {t("products.fields.isActive.false")}
              </Select.Option>
            </Select>
          </FilterDropdown>
        )}
        render={(isActive: boolean) => {
          return <ProductStatus value={isActive} />;
        }}
      /> */}

      {/* <Table.Column
        title={"Quantity"}
        dataIndex="quantity"
        key="quantity"
        sorter
        align="right"

        render={(value: string) => {
          return (
            <Typography.Text
              style={{
                whiteSpace: "nowrap",
              }}
            >
            </Typography.Text>
          );
        }}
      /> */}

      <Table.Column
        title={t("table.actions")}
        key="actions"
        fixed="right"
        align="center"
        width="100px"
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

            // <Button
            //           size="small"
            //           icon={<FilePdfOutlined />}
            //           onClick={() => {
            //             // setRecord(record);
            //             show();
            //           }}
            //         />
          );
        }}
      />
    </Table>
  );
};
