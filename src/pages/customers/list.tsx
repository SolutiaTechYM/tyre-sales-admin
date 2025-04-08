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
  CreateButton,
  NumberField
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

import { ICustomer } from "../../interfaces";
import { EyeOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { PaginationTotal, UserStatus } from "../../components";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";

const CustomerList: React.FC<PropsWithChildren> = ({ children }) => {
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const { createUrl } = useNavigation();


  const { tableProps, filters, sorters } = useTable<
    ICustomer,
    HttpError
  // IUserFilterVariables
  >({
    filters: {
      initial: [
        {
          field: "name", //fullname
          operator: "contains",
          value: "",
        },
        {
          field: "address", //fullname
          operator: "contains",
          value: "",
        },
        {
          field: "phone", //fullname
          operator: "contains",
          value: "",
        },
        {
          field: "contact_person", //fullname
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

     const { isLoading, triggerExport } = useExport<ICustomer>({
      sorters: [
        {
          field: "contact_person",
          order: "asc",
        }
      ],
        mapData: (item) => {
          return {
            'Name': item.contact_person,
            'Address': item.address,
            'Company': item.name,
            'Phone':item.phone,
            'Due Amount': item.dueAmount.toFixed(2),
            'Last Order Date':item.lastOrderDate,
            'Added Date':item.createdAt,
          };
        },
      });
  

  return (
    <List
      breadcrumb={false}
      headerButtons={(props) => [
        <ExportButton key='export' onClick={triggerExport} loading={isLoading} icon={<UploadOutlined/>}/>,

        <CreateButton
          {...props.createButtonProps}
          key="create"
          size="large"
          onClick={() => {
            return go({
              to: `${createUrl("customers")}`,
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
            <PaginationTotal total={total} entityName="customers" customText="Customers" />
          ),
        }}
      >
        {/* <Table.Column
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
                // addonBefore="#"
                style={{ width: "100%" }}
                placeholder={t("orders.filter.id.placeholder")}
              />
            </FilterDropdown>
          )}
        /> */}
        <Table.Column
          align="center"
          key="avatar"
          dataIndex={"avatar"}
          title={t("users.fields.avatar.label")}
          render={(value) => <Avatar src={value[0]?.url} />}
        />

        <Table.Column
          key="contact_person"
          dataIndex="contact_person"
          sorter

          title={t("users.fields.name")}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{
                color: filtered ? token.colorPrimary : undefined,
              }}
            />
          )}
          defaultFilteredValue={getDefaultFilter("contact_person",
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
          key="phone"
          dataIndex="phone"
          title={t("Contact")}
          defaultFilteredValue={getDefaultFilter("phone", filters, "eq")}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{
                color: filtered ? token.colorPrimary : undefined,
              }}
            />
          )}
          
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
          key="address"
          dataIndex="address"
          title="Address"
          defaultFilteredValue={getDefaultFilter("address", filters, "contains")}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{
                color: filtered ? token.colorPrimary : undefined,
              }}
            />
          )}
          
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
          key="lastOrderDate"
          dataIndex="lastOrderDate"
          title="Last Order Date"

          // sorter
        />

        <Table.Column
          key="name"
          dataIndex="name"
          title="Company"
          defaultFilteredValue={getDefaultFilter("name", filters, "contains")}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{
                color: filtered ? token.colorPrimary : undefined,
              }}
            />
          )}
          
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
          key="due_amount"
          dataIndex="dueAmount"
          title="Due Amount"
        // sorter


                render={(credit: number) => {
                    const formatOptions = {

                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    };

                    if (credit > 0) {
                        const formattedValue = `${credit.toLocaleString('en-LK', formatOptions)}`;
                        return (
                            <span
                                style={{
                                    width: "80px",
                                    fontVariantNumeric: "tabular-nums",
                                    whiteSpace: "nowrap",
                                    color: "lightgreen"
                                    , fontWeight: "bold",
                                }}
                            >
                <div style={{display: "flex", justifyContent: "space-between"}}>
                <div>C</div>
                <div>
                {formattedValue}

                </div>

                </div>
              </span>
                        );
                    } else if (credit < 0) {
                        const formattedValue = `${Math.abs(credit).toLocaleString('en-LK', formatOptions)}`;
                        return (
                            <span
                                style={{
                                    width: "80px",
                                    fontVariantNumeric: "tabular-nums",
                                    whiteSpace: "nowrap",
                                    color: "red",
                                    fontWeight: "bold",
                                }}
                            >
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                <div>D</div>
                <div>
                {formattedValue}

                </div>

                </div>


              </span>
                        );
                    } else {
                        return (
                            <span
                                style={{
                                    width: "80px",
                                    fontVariantNumeric: "tabular-nums",
                                    whiteSpace: "nowrap",
                                    color: "white"
                                }}
                            >
              -
              </span>)
                    }
                }}
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
                  to: `${showUrl("customers", record.id)}`,
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

export default CustomerList;
