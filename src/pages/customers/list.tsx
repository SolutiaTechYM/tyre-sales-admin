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

import {  ICustomer, IUserFilterVariables } from "../../interfaces";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { PaginationTotal, UserStatus } from "../../components";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";

export const CustomerList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const { createUrl } = useNavigation();


  const {   tableProps, filters, sorters } = useTable<
  ICustomer,
    HttpError,
    IUserFilterVariables
  >({
    filters: {
      initial: [
        {
          field: "name", //fullname
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

  // const { isLoading, triggerExport } = useExport<IUser>({
  //   sorters,
  //   filters,
  //   pageSize: 50,
  //   maxItemCount: 50,
  //   mapData: (item) => {
  //     return {
  //       id: item.id,
  //       fullName: item.fullName,
  //       gsm: item.gsm,
  //       isActive: item.isActive,
  //       createdAt: item.createdAt,
  //     };
  //   },
  // });

  return (
    <List
      breadcrumb={false}
      headerButtons={(props) => [
        <CreateButton
          {...props.createButtonProps}
          key="create"
          size="large"
          onClick={() => {
            return go({
              to: `${createUrl("users")}`,
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
          Add New Customers
        </CreateButton>,
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
          align="center"
          key="avatar"
          dataIndex={"avatar"}
          title={t("users.fields.avatar.label")}
          render={(value) => <Avatar src={value?.url} />}
        />

<Table.Column
        key="name"
          dataIndex="name"
          sorter

          title={t("users.fields.name")}
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter( "name",
        filters,
        "contains",)}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input style={{ width: "100%" }}
                placeholder={t("users.filter.name.placeholder")} />
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
          key="Contact"
          dataIndex="contact"
          title={t("Contact")}
          defaultFilteredValue={getDefaultFilter("Contact", filters, "eq")}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input
                style={{ width: "100%" }}
                placeholder="search contact"
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          key="address"
          dataIndex="address"
          title="Address"
          
          sorter
        />

<Table.Column
          key="company"
          dataIndex="company"
          title="Company"
          
          sorter
        />

<Table.Column
          key="balance"
          dataIndex="balance"
          title="Balance"
        />
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
        <Table.Column<ICustomer>
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
        />
      </Table>
      {children}
    </List>
  );
};
