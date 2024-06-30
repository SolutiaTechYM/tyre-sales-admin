import React from 'react';
import { useTranslate, HttpError, getDefaultFilter, useExport, useGo, useNavigation } from "@refinedev/core";
import { List, useTable, DateField, FilterDropdown, getDefaultSortOrder, ExportButton, CreateButton, NumberField } from "@refinedev/antd";
import { Table, Typography, theme, InputNumber, Input, Select, Button } from "antd";
import { ITransactionlist, ICustomer, TradeType } from "../../interfaces";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { PaginationTotal } from "../../components";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { log } from 'console';

export const PaymentList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const { createUrl } = useNavigation();

  const transactionTypes = ["capital", "purchase", "sell"];

  const { tableProps, filters, sorters } = useTable<ITransactionlist, HttpError>({
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
    sorters,
    filters,
    mapData: (item) => {
      return {
        id: item.id,
      };
    },
  });

  const renderTable = (type: string) => {
    console.log("tableProps.dataSource:", tableProps.dataSource);
    const filteredData = tableProps.dataSource?.filter((item) => item.type === type);
    console.log("filteredData:", filteredData);
    

    let tableName: string;
    switch (type) {
      case 'PURCHASE':
        tableName = "Purchase Transactions";
        console.log("tableName:", tableName);

        break;
      case 'SALE':
        tableName = "Sale Transactions";
        console.log("tableName:", tableName);

        break;
      case 'CAPITAL':
        tableName = "Capital Transactions";
        console.log("tableName:", tableName);

        break;
      default:
        tableName = "Transactions";
        console.log("all data");

    }

    return (
      <List title={type}>
      <Table
        {...tableProps}
        dataSource={filteredData}
        rowKey="id"
        scroll={{ x: true }}
        style={{ marginBottom: 24 }}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => (
            <PaginationTotal
              total={total}
              entityName="transactions"
              customText={tableName}
            />
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







        <Table.Column
          key="value"
          dataIndex="value"
          title="Value"
          align="right"


          render={(value: number) => {
            return (
              <NumberField
                value={value}
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

          sorter
        />
        <Table.Column
          key="description"
          dataIndex="description"
          title="Description"

          sorter
        />

      </Table>
      </List>
    );
  };

  return (
    <List
      breadcrumb={false}
      headerButtons={(props) => [
        <ExportButton onClick={triggerExport} loading={isLoading} />,
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
        </CreateButton>,
      ]}
    >
      {renderTable('PURCHASE')}
      {renderTable('SALE')}
      {renderTable('CAPITAL')}
      {children}
    </List>
  );
};