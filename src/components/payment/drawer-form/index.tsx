import { useDrawerForm } from "@refinedev/antd";
import { BaseKey, useApiUrl, useGetToPath, useGo, useTranslate } from "@refinedev/core";
import { useSelect } from "@refinedev/antd";
import { useForm } from "antd/lib/form/Form";
import { Form, Input, Select, Table, Button, Flex, Spin, message } from "antd";
import { ITransaction, ISupplier, ICustomer, IPaymentTable } from "../../../interfaces";
import { useSearchParams } from "react-router-dom";
import { Drawer } from "../../drawer";
import { useState, useEffect } from "react";
import { Empty } from 'antd';

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

  const [selectedTransactionType, setSelectedTransactionType] = useState<"capital" | "purchase" | "sell" | undefined>(undefined);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | undefined>();
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | undefined>();
  const [capitalAmount, setCapitalAmount] = useState<number | undefined>();
  const [sellPayments, setSellPayments] = useState<{ [id: string]: number }>({});
  const [purchasePayments, setPurchasePayments] = useState<{ [id: string]: number }>({});

  const { selectProps: supplierSelectProps } = useSelect<ISupplier>({
    resource: "suppliers",
    optionValue: "id",
    optionLabel: "name",
  });

  const { selectProps: customerSelectProps } = useSelect<ICustomer>({
    resource: "customers",
    optionValue: "id",
    optionLabel: "name",
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
      console.error('Error fetching sell data:', error);
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
    { label: "Sell", value: "sell" },
  ];

  const handleTransactionTypeChange = (value: "capital" | "purchase" | "sell") => {
    setSelectedTransactionType(value);
    // setCapitalAmount(undefined);
    setSellPayments({});
    setPurchasePayments({});
  };
  
  const renderTransactionForm = () => {
    switch (selectedTransactionType) {
      case "capital":
        return (
          <Form.Item name="amount" label="Amount" rules={[{ required: true, message: "Please enter an amount" }]}>
            <Input type="number" onChange={(e) => setCapitalAmount(parseFloat(e.target.value))} />
          </Form.Item>
        );
      case "sell":
        return (
          <>
            <Form.Item name="customerId" label="Customer" rules={[{ required: true, message: "Please select a customer" }]}>
              <Select {...customerSelectProps} onChange={(value) => setSelectedCustomerId(value as unknown as number)} />
            </Form.Item>
            <Form.Item>
              {filteredSellData.length > 0 ? (
                <Table
                  dataSource={filteredSellData.map(item => ({
                    id: item.id,
                    dueAmount: item.dueAmount,
                    value: item.value,
                    date: item.date,
                    description: item.description,
                    payment: sellPayments[item.id] || 0,
                  }))}
                  rowKey="id"
                  bordered
                  pagination={false}
                >
                  <Table.Column title="ID" dataIndex="id" key="id" />
                  <Table.Column title="Description" dataIndex="description" key="description" />
                  <Table.Column title="Date" dataIndex="date" key="date" />
                  <Table.Column title="Total Price" dataIndex="value" key="value" />
                  <Table.Column title="Due Amount" dataIndex="dueAmount" key="dueAmount" />
                  <Table.Column
                    title="Payment"
                    dataIndex="payment"
                    key="payment"
                    render={(value, record: { id: BaseKey; payment: number }) => (
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) => setSellPayments({ ...sellPayments, [record.id]: parseFloat(e.target.value) })}
                      />
                    )}
                  />
                </Table>
              ) : (
                <Empty description="No sell data available" />
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
                  dataSource={filteredPurchaseData.map(item => ({
                    id: item.id,
                    dueAmount: item.dueAmount,
                    value: item.value,
                    date: item.date,
                    description: item.description,
                    payment: purchasePayments[item.id] || 0,
                  }))}
                  rowKey="id"
                  bordered
                  pagination={false}
                >
                  <Table.Column title="ID" dataIndex="id" key="id" />
                  <Table.Column title="Description" dataIndex="description" key="description" />
                  <Table.Column title="Date" dataIndex="date" key="date" />
                  <Table.Column title="Total Price" dataIndex="value" key="value" />
                  <Table.Column title="Due Amount" dataIndex="dueAmount" key="dueAmount" />
                  <Table.Column
                    title="Payment"
                    dataIndex="payment"
                    key="payment"
                    render={(value, record: { id: BaseKey; payment: number }) => (
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) => setPurchasePayments({ ...purchasePayments, [record.id]: parseFloat(e.target.value) })}
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
            message.error("Please enter an amount for capital transaction");
            return;
          }
          // Make a POST request to save the capital transaction
          const capitalResponse = await fetch(`${apiUrl}/transactions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "capital",
              amount: capitalAmount,
            }),
          });
          if (!capitalResponse.ok) {
            throw new Error("Failed to save capital transaction");
          }
          console.log("Capital transaction saved successfully");
          onDrawerClose();

          break;
        case "sell":
          const hasNonZeroSellPayment = Object.values(sellPayments).some(
            (payment) => payment > 0
          );
          if (!selectedCustomerId || !hasNonZeroSellPayment) {
            message.error(
              "Please select a customer and enter at least one payment for the sell transaction"
            );
            return;
          }
          // Make a POST request to save the sell transaction
          const sellResponse = await fetch(`${apiUrl}/transactions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "sell",
              customerId: selectedCustomerId,
              payments: sellPayments,
            }),
          });
          if (!sellResponse.ok) {
            throw new Error("Failed to save sell transaction");
          }
          console.log("Sell transaction saved successfully");
          onDrawerClose();

          break;
        case "purchase":
          const hasNonZeroPurchasePayment = Object.values(purchasePayments).some(
            (payment) => payment > 0
          );
          if (!selectedSupplierId || !hasNonZeroPurchasePayment) {
            message.error(
              "Please select a supplier and enter at least one payment for the purchase transaction"
            );
            return;
          }
          // Make a POST request to save the purchase transaction
          const purchaseResponse = await fetch(`${apiUrl}/transactions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "purchase",
              supplierId: selectedSupplierId,
              payments: purchasePayments,
            }),
          });
          if (!purchaseResponse.ok) {
            throw new Error("Failed to save purchase transaction");
          }
          console.log("Purchase transaction saved successfully");
          onDrawerClose();
          break;
        default:
          return;
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  return (
    <Drawer {...drawerProps} open={true} title={title} width="500px" zIndex={1001} onClose={onDrawerClose}>
      <Spin spinning={formLoading}>
        <Form {...formProps} layout="vertical">
          <Form.Item name="type" label="Transaction Type" rules={[{ required: true, message: "Please select a transaction type" }]}>
            <Select
              options={transactionTypeOptions}
              onChange={(value) => handleTransactionTypeChange(value as "capital" | "purchase" | "sell")}
              
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