import { SaveButton, useDrawerForm } from "@refinedev/antd";
import { BaseKey, useApiUrl, useGetToPath, useGo, useList, useTranslate, useCustomMutation } from "@refinedev/core";
import { getValueFromEvent, useSelect } from "@refinedev/antd";
import { useForm } from "antd/lib/form/Form";
import { Form, Input, Select, Table, Button, Flex, Spin } from "antd";
import { ITransaction, ICustomerOrSupplier, ITransactionDetail, ISupplier, ICustomer, IPurchase, ISalesShow } from "../../../interfaces";
import { useSearchParams } from "react-router-dom";
import { Drawer } from "../../drawer";
import { useState, useEffect } from "react";
import { Empty } from 'antd';
import { log } from "console";
import { httpClient } from "@refinedev/simple-rest";

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
    resource: "payments",
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
  const [selectedsellerid, setselectedsellerid] = useState();

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

  const { data: sellData, isLoading: isSellLoading } = useList<ISalesShow>({
    resource: "sales",
  });

  const { data: purchaseData, isLoading: isPurchaseLoading } = useList<IPurchase>({
    resource: "purchases",
  });

  const [filteredSellData, setFilteredSellData] = useState<ISalesShow[]>([]);
  const [filteredPurchaseData, setFilteredPurchaseData] = useState<IPurchase[]>([]);

  const { mutate: fetchSalesByCustomer } = useCustomMutation();
  const { mutate: fetchPurchasesBySupplier } = useCustomMutation();

  const fetchSales = async (customerId: number) => {
    const { data } = await httpClient.get(`/sales/:customer_id=${customerId}`);
    setFilteredSellData(data);
  };

  const fetchPurchases = async (supplierId: number) => {
    const { data } = await httpClient.get(`/purchases/:supplier_id=${supplierId}`);
    setFilteredPurchaseData(data);
  };

  useEffect(() => {
    if (selectedcustomerid) {
      fetchSales(selectedcustomerid);
      console.log(filteredSellData);
      
    } else {
      setFilteredSellData([]);
    }
  }, [selectedcustomerid]);

  useEffect(() => {
    if (form.getFieldValue("supplierId")) {
      fetchPurchases(form.getFieldValue("supplierId"));
    } else {
      setFilteredPurchaseData([]);
    }
  }, [form.getFieldValue("supplierId")]);

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
              <Select
                {...customerSelectProps}
                onChange={(value) => {
                  if(selectedcustomerid){
                  setselectedcustomerid(value as unknown as number);
                  console.log(selectedcustomerid);
                  fetchSales(selectedcustomerid)}
                  
                  // fetchSalesByCustomer({ resource: "sales", values: { customer_id: value } })
                  //   .then(({ data }) => setFilteredSellData(data))
                  //   .catch((error) => console.error(error));
                }}
              />
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
              <Select
                {...supplierSelectProps}
                onChange={(value) => {
                  form.setFieldValue("supplierId", value);
                  fetchPurchasesBySupplier({ resource: "purchases", values: { supplier_id: value } })
                    .then(({ data }) => setFilteredPurchaseData(data))
                    .catch((error) => console.error(error));
                }}
              />
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