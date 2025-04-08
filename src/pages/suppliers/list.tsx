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

import { ICustomer, ISupplier } from "../../interfaces";
import { EyeOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { PaginationTotal, UserStatus } from "../../components";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";

const SupplierList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const { createUrl } = useNavigation();

  const { tableProps, sorters, filters } = useTable<ISupplier, HttpError>({
    filters: {
      initial: [
        {
          field: "phone",
          operator: "contains",
          value: "",
        },
        {
          field: "name",
          operator: "contains",
          value: "",
        },
        {
          field: "contact_person",
          operator: "contains",
          value: "",
        },

        {
          field: "address",
          operator: "contains",
          value: "",
        },
        {
          field: "isActive",
          operator: "in",
          value: [],
        },
      ],
    },
  });


    const { isLoading, triggerExport } = useExport<ISupplier>({
      sorters: [
        {
          field: "name",
          order: "asc",
        }
      ],
      mapData: (item) => {
        return {
          'Name': item.name,
          'Address': item.address,
          'Contact Person': item.contact_person,
          'Due Amount': item.dueAmount.toFixed(2),
          'Phone':item.phone,
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
              to: `${createUrl("suppliers")}`,
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
          Add New Suppliers
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
            <PaginationTotal total={total} entityName="suppliers" />
          ),
        }}
      >
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
                addonBefore="#"
                style={{ width: "100%" }}
                placeholder={t("suppliers.filter.id.placeholder")}
              />
            </FilterDropdown>
          )}
        /> */}
        <Table.Column
          title={t("suppliers.fields.avatar")}
          dataIndex="avatar"
          key="avatar"
          render={(avatar: ISupplier["avatar"]) => {
            return (
              <Avatar

                src={avatar[0]?.thumbnailUrl || avatar?.url}
                alt={avatar?.name}
              />
            );
          }}
        />
        <Table.Column
          title={t("suppliers.fields.name")}
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
              <Input placeholder={t("suppliers.filter.name.placeholder")} />
            </FilterDropdown>
          )}
          width={250}
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
          title={t("suppliers.fields.address")}
          dataIndex="address"
          key="address"
          width={320}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{
                color: filtered ? token.colorPrimary : undefined,
              }}
            />
          )}
          defaultFilteredValue={getDefaultFilter(
            "address",
            filters,
            "contains",
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder={t("suppliers.filter.address.placeholder")} />
            </FilterDropdown>
          )}
          render={(address: string) => {
            return (
              <Typography.Paragraph
                ellipsis={{ rows: 1, tooltip: true }}
                style={{
                  maxWidth: "400px",
                  marginBottom: 0,
                }}
              >
                {address}
              </Typography.Paragraph>
            );
          }}
        />
        <Table.Column
          title={t("Contact")}
          dataIndex="phone"
          key="phone"
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{
                color: filtered ? token.colorPrimary : undefined,
              }}
            />
          )}
          defaultFilteredValue={getDefaultFilter("phone", filters, "contains")}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder={t("suppliers.filter.phone.placeholder")} />
            </FilterDropdown>
          )}
          width={180}
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
          key="contact_person"
          dataIndex="contact_person"
          title="Contact Person"
          width={200}

          filterIcon={(filtered) => (
            <SearchOutlined
              style={{
                color: filtered ? token.colorPrimary : undefined,
              }}
            />
          )}
          defaultFilteredValue={getDefaultFilter("contact_person", filters, "contains")}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder={t("contact person")} />
            </FilterDropdown>
          )}
          // width={180}
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
        // sorter
        />

<Table.Column
  title={t("suppliers.fields.dueAmount")}
  dataIndex="dueAmount"
  key="dueAmount"
  width={150}
  defaultSortOrder={getDefaultSortOrder("dueAmount", sorters)}
  render={(credit: number) => {
    const formatOptions = {

      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };

    if (credit < 0) {
      const formattedValue = `${Math.abs(credit).toLocaleString('en-LK', formatOptions)}`;
      return (
        <span
          style={{
            width: "80px",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            color: "lightgreen",
            fontWeight: "bold",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>C</div>
            <div>
              {formattedValue}

            </div>

          </div>
        </span>
      );
    } else if (credit > 0) {
      const formattedValue = `${credit.toLocaleString('en-LK', formatOptions)}`;
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
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

        <Table.Column
          title={t("Last Order Date")}
          dataIndex="lastOrderDate"
          key="lastOrderDate"
          // sorter
          width={150}
          defaultSortOrder={getDefaultSortOrder("lastOrderDate", sorters)}
          render={(lastOrderDate) => {
            return (
              // <NumberField
              //   value={lastOrderDate}
              //   style={{
              //     width: "80px",
              //     fontVariantNumeric: "tabular-nums",
              //     whiteSpace: "nowrap",
              //     textAlign: "right",
              //   }}
              //   options={{
              //     style: "date"
              //   }}
              // />
              <Typography.Text
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {lastOrderDate}
              </Typography.Text>
            );
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
                  to: `${showUrl("suppliers", record.id)}`,
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

export default SupplierList;