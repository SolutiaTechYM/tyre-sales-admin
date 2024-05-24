import { SaveButton, useDrawerForm } from "@refinedev/antd";
import { BaseKey, useApiUrl, useGetToPath, useGo, useList, useTranslate } from "@refinedev/core";
import { getValueFromEvent, useSelect } from "@refinedev/antd";
import { useForm } from "antd/lib/form/Form";
import { Form, Input, Select, Table, Button, Flex, Spin } from "antd";
import { ITransaction, ICustomerOrSupplier, ITransactionDetail, ISupplier, ICustomer, IPurchase, ISalesShow } from "../../../interfaces";
import { useSearchParams } from "react-router-dom";
import { Drawer } from "../../drawer";
import { useState, useEffect } from "react";
import { Empty } from 'antd';
import { log } from "console";


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
  const [selectedcustomerid, setselectedcustomerid] = useState<number | undefined>();

  const [selectedsupplierid, setselectedsupplierid] = useState<number | undefined>();

  const { selectProps: supplierSelectProps } = useSelect<ISupplier>({
    resource: "suppliers",
    optionValue:"id",
    optionLabel: "name",
  });

  const { selectProps: customerSelectProps } = useSelect<ICustomer>({
    resource: "users",
    optionValue:"id",
    optionLabel: "name",
  });



  const [filteredSellData, setFilteredSellData] = useState<ISalesShow[]>([]);
  const [filteredPurchaseData, setFilteredPurchaseData] = useState<IPurchase[]>([]);


  const fetchPurchaseData = async (supplierId: number) => {
    try {
      
      const response = await fetch(`${apiUrl}/transactions/purchases/${supplierId}`);
      const data = await response.json();
      setFilteredPurchaseData(data);
    } catch (error) {
      console.error('Error fetching purchase data:', error);
    }
  };

  const fetchSellData = async (customerId: number) => {
    try {

      const response = await fetch(`${apiUrl}/transactions/sales/${customerId}`, {
        method: "GET"})

      const data = await response.json();
      setFilteredSellData(data);
    } catch (error) {
      console.error('Error fetching sell data:', error);
    }
  };

  useEffect(() => {
    
    if (selectedsupplierid) {
      
      fetchPurchaseData(selectedsupplierid);
    }
  }, [selectedsupplierid]);

  useEffect(() => {
    if (selectedcustomerid) {

      fetchSellData(selectedcustomerid);
    }
  }, [selectedcustomerid]);

 

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


  const renderTransactionForm = () => {
    switch (selectedTransactionType) {
      case "capital":
        return (
          <Form.Item name="amount" label="Amount" rules={[{ required: true, message: "Please enter an amount" }]}>
            <Input type="number" />
          </Form.Item>
        );
      case "sell":
        return (
          <>
            <Form.Item name="customerId" label="Customer" rules={[{ required: true, message: "Please select a customer" }]} >
              <Select {...customerSelectProps}  onChange={(value) => setselectedcustomerid(value as unknown as number)}/>
            </Form.Item>
            <Form.Item>
              <Table
                dataSource={filteredSellData.map(item => ({
                  id: item.id,
                  dueAmount: item.due_amount,
                  payment: form.getFieldValue(`transactions.${item.id}.payment`) || 0,
                }))}
                rowKey="id"
                bordered
                pagination={false}
              >
                <Table.Column title="ID" dataIndex="id" key="id" />
                <Table.Column title="Due Amount" dataIndex="dueAmount" key="dueAmount" />
                <Table.Column
                  title="Payment"
                  dataIndex="payment"
                  key="payment"
                  render={(value, record: { id: BaseKey; dueAmount: number; payment: number }) => (
                    <Form.Item name={["transactions", record.id, "payment"]}>
                      <Input type="number" defaultValue={record.payment} />
                    </Form.Item>
                  )}
                />
              </Table>
            </Form.Item>
          </>
        );
      case "purchase":
        return (
          <>
            <Form.Item name="supplierId" label="Supplier" rules={[{ required: true, message: "Please select a supplier" }]} >
              <Select {...supplierSelectProps}  onChange={(value) => setselectedsupplierid(value as unknown as number)}/>
            </Form.Item>
            <Form.Item>
              <Table
                dataSource={filteredPurchaseData.map(item => ({
                  id: item.id,
                  dueAmount: item.due_amount,
                  payment: form.getFieldValue(`transactions.${item.id}.payment`) || 0,
                }))}
                rowKey="id"
                bordered
                pagination={false}
              >
                <Table.Column title="ID" dataIndex="id" key="id" />
                <Table.Column title="Due Amount" dataIndex="dueAmount" key="dueAmount" />
                <Table.Column
                  title="Payment"
                  dataIndex="payment"
                  key="payment"
                  render={(value, record: { id: BaseKey; dueAmount: number; payment: number }) => (
                    <Form.Item name={["transactions", record.id, "payment"]}>
                      <Input type="number" defaultValue={record.payment} />
                    </Form.Item>
                  )}
                />
              </Table>
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer {...drawerProps} open={true} title={title} width="500px" zIndex={1001} onClose={onDrawerClose}>
      <Spin spinning={formLoading}>
        <Form {...formProps} layout="vertical">
          <Form.Item name="type" label="Transaction Type" rules={[{ required: true, message: "Please select a transaction type" }]}>
            <Select
              options={transactionTypeOptions}
              onChange={(value) => setSelectedTransactionType(value as "capital" | "purchase" | "sell")}
            />
          </Form.Item>
          {renderTransactionForm()}
          <Flex align="center" justify="space-between" style={{ padding: "16px 16px 0px 16px" }}>
            <Button onClick={onDrawerClose}>Cancel</Button>
            <SaveButton {...saveButtonProps} htmlType="submit" type="primary" icon={null}>
              Save
            </SaveButton>
          </Flex>
        
        </Form>
      </Spin>
    </Drawer>
  );
};