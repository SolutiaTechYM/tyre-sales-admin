import React, { useState, useEffect } from 'react';
import { useTranslate, HttpError, useExport, useGo, useNavigation, useList, CrudFilters } from "@refinedev/core";
import { List, FilterDropdown, ExportButton, CreateButton, NumberField } from "@refinedev/antd";
import { Table, Typography, theme, Input, Button } from "antd";
import { ITransactionlist } from "../../interfaces";
import { SearchOutlined } from "@ant-design/icons";
import { PaginationTotal } from "../../components";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";

interface TableFilters {
  code: string;
  supplier: string;
  note: string;
}

interface TableState {
  pagination: { current: number; pageSize: number };
  sorter?: { field: string; order: 'asc' | 'desc' };
  filters: TableFilters;
}

export const PaymentList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { pathname } = useLocation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const { createUrl } = useNavigation();

  const initialTableState: TableState = {
    pagination: { current: 1, pageSize: 10 },
    filters: { code: '', supplier: '', note: '' }
  };

  const [purchaseState, setPurchaseState] = useState<TableState>(initialTableState);
  const [saleState, setSaleState] = useState<TableState>(initialTableState);
  const [capitalState, setCapitalState] = useState<TableState>(initialTableState);

  // New state for temporary filter values
  const [tempFilters, setTempFilters] = useState({
    purchase: { ...initialTableState.filters },
    sale: { ...initialTableState.filters },
    capital: { ...initialTableState.filters },
  });

  const getFilters = (type: string, tableState: TableState): CrudFilters => {
    const filters: CrudFilters = [
      { field: "trade.type", operator: "eq", value: type },
    ];

    if (tableState.filters.code) {
      filters.push({ field: "trade.code", operator: "eq", value: tableState.filters.code });
    }
    if (tableState.filters.supplier) {
      const supplierField = type === "PURCHASE" ? "trade.connection.name" : "trade.connection.contact_person";
      filters.push({ field: supplierField, operator: "contains", value: tableState.filters.supplier });
    }
    if (tableState.filters.note) {
      filters.push({ field: "trade.note", operator: "contains", value: tableState.filters.note });
    }

    return filters;
  };

  const { data: purchaseData, isLoading: isPurchaseLoading } = useList<ITransactionlist>({
    resource: "transactions",
    filters: getFilters("PURCHASE", purchaseState),
    pagination: purchaseState.pagination,
    sorters: purchaseState.sorter ? [purchaseState.sorter] : undefined,
  });

  const { data: saleData, isLoading: isSaleLoading } = useList<ITransactionlist>({
    resource: "transactions",
    filters: getFilters("SALE", saleState),
    pagination: saleState.pagination,
    sorters: saleState.sorter ? [saleState.sorter] : undefined,
  });

  const { data: capitalData, isLoading: isCapitalLoading } = useList<ITransactionlist>({
    resource: "transactions",
    filters: getFilters("CAPITAL", capitalState),
    pagination: capitalState.pagination,
    sorters: capitalState.sorter ? [capitalState.sorter] : undefined,
  });

  const { isLoading: exportLoading, triggerExport } = useExport<ITransactionlist>({
    mapData: (item) => ({
      id: item.id,
      connection: item.connection?.name,
      type: item.type,
      date: item.date,
      value: item.value,
      description: item.note,
      code: item.code,
    }),
  });

  const renderTable = (type: 'PURCHASE' | 'SALE' | 'CAPITAL') => {
    let data: any, 
        isLoading: boolean, 
        tableState: TableState, 
        setTableState: React.Dispatch<React.SetStateAction<TableState>>,
        tableName: string;

    switch (type) {
      case 'PURCHASE':
        data = purchaseData;
        isLoading = isPurchaseLoading;
        tableState = purchaseState;
        setTableState = setPurchaseState;
        tableName = "Purchase Transactions";
        break;
      case 'SALE':
        data = saleData;
        isLoading = isSaleLoading;
        tableState = saleState;
        setTableState = setSaleState;
        tableName = "Sale Transactions";
        break;
      case 'CAPITAL':
        data = capitalData;
        isLoading = isCapitalLoading;
        tableState = capitalState;
        setTableState = setCapitalState;
        tableName = "Capital Transactions";
        break;
      default:
        return null;
    }

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
      setTableState(prev => ({
        ...prev,
        pagination,
        sorter: sorter.field && sorter.order 
          ? { 
              field: sorter.field === 'code' ? 'trade.code' : 
                     sorter.field === 'connection.name' && type === 'PURCHASE' ? 'connection.contact_person' : sorter.field,
              order: sorter.order === 'ascend' ? 'asc' : 'desc' 
            }
          : undefined
      }));
    };

    const handleTempFilterChange = (field: keyof TableFilters, value: string) => {
      setTempFilters(prev => ({
        ...prev,
        [type.toLowerCase()]: {
          ...prev[type.toLowerCase() as keyof typeof prev],
          [field]: value
        }
      }));
    };

    const handleSearch = (field: keyof TableFilters) => {
      const tempFilter = tempFilters[type.toLowerCase() as keyof typeof tempFilters][field];
      setTableState(prev => ({
        ...prev,
        pagination: { ...prev.pagination, current: 1 },
        filters: { ...prev.filters, [field]: tempFilter }
      }));
    };

    return (
      <Table
        title={() => <Typography.Title level={5}>{tableName}</Typography.Title>}
        dataSource={data?.data}
        loading={isLoading}
        pagination={{
          ...tableState.pagination,
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
        {type !== 'CAPITAL' && (
          <Table.Column
            key="code"
            dataIndex="code"
            title="Code"
            sorter={true}
            filterDropdown={({ confirm }) => (
              <div style={{ padding: 8 }}>
                <Input
                  placeholder="Search code"
                  value={tempFilters[type.toLowerCase() as keyof typeof tempFilters].code}
                  onChange={e => handleTempFilterChange('code', e.target.value)}
                  style={{ width: 188, marginBottom: 8, display: 'block' }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSearch('code');
                      confirm();
                    }
                  }}
                />
                <Button
                  type="primary"
                  onClick={() => {
                    handleSearch('code');
                    confirm();
                  }}
                  icon={<SearchOutlined />}
                  size="small"
                  style={{ width: 90 }}
                >
                  Search
                </Button>
              </div>
            )}
            filterIcon={() => (
              <SearchOutlined style={{ color: tableState.filters.code ? token.colorPrimary : undefined }} />
            )}
          />
        )}

        {type !== 'CAPITAL' && (
          <Table.Column
            key="connection"
            dataIndex={["connection", "name"]}
            title={type === 'PURCHASE' ? t("Supplier") : t("Customer")}
            sorter={true}
            filterDropdown={({ confirm }) => (
              <div style={{ padding: 8 }}>
                <Input
                  placeholder={`Search ${type === 'PURCHASE' ? 'supplier' : 'customer'}`}
                  value={tempFilters[type.toLowerCase() as keyof typeof tempFilters].supplier}
                  onChange={e => handleTempFilterChange('supplier', e.target.value)}
                  style={{ width: 188, marginBottom: 8, display: 'block' }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSearch('supplier');
                      confirm();
                    }
                  }}
                />
                <Button
                  type="primary"
                  onClick={() => {
                    handleSearch('supplier');
                    confirm();
                  }}
                  icon={<SearchOutlined />}
                  size="small"
                  style={{ width: 90 }}
                >
                  Search
                </Button>
              </div>
            )}
            filterIcon={() => (
              <SearchOutlined style={{ color: tableState.filters.supplier ? token.colorPrimary : undefined }} />
            )}
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
          title="Note"
          filterDropdown={({ confirm }) => (
            <div style={{ padding: 8 }}>
              <Input
                placeholder="Search note"
                value={tempFilters[type.toLowerCase() as keyof typeof tempFilters].note}
                onChange={e => handleTempFilterChange('note', e.target.value)}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSearch('note');
                    confirm();
                  }
                }}
              />
              <Button
                type="primary"
                onClick={() => {
                  handleSearch('note');
                  confirm();
                }}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
            </div>
          )}
          filterIcon={() => (
            <SearchOutlined style={{ color: tableState.filters.note ? token.colorPrimary : undefined }} />
          )}
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