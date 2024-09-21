import { useDrawerForm } from "@refinedev/antd";
import { BaseKey, useApiUrl, useGetToPath, useGo, useTranslate } from "@refinedev/core";
import { useSelect } from "@refinedev/antd";
import { useForm } from "antd/lib/form/Form";
import { Form, Input, Select, Table, Button, Flex, Spin, notification } from "antd";
import { ITransaction, ISupplier, ICustomer, IPaymentTable, ITransactionCreate, ITransactionCreateDetail, TradeType } from "../../../interfaces";
import { useSearchParams } from "react-router-dom";
import { Drawer } from "../../drawer";
import { useState, useEffect } from "react";
import { Empty } from 'antd';
import { code } from "@uiw/react-md-editor";

type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const PaymentDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const [form] = useForm();
  const { drawerProps, formProps, close, saveButtonProps, formLoading } = useDrawerForm<ITransaction>({
    resource: "transactions",
    id: props?.id,
    action: props.action,
    redirect: false,
    onMutationSuccess: () => {
      console.log("Form data:", form.getFieldsValue());
      props.onMutationSuccess?.();
    },
  });

  const [selectedTransactionType, setSelectedTransactionType] = useState<"capital" | "purchase" | "sale" | undefined>(undefined);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | undefined>();
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | undefined>();
  const [capitalAmount, setCapitalAmount] = useState<number | undefined>();
  const [sellPayments, setSellPayments] = useState<{[id:string]:number}>({});
  const [purchasePayments, setPurchasePayments] = useState<{[id:string]:number}>({});


  const showsuccessNotification = (msg: string) => {
    notification.success({
      message: "success",
      description: msg,
      duration: 3,
      style: {
        zIndex: 1000,
      },
    });
  };

  const { selectProps: supplierSelectProps } = useSelect<ISupplier>({
    resource: "suppliers",
    optionValue: "id",
    optionLabel: "name",
    queryOptions: {
      select: (data) => ({
        data: data.data.sort((a, b) => a.name.localeCompare(b.name)),
        total: data.total,
      }),
    },
  });

  const { selectProps: customerSelectProps } = useSelect<ICustomer>({
    resource: "customers",
    optionValue: "id",
    optionLabel: "name",
    queryOptions: {
      select: (data) => ({
        data: data.data.sort((a, b) => a.name.localeCompare(b.name)),
        total: data.total,
      }),
    },
  });

  const [filteredSellData, setFilteredSellData] = useState<IPaymentTable[]>([]);
  const [filteredPurchaseData, setFilteredPurchaseData] = useState<IPaymentTable[]>([]);

  const fetchPurchaseData = async (supplierId: number) => {
    try {
      const response = await fetch(`${apiUrl}/transactions/trades/supplier/${supplierId}`);
      const data = await response.json();
      setFilteredPurchaseData(data);
    } catch (error) {
      console.error('Error fetching purchase data:', error);
    }
  };

  const fetchSellData = async (customerId: number) => {
    try {
      const response = await fetch(`${apiUrl}/transactions/trades/customer/${customerId}`, { method: "GET" });
      const data = await response.json();
      setFilteredSellData(data);
    } catch (error) {
      console.error('Error fetching sale data:', error);
    }
  };

  useEffect(() => {
    if (selectedSupplierId) {
      fetchPurchaseData(selectedSupplierId);
    }
    // setCapitalAmount(undefined);
    setSellPayments({});
    setPurchasePayments({});
  }, [selectedSupplierId]);

  useEffect(() => {
    if (selectedCustomerId) {
      fetchSellData(selectedCustomerId);
    }
    // setCapitalAmount(undefined);
  setSellPayments({});
  setPurchasePayments({});
  }, [selectedCustomerId]);

  const onDrawerClose = () => {
    close();
    if (props?.onClose) {
      props.onClose();
      return;
    }
    go({
      to: searchParams.get("to") ?? getToPath({ action: "list" }) ?? "",
      query: { to: undefined },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  const title = props.action === "edit" ? null : t("Add Payment");

  const transactionTypeOptions = [
    { label: "Capital", value: "capital" },
    { label: "Purchase", value: "purchase" },
    { label: "Sale", value: "sale" },
  ];

  const handleTransactionTypeChange = (value: "capital" | "purchase" | "sale") => {
    setSelectedTransactionType(value);
    // setCapitalAmount(undefined);
    setSellPayments({});
    setPurchasePayments({});
  };
  
  
  const renderTransactionForm = () => {
    switch (selectedTransactionType) {
      case "capital":
        return (
<Form.Item
  name="amount"
  label="Amount"
  rules={[{ required: true, message: "Please enter an amount" }]}
>
  <Input
    type="number"
    min={0}
    step="any"
    onKeyPress={(e) => {
      if (e.key === '-') {
        e.preventDefault();
      }
    }}
    onChange={(e) => setCapitalAmount(parseFloat(e.target.value))}
  />
</Form.Item>
        );
      case "sale":
        return (
          <>
            <Form.Item name="customerId" label="Customer" rules={[{ required: true, message: "Please select a customer" }]}>
              <Select {...customerSelectProps} onChange={(value) => setSelectedCustomerId(value as unknown as number)} />
            </Form.Item>
            <Form.Item>
              {filteredSellData.length > 0 ? (
                <Table
                dataSource={filteredSellData
                  .filter(item => item.dueAmount > 0)  // Add this line
                  .map(item => ({
                    id: item.id,
                    dueAmount: item.dueAmount,
                    value: item.value,
                    createdAt: item.createdAt,
                    note: item.note,
                    code: item.code,
                    payment: sellPayments[item.id] || 0,
                  }))}
                  rowKey="id"
                  bordered
                  pagination={false}
                >
                  <Table.Column title="Code" dataIndex="code" key="code" />
                  <Table.Column title="Description" dataIndex="note" key="note" />
                  <Table.Column title="Date" dataIndex="createdAt" key="createdAt" />
                  <Table.Column 
    title="Total Price" 
    dataIndex="value" 
    key="value"  
    render={(text) => <span style={{ color: 'blue',fontWeight:'bold' }}>{text}</span>}
  />
  <Table.Column 
    title="Due Amount" 
    dataIndex="dueAmount" 
    key="dueAmount" 
    render={(text) => <span style={{ color: 'orange',fontWeight:'bold' }}>{text}</span>}
  />
                  <Table.Column
                    title="Payment"
                    dataIndex="payment"
                    key="payment"
                    render={(value, record: { id: number; payment: number }) => (
                      <Input
                        min={0}
                        type="number"
                        value={value}
                        step="any"
                        onKeyPress={(e) => {
                          if (e.key === '-') {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => setSellPayments({...sellPayments, [record.id]: parseFloat(e.target.value)})}
                      />
                    )}
                  />
                </Table>
              ) : (
                <Empty description="No sale data available" />
              )}
            </Form.Item>
          </>
        );
      case "purchase":
        return (
          <>
            <Form.Item name="supplierId" label="Supplier" rules={[{ required: true, message: "Please select a supplier" }]}>
              <Select {...supplierSelectProps} onChange={(value) => setSelectedSupplierId(value as unknown as number)} />
            </Form.Item>
            <Form.Item>
              {filteredPurchaseData.length > 0 ? (
                <Table
                dataSource={filteredPurchaseData
                  .filter(item => item.dueAmount > 0)  // Add this line
                  .map(item => ({
                    id: item.id,
                    dueAmount: item.dueAmount,
                    value: item.value,
                    createdAt: item.createdAt,
                    note: item.note,
                    code: item.code,
                    payment: purchasePayments[item.id] || 0,
                  }))}
                  rowKey="id"
                  bordered
                  pagination={false}
                >
                  <Table.Column title="Code" dataIndex="code" key="code" />
                  <Table.Column title="Description" dataIndex="note" key="note" />
                  <Table.Column title="Date" dataIndex="createdAt" key="createdAt" />
                  <Table.Column 
    title="Total Price" 
    dataIndex="value" 
    key="value"  
    render={(text) => <span style={{ color: 'blue',fontWeight:'bold' }}>{text}</span>}
  />
  <Table.Column 
    title="Due Amount" 
    dataIndex="dueAmount" 
    key="dueAmount" 
    render={(text) => <span style={{ color: 'orange',fontWeight:'bold' }}>{text}</span>}
  />
                  <Table.Column
                    title="Payment"
                    dataIndex="payment"
                    key="payment"
                    render={(value, record: { id: number; payment: number }) => (
                      <Input
                        type="number"
                        value={value}
                        step="any"
                        min={0}
                        onKeyPress={(e) => {
                          if (e.key === '-') {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => setPurchasePayments({...purchasePayments, [record.id]: parseFloat(e.target.value)})}
                      />
                    )}
                  />
                </Table>
              ) : (
                <Empty description="No purchase data available" />
              )}
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  const handleSave = async () => {
    try {
      switch (selectedTransactionType) {
        case "capital":
          if (!capitalAmount) {
            // message.error("Please enter an amount for capital transaction");
            notification.error({
              message: "Error",
              description: "Please enter an amount for capital transaction",
              duration: 3,
              style: {
                zIndex: 1000,
              },
            });
            return;
          }
          // Make a POST request to save the capital transaction
          const capitalBody:ITransactionCreate = {
            type: TradeType.CAPITAL,
            transactions: [{amount:capitalAmount}]
          }
          const capitalResponse = await fetch(`${apiUrl}/transactions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(capitalBody),
          });
          if (!capitalResponse.ok) {
            notification.error({
              message: "Error",
              description: "Failed to save capital transaction",
              duration: 3,
              style: {
                zIndex: 1000,
              },
            });
            throw new Error("Failed to save capital transaction");

          }
          showsuccessNotification("Capital transaction saved successfully");
          console.log("Capital transaction saved successfully");
          go({
            to: getToPath({
              action: "list",
            }) ?? "",
            query: {
              to: undefined,
            },
            options: {
              keepQuery: true,
            },
            type: "replace",
          });

          break;
        case "sale":
          const hasNonZeroSellPayment = Object.values(sellPayments).some((payment) => payment > 0);
          if (!selectedCustomerId || !hasNonZeroSellPayment) {

            notification.error({
              message: "Error",
              description: "Please select a Customer and at least one Payment",
              duration: 3,
              style: {
                zIndex: 1000,
              },
            });
            return;
          }
          // Make a POST request to save the sell transaction
          const saleBody:ITransactionCreate = {
            type: TradeType.SALE,
            transactions: Object.entries(sellPayments).map(([id, payment]) => ({tradeID:id, amount:payment}))
          }
          const sellResponse = await fetch(`${apiUrl}/transactions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(saleBody),
          });
          if (!sellResponse.ok) {
            notification.error({
              message: "Error",
              description: "Failed to save sale transaction",
              duration: 3,
              style: {
                zIndex: 1000,
              },
            });
            throw new Error("Failed to save sale transaction");
          }
          showsuccessNotification("sale transaction saved successfully");

          console.log("sale transaction saved successfully");
          go({
            to: getToPath({
              action: "list",
            }) ?? "",
            query: {
              to: undefined,
            },
            options: {
              keepQuery: true,
            },
            type: "replace",
          });

          break;
        case "purchase":
          const hasNonZeroPurchasePayment = Object.values(purchasePayments).some((payment) => payment > 0);
          if (!selectedSupplierId || !hasNonZeroPurchasePayment) {
            notification.error({
              message: "Error",
              description: "Please select a Supplier and at least one Payment",
              duration: 3,
              style: {
                zIndex: 1000,
              },
            });
            return;
          }
          // Make a POST request to save the purchase transaction
          const purchaseBody:ITransactionCreate = {
            type: TradeType.PURCHASE,
            transactions: Object.entries(purchasePayments).map(([id, payment]) => ({tradeID:id, amount:payment}))
          }
          const purchaseResponse = await fetch(`${apiUrl}/transactions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(purchaseBody),
          });
          if (!purchaseResponse.ok) {
            notification.error({
              message: "Error",
              description: "Failed to save purchase transaction",
              duration: 3,
              style: {
                zIndex: 1000,
              },
            });
            throw new Error("Failed to save purchase transaction");
          }
          showsuccessNotification("Purchase transaction saved successfully");

          console.log("Purchase transaction saved successfully");
          go({
            to: getToPath({
              action: "list",
            }) ?? "",
            query: {
              to: undefined,
            },
            options: {
              keepQuery: true,
            },
            type: "replace",
          });
          break;
        default:
          notification.error({
            message: "Error",
            description: "select a Transaction Type",
            duration: 3,
            style: {
              zIndex: 1000,
            },
          });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: String(error),
        duration: 3,
        style: {
          zIndex: 1000,
        },
      });
      console.error("Error saving transaction:", error);
    }
  };

  return (
    <Drawer {...drawerProps} open={true} title={title} width="70%" zIndex={1001} onClose={onDrawerClose}>
      <Spin spinning={formLoading}>
        <Form {...formProps} layout="vertical" style={{ padding: '20px' }}>
          <Form.Item name="type" label="Transaction Type" rules={[{ required: true, message: "Please select a transaction type" }]}>
            <Select
              options={transactionTypeOptions}
              onChange={(value) => handleTransactionTypeChange(value as "capital" | "purchase" | "sale")}
              
            />
          </Form.Item>
          {renderTransactionForm()}
          <Flex align="center" justify="space-between" style={{ padding: "16px 16px 0px 16px" }}>
            <Button onClick={onDrawerClose}>Cancel</Button>
            <Button onClick={handleSave} type="primary">
              Save
            </Button>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};