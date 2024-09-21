import React, { useState, useEffect } from 'react';
import { useTranslate, HttpError, useExport, useGo, useNavigation, useList, CrudFilters } from "@refinedev/core";
import { List, FilterDropdown, ExportButton, CreateButton, NumberField } from "@refinedev/antd";
import { Table, Typography, theme, InputNumber, Input } from "antd";
import { ITransactionlist } from "../../interfaces";
import { SearchOutlined } from "@ant-design/icons";
import { PaginationTotal } from "../../components";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";

export const PaymentList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { pathname } = useLocation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const { createUrl } = useNavigation();

  const [purchasePagination, setPurchasePagination] = useState({ current: 1, pageSize: 10 });
  const [salePagination, setSalePagination] = useState({ current: 1, pageSize: 10 });
  const [capitalPagination, setCapitalPagination] = useState({ current: 1, pageSize: 10 });

  const [purchaseSorter, setPurchaseSorter] = useState<{ field: string; order: 'asc' | 'desc' } | undefined>();
  const [saleSorter, setSaleSorter] = useState<{ field: string; order: 'asc' | 'desc' } | undefined>();
  const [capitalSorter, setCapitalSorter] = useState<{ field: string; order: 'asc' | 'desc' } | undefined>();

  const [idFilter, setIdFilter] = useState<number | null>(null);
  const [codeFilter, setCodeFilter] = useState<string>('');
  const [supplierFilter, setSupplierFilter] = useState<string>('');
  const [descriptionFilter, setDescriptionFilter] = useState<string>('');

  useEffect(() => {
    setPurchasePagination({ current: 1, pageSize: 10 });
    setSalePagination({ current: 1, pageSize: 10 });
    setCapitalPagination({ current: 1, pageSize: 10 });
  }, [idFilter, codeFilter, supplierFilter, descriptionFilter]);

  const getFilters = (type: string): CrudFilters => {
    const filters: CrudFilters = [
      { field: "trade.type", operator: "eq", value: type },
    ];

    if (idFilter !== null) {
      filters.push({ field: "id", operator: "eq", value: idFilter });
    }
    if (codeFilter) {
      filters.push({ field: "code", operator: "contains", value: codeFilter });
    }
    if (supplierFilter) {
      filters.push({ field: "connection.name", operator: "contains", value: supplierFilter });
    }
    if (descriptionFilter) {
      filters.push({ field: "description", operator: "contains", value: descriptionFilter });
    }

    return filters;
  };

  const { data: purchaseData, isLoading: isPurchaseLoading } = useList<ITransactionlist>({
    resource: "transactions",
    filters: getFilters("PURCHASE"),
    pagination: purchasePagination,
    sorters: purchaseSorter ? [purchaseSorter] : undefined,
  });

  const { data: saleData, isLoading: isSaleLoading } = useList<ITransactionlist>({
    resource: "transactions",
    filters: getFilters("SALE"),
    pagination: salePagination,
    sorters: saleSorter ? [saleSorter] : undefined,
  });

  const { data: capitalData, isLoading: isCapitalLoading } = useList<ITransactionlist>({
    resource: "transactions",
    filters: getFilters("CAPITAL"),
    pagination: capitalPagination,
    sorters: capitalSorter ? [capitalSorter] : undefined,
  });

  const { isLoading: exportLoading, triggerExport } = useExport<ITransactionlist>({
    mapData: (item) => {
      return {
        id: item.id,
        connection: item.connection?.name,
        type: item.type,
        date: item.date,
        value: item.value,
        description: item.note,
        code: item.code,
      };
    },
  });

  const renderTable = (type: 'PURCHASE' | 'SALE' | 'CAPITAL') => {
    let data: any, isLoading: boolean, pagination: any, setPagination: React.Dispatch<React.SetStateAction<any>>, sorter: any, setSorter: React.Dispatch<React.SetStateAction<any>>, tableName: string;

    switch (type) {
      case 'PURCHASE':
        data = purchaseData;
        isLoading = isPurchaseLoading;
        pagination = purchasePagination;
        setPagination = setPurchasePagination;
        sorter = purchaseSorter;
        setSorter = setPurchaseSorter;
        tableName = "Purchase Transactions";
        break;
      case 'SALE':
        data = saleData;
        isLoading = isSaleLoading;
        pagination = salePagination;
        setPagination = setSalePagination;
        sorter = saleSorter;
        setSorter = setSaleSorter;
        tableName = "Sale Transactions";
        break;
      case 'CAPITAL':
        data = capitalData;
        isLoading = isCapitalLoading;
        pagination = capitalPagination;
        setPagination = setCapitalPagination;
        sorter = capitalSorter;
        setSorter = setCapitalSorter;
        tableName = "Capital Transactions";
        break;
      default:
        return null;
    }

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
      setPagination(pagination);
      if (sorter.field && sorter.order) {
        setSorter({ field: sorter.field, order: sorter.order === 'ascend' ? 'asc' : 'desc' });
      } else {
        setSorter(undefined);
      }
    };

    return (
      <Table
        title={() => <Typography.Title level={5}>{tableName}</Typography.Title>}
        dataSource={data?.data}
        loading={isLoading}
        pagination={{
          ...pagination,
          total: data?.total,
          showTotal: (total) => (
            <PaginationTotal
              total={total}
              entityName="transactions"
              customText={tableName}
            />
          ),
        }}
        onChange={handleTableChange}
        rowKey="id"
        scroll={{ x: true }}
        style={{ marginBottom: 24 }}
      >
        <Table.Column
          key="code"
          dataIndex="code"
          title="Code"
          sorter={true}
          filterDropdown={() => (
            <Input
              placeholder="Search code"
              value={codeFilter}
              onChange={(e) => setCodeFilter(e.target.value)}
              style={{ width: 200, marginBottom: 8, display: 'block' }}
            />
          )}
          filterIcon={() => <SearchOutlined style={{ color: codeFilter ? '#1890ff' : undefined }} />}
          render={(value) => (
            <Typography.Text style={{ whiteSpace: "nowrap" }}>{value}</Typography.Text>
          )}
        />

        {type !== 'CAPITAL' && (
          <Table.Column
            key="connection"
            dataIndex={["connection", "name"]}
            title={type === 'PURCHASE' ? t("Supplier") : t("Customer")}
            sorter={true}
            filterDropdown={() => (
              <Input
                placeholder="Search supplier"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                style={{ width: 200, marginBottom: 8, display: 'block' }}
              />
            )}
            filterIcon={() => <SearchOutlined style={{ color: supplierFilter ? '#1890ff' : undefined }} />}
          />
        )}

        <Table.Column
          key="date"
          dataIndex="date"
          title={t("Date")}
          sorter={true}
        />

        <Table.Column
          key="value"
          dataIndex="value"
          title="Value"
          align="right"
          sorter={true}
          render={(value: number) => (
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
          )}
        />

        <Table.Column
          key="note"
          dataIndex="note"
          title="note"
          // sorter={true}
          filterDropdown={() => (
            <Input
              placeholder="Search description"
              value={descriptionFilter}
              onChange={(e) => setDescriptionFilter(e.target.value)}
              style={{ width: 200, marginBottom: 8, display: 'block' }}
            />
          )}
          filterIcon={() => <SearchOutlined style={{ color: descriptionFilter ? '#1890ff' : undefined }} />}
        />
      </Table>
    );
  };

  return (
    <List
      breadcrumb={false}
      headerButtons={(props) => [
        <ExportButton onClick={triggerExport} loading={exportLoading} />,
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