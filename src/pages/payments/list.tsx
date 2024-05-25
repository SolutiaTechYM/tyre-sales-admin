import {
  useTranslate,
  HttpError,
  getDefaultFilter,
  useExport,
  useGo,
  useNavigation,
} from "@refinedev/core";
import {
  List,
  useTable,
  DateField,
  FilterDropdown,
  getDefaultSortOrder,
  ExportButton,
  CreateButton
} from "@refinedev/antd";
import {
  Table,
  Avatar,
  Typography,
  theme,
  InputNumber,
  Input,
  Select,
  Button,
} from "antd";

import { ITransactionlist, ICustomer, IUserFilterVariables } from "../../interfaces";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { PaginationTotal } from "../../components";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";

export const PaymentList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const { createUrl } = useNavigation();

  const transactionTypes = ["capital", "purchase", "sell"];

  const {   tableProps, filters, sorters } = useTable<
    ICustomer,
    HttpError,
    IUserFilterVariables
  >({
    filters: {
      initial: [
        {
          field: "fullName",
          operator: "contains",
          value: "",
        },
      ],
    },
    sorters: {
      initial: [
        {
          field: "id",
          order: "desc",
        },
      ],
    },
    syncWithLocation: true,
  });

  const { isLoading, triggerExport } = useExport<ITransactionlist>({
    //print all
    sorters,
    filters,

    mapData: (item) => {
      return {
        id: item.id,
      
      };
    },
  });

  return (
    <List
      breadcrumb={false}
      headerButtons={(props) => [
        <ExportButton onClick={triggerExport} loading={isLoading} />
,
        <CreateButton
          {...props.createButtonProps}
          key="create"
          size="large"
          onClick={() => {
            return go({
              to: `${createUrl("transactions")}`,
              query: {
                to: pathname,
              },
              options: {
                keepQuery: true,
              },
              type: "replace",
            });
          }}
        >
          Add Transaction
        </CreateButton>
      ]}
    >
      <Table
        {...tableProps}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="users" />
          ),
        }}
      >
        <Table.Column
          key="id"
          dataIndex="id"
          sorter

          title="ID"
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
          defaultFilteredValue={getDefaultFilter("orderNumber", filters, "eq")}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <InputNumber
                addonBefore="#"
                style={{ width: "100%" }}
                placeholder={t("orders.filter.id.placeholder")}
              />
            </FilterDropdown>
          )}
        />

<Table.Column
  key="connection"
  dataIndex="connection"
  sorter
  title={t("Connection")}
  render={(connection) => connection?.name}
/>

<Table.Column
        key="type"
          dataIndex="type"
          sorter

          title={t("Type")}

       
      />
      <Table.Column
        key="date"
          dataIndex="date"
          sorter

          title={t("Date")}

       
      />


        
{/* <Table.Column
  title={t("Type")}
  dataIndex={["transactionType", "title"]}
  key="transactionType.id"
  sorter
  
  defaultFilteredValue={getDefaultFilter("transactionType.id", filters, "in")}
  filterDropdown={(props) => {
    return (
      <FilterDropdown
        {...props}
        selectedKeys={props.selectedKeys.map((item) => Number(item))}
      >
        <Select
          style={{ width: "200px" }}
          allowClear
          mode="multiple"
          placeholder={t("Search Type")}
        >
          {transactionTypes.map((type) => (
            <Select.Option key={type} value={type}>
              {type}
            </Select.Option>
          ))}
        </Select>
      </FilterDropdown>
    );
  }}
  render={(_, record) => {
    const transactionType = transactionTypes.find(
      (type) => type === record.type?.title
    );

    return (
      <Typography.Text
        style={{
          whiteSpace: "nowrap",
        }}
      >
        {transactionType || "-"}
      </Typography.Text>
    );
  }}
/> */}
        



        <Table.Column
          key="value"
          dataIndex="value"
          title="Value"
          
          sorter
        />
        <Table.Column
          key="description"
          dataIndex="description"
          title="Description"
          
          sorter
        />
{/* 
<Table.Column
          key="balance"
          dataIndex="balance"
          title="Balance"
        /> */}
        {/* <Table.Column
          key="isActive"
          dataIndex="isActive"
          title={t("users.fields.isActive.label")}
          render={(value) => {
            return <UserStatus value={value} />;
          }}
          sorter
          defaultSortOrder={getDefaultSortOrder("isActive", sorters)}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ width: "100%" }}
                placeholder={t("users.filter.isActive.placeholder")}
              >
                <Select.Option value="true">
                  {t("users.fields.isActive.true")}
                </Select.Option>
                <Select.Option value="false">
                  {t("users.fields.isActive.false")}
                </Select.Option>
              </Select>
            </FilterDropdown>
          )}
        /> */}
        {/* <Table.Column<IUser>
          fixed="right"
          title={t("table.actions")}
          render={(_, record) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                return go({
                  to: `${showUrl("users", record.id)}`,
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
          )}
        /> */}
      </Table>
      {children}
    </List>
  );
};
