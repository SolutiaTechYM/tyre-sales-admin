import { SaveButton, useDrawerForm } from "@refinedev/antd";
import { Alert } from "antd";
import {
  BaseKey,
  useApiUrl,
  useGetToPath,
  useGo,
  useTranslate,
} from "@refinedev/core";
import { notification } from "antd";
import { useEffect, useState } from "react";
import { AutoComplete } from "antd";
import { getValueFromEvent, useSelect } from "@refinedev/antd";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Grid,
  Button,
  Flex,
  Avatar,
  Segmented,
  Spin,
} from "antd";
import { IProduct, ICategory, RowDatasale, IPurchase, ISupplier, ISales, ICustomer, IStock } from "../../../interfaces";
import { useSearchParams } from "react-router-dom";
import { Drawer } from "../../drawer";
import { UploadOutlined } from "@ant-design/icons";
import { useStyles } from "./styled";
import { SaleDetailsEditableTable } from "../details-table copy";
import { ProductStock } from "../../product/stock";

type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const SaleDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();
  const { styles, theme } = useStyles();
  const [tableData, setTableData] = useState<RowDatasale[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [totalPrice, settotalPrice] = useState(0);
  const [stockunitprice, setstockunitprice] = useState(12345);
  // const [selectedproductid, setselectedproductid] = useState<number | undefined>();
  const [selectedstockid, setselectedstockid] = useState<number | undefined>();


  const [stockdata, setstockdata] = useState<IStock[]>([]);

  const [selectedProductStocks, setSelectedProductStocks] = useState<{ [key: number]: IStock[] }>({});
  // const [selectedProductStocks, setSelectedProductStocks] = useState({});
  // const [fetchedProductIds, setFetchedProductIds] = useState([]);

  const [selectedproductid, setselectedproductid] = useState<number | undefined>(undefined);
  const [fetchedProductIds, setFetchedProductIds] = useState<number[]>([]);

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<ISales>({
      resource: "sales",
      id: props?.id, // when undefined, id will be read from the URL.
      action: props.action,
      redirect: false,
      // onMutationSuccess: () => {
      //   props.onMutationSuccess?.();
      // },
    });
  const quantity = Form.useWatch("quantity", formProps.form);
  const unitPrice = Form.useWatch("unitprice", formProps.form);
  // useEffect(() => {
  //   const totalPrice = quantity * unitPrice || 0;
  //   formProps.form.setFieldsValue({ totalprice: totalPrice });
  // }, [quantity, unitPrice, formProps.form]);

  const { selectProps: supplierSelectProps } = useSelect<ICustomer>({
    resource: "customers",
    optionLabel: "name", // Add this line
  });
  const { selectProps: productSelectProps } = useSelect<IProduct>({
    resource: "products",
    optionLabel: "name", // Add this line
    optionValue: "id", // Add this line
  });

  useEffect(() => {
    if (selectedproductid && !fetchedProductIds.includes(selectedproductid)) {
      fetchStockData(selectedproductid);
      setFetchedProductIds((prevIds) => [...prevIds, selectedproductid]);
    }
  }, [selectedproductid, fetchedProductIds]);


  const fetchStockData = async (productid: number) => {
    try {
      const response = await fetch(`${apiUrl}/products/${productid}`, {
        method: "GET",
      });

      const data = await response.json();
      const jsonStockData = data['stocks'];

      // Store the stock data for the selected product
      setSelectedProductStocks((prevStocks) => ({
        ...prevStocks,
        [productid]: jsonStockData,
      }));
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  // console.log(stockdata);

  const getStockOptionsForProduct = (productId: number) => {
    const stocksForProduct = selectedProductStocks[productId] || [];
    const filteredStocks = stocksForProduct.filter(stock => stock.quantity > 0);
    return filteredStocks.map((stock: IStock) => ({
      label: `${stock.quantity} units - ${stock.unitBuyPrice}`,
      value: stock.id,
      unitPrice: stock.unitBuyPrice,
    }));
  };


  // const flattenedStockOptions = stockOptions.flat();

  // const { selectProps: stockSelectProps } = useSelect({
  //   options: flattenedStockOptions,

  // });

  useEffect(() => {
    console.log(tableData.length);
    if (tableData.length === 0) {
      settotalPrice(0);
    } else {
      let temp = 0;
      tableData.forEach((product) => {
        temp += product.totalPrice;
      });
      settotalPrice(temp);
    }
  }, [tableData]);
  const onDrawerCLose = () => {
    close();

    if (props?.onClose) {
      props.onClose();
      return;
    }

    go({
      to:
        searchParams.get("to") ??
        getToPath({
          action: "list",
        }) ??
        "",
      query: {
        to: undefined,
      },
      options: {
        keepQuery: true,
      },
      type: "replace",
    });
  };

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

  const showErrorNotification = () => {
    notification.error({
      message: "Error",
      description: "Please fill in all required fields.",
      duration: 3,
      style: {
        zIndex: 1000,
      },
    });
  };
  const showError = (error: any) => {
    notification.error({
      message: "Error",
      description: error,
      duration: 3,
      style: {
        zIndex: 1000,
      },
    });
  };
  const chooseacustomer = () => {
    notification.error({
      message: "Error",
      description: "Please select a Customer",
      duration: 3,
      style: {
        zIndex: 1000,
      },
    });
  };

  const showErrorNotificationEmptyTable = () => {
    notification.error({
      message: "Error",
      description: "No Products has been added.",
      duration: 3,
      style: {
        zIndex: 1000,
      },
    });
  };



  const handleAddToTable = () => {
    if (
      selectedproductid &&
      formProps.form.getFieldValue("quantity") &&
      formProps.form.getFieldValue("unitsellingprice") &&
      selectedstockid
    ) {
      const selectedProduct = (productSelectProps.options || []).find(
        (option) => option.value === formProps.form.getFieldValue("proname")
      );
      const selectedStock = selectedProductStocks[selectedproductid].find(
        (stock: IStock) => stock.id === selectedstockid
      );

      const enteredQuantity = formProps.form.getFieldValue("quantity");
      const enteredUnitSellPrice = formProps.form.getFieldValue("unitsellingprice");

      // Check if entered quantity is less than or equal to the stock quantity
      if (enteredQuantity > (selectedStock?.quantity ?? 0)) {
        notification.error({
          message: "Error",
          description: "Entered quantity must be less than or equal to the stock quantity.",
          duration: 3,
          style: {
            zIndex: 1000,
          },
        });
        return;
      }

      // Check if entered unit selling price is greater than the unit buying price
      if (enteredUnitSellPrice <= (selectedStock?.unitBuyPrice ?? 0)) {
        notification.error({
          message: "Error",
          description: "Unit selling price must be greater than the unit buying price.",
          duration: 3,
          style: {
            zIndex: 1000,
          },
        });
        return;
      }

      const newRow = {
        name: selectedProduct?.label?.toString() || "",
        productID: selectedproductid,
        stockID: selectedstockid,
        unitBuyPrice: selectedStock?.unitBuyPrice || 0,
        quantity: enteredQuantity,
        unitSellPrice: enteredUnitSellPrice,
        totalPrice: enteredUnitSellPrice * enteredQuantity,
      };

      // Update the selected stock quantity
      const updatedStocks = selectedProductStocks[selectedproductid].map(
        (stock) => {
          if (stock.id === selectedstockid) {
            return {
              ...stock,
              quantity: stock.quantity - enteredQuantity,
            };
          }
          return stock;
        }
      );

      setSelectedProductStocks((prevStocks) => ({
        ...prevStocks,
        [selectedproductid]: updatedStocks,
      }));

      setTableData([...tableData, newRow]);

      formProps.form.setFieldsValue({
        proname: "",
        unitsellingprice: "",
        stockid: "",
        unitprice: "",
        quantity: "",
      });
      setselectedstockid(undefined);
    } else {
      showErrorNotification();
    }
  };

  const handleRemoveFromTable = (rowIndex: number) => {
    const removedRow = tableData[rowIndex];
    const updatedTableData = [...tableData];
    updatedTableData.splice(rowIndex, 1);
    setTableData(updatedTableData);

    // Update the selected stock quantity
    const updatedStocks = selectedProductStocks[removedRow.productID].map(
      (stock: IStock) => {
        if (stock.id === removedRow.stockID) {
          return {
            ...stock,
            quantity: stock.quantity + removedRow.quantity,
          };
        }
        return stock;
      }
    );

    setSelectedProductStocks((prevStocks) => ({
      ...prevStocks,
      [removedRow.productID]: updatedStocks,
    }));
  };





  const images = Form.useWatch("images", formProps.form);
  const image = images?.[0] || null;
  const previewImageURL = image?.url || image?.response?.url;
  const title = props.action === "edit" ? null : t("Add new Sales");

  return (
    <Drawer
      {...drawerProps}
      open={true}
      title={title}
      width={breakpoint.sm ? "1134px" : "100%"}
      zIndex={1001}
      onClose={onDrawerCLose}
    >
      <Spin spinning={formLoading}>
        <Form {...formProps} layout="vertical">
          <Flex vertical>
            <Form.Item
              label={t("Customer")}
              name="customername"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select {...supplierSelectProps} />
            </Form.Item>

            <Form.Item
              label={t("purchases.fields.note")}
              name="description"
              className={styles.formItem}
            >
              <Input.TextArea rows={2} />
            </Form.Item>

            <Form.Item
              label={t("Grand Total")}
              // name="totalPrice"
              className={styles.formItem}
            >
              <InputNumber
                style={{ width: "150px", color: "red" }}
                disabled
                value={totalPrice}
                decimalSeparator="."
                precision={2}
              />
            </Form.Item>
            <Form.Item
              label={t("Payment")}
              name="payment"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber
                step="any"
                onKeyPress={(e) => {
                  if (e.key === '-') {
                    e.preventDefault();
                  }
                }} style={{ width: "150px" }} />
            </Form.Item>

            {/* <Form.Item name="add" className={styles.formItem}>
              <Button
                type="primary"
                onClick={() => {
                  if (formProps.form.getFieldValue("suppliername")) {
                    setShowModal(true);
                  } else {
                    chooseasupplier();
                  }
                }}
              >
                Choose Products
              </Button>
            </Form.Item> */}

            <Flex
              vertical
              gap={1}
              style={{
                padding: "32px",
              }}
            >
              <Flex justify="space-between" style={{ marginBottom: '15px' }}>
                <h3 style={{ marginBottom: '20px' }}>Add Products to Sale</h3>
                <Button
                  type="primary"
                  onClick={() => {
                    setShowModal(!showModal);
                  }}
                >
                  Choose Products
                </Button>

              </Flex>

              {showModal && (
                <Flex gap={25} style={{ marginBottom: '15px', flexWrap: 'wrap' }} >
                  <Form.Item
                    label={t("purchases.fields.details.name")}
                    name="proname"
                    style={{ minWidth: '150px' }}
                    className={styles.subFormItem}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select {...productSelectProps} onChange={(value) => setselectedproductid(value as unknown as number)} />
                  </Form.Item>
                  <Form.Item
                    label={t("Stock")}
                    name="stockid"
                    style={{ minWidth: '250px' }}
                    className={styles.subFormItem}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      options={selectedproductid ? getStockOptionsForProduct(selectedproductid) : []}
                      onChange={(value) => setselectedstockid(value as unknown as number)}
                    />
                  </Form.Item>
                  <Form.Item
                    label={t("purchases.fields.details.qty")}
                    name="quantity"
                    className={styles.subFormItem}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <InputNumber style={{ width: "150px" }} />
                  </Form.Item>

                  <Form.Item
                    label={t("Unit Buying Price")}
                    className={styles.subFormItem}
                  >
                    {selectedstockid && selectedProductStocks[selectedproductid!]?.length > 0 ? (
                      <InputNumber
                        type="number"
                        step={0.01}
                        style={{ width: "150px", color: "orange" }}
                        value={
                          selectedProductStocks[selectedproductid!].find(
                            (stock: IStock) => stock.id === selectedstockid
                          )?.unitBuyPrice || 0
                        }
                        disabled
                      />
                    ) : (
                      <InputNumber type="number" style={{ width: "150px" }} disabled />
                    )}
                  </Form.Item>


                  <Form.Item
                    label={t("Unit Selling Price")}
                    name="unitsellingprice"
                    className={styles.subFormItem}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <InputNumber type="number"
                      step="any"
                      onKeyPress={(e) => {
                        if (e.key === '-') {
                          e.preventDefault();
                        }
                      }}
                      style={{ width: "150px" }} />
                  </Form.Item>
                  {/* <Form.Item label={' '} name="add">
      <Button
        onClick={() => {
          // Check if all fields are not empty
          if (
            formProps.form.getFieldValue("proname") &&
            formProps.form.getFieldValue("quantity") &&
            formProps.form.getFieldValue("unitsellingprice")&&
            formProps.form.getFieldValue("stockid")

          ) {
            const selectedProduct = (productSelectProps.options || []).find(
              (option) => option.value === formProps.form.getFieldValue("proname")
            );
            const selectedStock = (stockSelectProps.options || []).find(
              (option) => option.value === formProps.form.getFieldValue("stockid")
            );

            const newRow = {
              name: selectedProduct?.label?.toString() || "",
              productID: selectedProduct?.value || "",
              stockID: selectedStock?.label?.toString() || "",
              unitBuyingPrice: selectedStock?.value || "",
              quantity: formProps.form.getFieldValue("quantity"),
              unitSellingPrice: formProps.form.getFieldValue("unitsellingprice"),
              totalPrice: formProps.form.getFieldValue("unitsellingprice") * formProps.form.getFieldValue("quantity"),
            };
            setTableData([...tableData, newRow]);

            formProps.form.setFieldsValue({
              proname: "",
              unitsellingprice: "",
              stockid:"",
              unitprice: "",
              quantity:""
            });
          } else {
            showErrorNotification();
          }
        }}
      >
        Add
      </Button>
    </Form.Item> */}

                  <Form.Item label={' '} name="add">
                    <Button
                      onClick={handleAddToTable}
                    >
                      Add
                    </Button>
                  </Form.Item>
                </Flex>
              )}

              <SaleDetailsEditableTable
                data={tableData}
                setData={setTableData}
                onRemove={handleRemoveFromTable}
              />
            </Flex>

            <Flex
              align="center"
              justify="space-between"
              style={{
                padding: "16px 16px 0px 16px",
              }}
            >
              <Button onClick={onDrawerCLose}>Cancel</Button>
              <SaveButton
                // {...saveButtonProps}
                // htmlType="submit"
                type="primary"
                icon={null}
                onClick={async () => {
                  console.log(tableData.length);

                  if (tableData.length !== 0) {
                    try {
                      const payment = formProps.form.getFieldValue("payment");
                      const customer = formProps.form.getFieldValue("customername");
                      const description = formProps.form.getFieldValue("description");

                      if (!customer) {
                        chooseacustomer();
                        return;
                      }
                      if (payment > -1) {
                        const customerId =
                          formProps.form.getFieldValue("customername");
                        const response = await fetch(`${apiUrl}/sales`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            salesDetails: tableData,
                            customerId,
                            payment,
                            totalPrice,
                            description
                          }),
                        });

                        if (response.ok) {
                          // Handle successful response
                          console.log("Purchase details saved successfully");
                          showsuccessNotification("Purchase details saved successfully");
                          formProps.form.resetFields();
                          setTableData([]);
                          settotalPrice(0);
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

                          // onDrawerCLose(); // Close the drawer

                        } else {
                          // Handle error response
                          console.error("Failed to save purchase details");
                          showError("Failed to save purchase details");
                        }
                      } else {
                        showError("Please Enter Payment Amount");
                      }
                    } catch (error) {
                      console.error("An error occurred:", error);
                    }
                  } else {
                    showErrorNotificationEmptyTable();
                  }
                }}
              >
                Save
              </SaveButton>
            </Flex>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
