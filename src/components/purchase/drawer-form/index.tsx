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
import { IProduct, ICategory, RowData, IPurchase } from "../../../interfaces";
import { useSearchParams } from "react-router-dom";
import { Drawer } from "../../drawer";
import { UploadOutlined } from "@ant-design/icons";
import { useStyles } from "./styled";
import { PurchaseDetailsEditableTable } from "../details-table copy";

type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const PurchaseDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();
  const { styles, theme } = useStyles();
  const [tableData, setTableData] = useState<RowData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [totalPrice, settotalPrice] = useState(0);

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<IPurchase>({
      resource: "purchases",
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

  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: "categories",
    optionLabel: "title", // Add this line
  });
  const { selectProps: productSelectProps } = useSelect<IProduct>({
    resource: "products",
    optionLabel: "name", // Add this line
  });

  useEffect(() => {
    console.log(tableData.length);
    if (tableData.length === 0) {
      settotalPrice(0);
    } else {
      var temp = 0;
      tableData.forEach((product) => {
        temp += product.quantity * product.unitprice;
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
  const chooseasupplier = () => {
    notification.error({
      message: "Error",
      description: "Please select a supplier",
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

  const images = Form.useWatch("images", formProps.form);
  const image = images?.[0] || null;
  const previewImageURL = image?.url || image?.response?.url;
  const title = props.action === "edit" ? null : t("purchases.actions.add");

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
              label={t("purchases.fields.supplier")}
              name="suppliername"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select {...categorySelectProps} />
            </Form.Item>

            <Form.Item
                    label={t("purchases.fields.note")}
                    name="description"
                    className={styles.formItem}
                  >
                    <Input.TextArea rows={2} />
                  </Form.Item>

                  <Form.Item
                      label={t("Total Price")}
                      name="totalprice"
                      className={styles.formItem}
                    >
                      <InputNumber
                        prefix={"LKR"}
                        style={{ width: "150px", color: "red" }}
                        disabled
                        value={totalPrice}
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
                      <InputNumber prefix={"LKR"} style={{ width: "150px" }} />
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
              <Flex justify="space-between" style={{marginBottom:'15px'}}>
              <h3 style={{marginBottom:'20px'}}>Add Products to Purchase</h3>
              <Button
                type="primary"
                onClick={() => {
                  setShowModal(!showModal);
                }}
              >
                Choose Products
              </Button>
              
              </Flex>
                
                  
                  {showModal && (<Flex gap={25} style={{marginBottom:'15px'}}>
                  <Form.Item
                    label={t("purchases.fields.details.name")}
                    name="proname"
                    style={{minWidth:'300px'}}
                    className={styles.subFormItem}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select {...productSelectProps} />
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
                      label={t("purchases.fields.details.unitPrice")}
                      name="unitprice"
                      className={styles.subFormItem}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <InputNumber
                        type="number"
                        prefix={"LKR"}
                        style={{ width: "150px" }}
                      />
                    </Form.Item>
                    
                    
                  <Form.Item
                    label={' '}
                    name="add"
                    // className={styles.formItem}
                  >
                    <Button
                      // {...saveButtonProps}

                      // htmlType="submit"
                      onClick={() => {
                        // Check if all fields are not empty
                        if (
                          // formProps.form.getFieldValue("suppliername") &&
                          formProps.form.getFieldValue("proname") &&
                          formProps.form.getFieldValue("quantity") &&
                          formProps.form.getFieldValue("unitprice")
                          // formProps.form.getFieldValue("totalprice") &&
                          // formProps.form.getFieldValue("payment")
                        ) {
                          const selectedCategory = (
                            categorySelectProps.options || []
                          ).find(
                            (option) =>
                              option.value ===
                              formProps.form.getFieldValue("suppliername")
                          );
                          const selectedProduct = (
                            productSelectProps.options || []
                          ).find(
                            (option) =>
                              option.value ===
                              formProps.form.getFieldValue("proname")
                          );

                          const newRow = {
                            // suppliername: selectedCategory?.label?.toString() || "",
                            product: selectedProduct?.label?.toString() || "",
                            productID: selectedProduct?.value?.toString() || "",
                            description:
                              formProps.form.getFieldValue("description"),
                            quantity: formProps.form.getFieldValue("quantity"),
                            unitprice:
                              formProps.form.getFieldValue("unitprice"),
                            // totalprice: formProps.form.getFieldValue("totalprice"),
                            // payment: formProps.form.getFieldValue("payment"),
                          };
                          setTableData([...tableData, newRow]);
                        } else {
                          // Alert or handle the case where some fields are empty
                          // For example, show a message to the user
                          // alert("Please fill in all fields.");
                          // Swal.fire({
                          //   title: 'Required Fields',
                          //   text: 'Please fill in all required fields.',
                          //   icon: 'warning',
                          //   confirmButtonText: 'OK',
                          //   zIndex: 1500, // Pass the zIndex option in the options object
                          // });
                          showErrorNotification();
                        }
                      }}
                    >
                      Add
                    </Button>
                  </Form.Item>
                  </Flex>)}

              <PurchaseDetailsEditableTable
                data={tableData}
                setData={setTableData}
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

                      if (payment) {
                        const supplierId =
                          formProps.form.getFieldValue("suppliername");
                        const response = await fetch(`${apiUrl}/purchase`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            purchaseDetails: tableData,
                            supplierId,
                            payment,
                          }),
                        });

                        if (response.ok) {
                          // Handle successful response
                          console.log("Purchase details saved successfully");
                          onDrawerCLose(); // Close the drawer
                        } else {
                          // Handle error response
                          console.error("Failed to save purchase details");
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
