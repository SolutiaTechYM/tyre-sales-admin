import { SaveButton, useDrawerForm } from "@refinedev/antd";
import {
  BaseKey,
  useApiUrl,
  useGetToPath,
  useGo,
  useTranslate,
} from "@refinedev/core";
import { useEffect,useState } from 'react';
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
  action: "create";
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

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<IPurchase>({
      resource: "purchases",
      id: props?.id, // when undefined, id will be read from the URL.
      action: props.action,
      redirect: false,
      onMutationSuccess: () => {
        props.onMutationSuccess?.();
      },
    });
    const quantity = Form.useWatch('quantity', formProps.form);
const unitPrice = Form.useWatch('unitprice', formProps.form);



const [tableRef, setTableRef] = useState<{ getTableData: () => RowData[] } | null>(null);

// const handleSave = async () => {
//   try {
//     // Create or update the main purchase record
//     await formProps.form.validateFields();
//     const purchaseId = props.id || (await saveButtonProps?.mutationPromise?.mutate(purchaseData));

//     onDrawerCLose();
//   } catch (error) {
//     console.error("Error saving purchase data:", error);
//   }
// };


useEffect(() => {
  const totalPrice = quantity * unitPrice || 0;
  formProps.form.setFieldsValue({ totalprice: totalPrice });
}, [quantity, unitPrice, formProps.form]);


  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: "categories",
    optionLabel: "title", // Add this line

  });
  const { selectProps: productSelectProps } = useSelect<IProduct>({
    resource: "products",
    optionLabel: "name", // Add this line
  });

  const [tableData, setTableData] = useState<RowData[]>([]);

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

  const images = Form.useWatch("images", formProps.form);
  const image = images?.[0] || null;
  const previewImageURL = image?.url || image?.response?.url;
  const title = "edit" 

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
              name="name"
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
                label={t("purchases.fields.details.name")}
                name="proname"
                className={styles.formItem}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select {...productSelectProps} />
              </Form.Item>
            <Form.Item
              label={t("purchases.fields.note")}
              name="description"
              className={styles.formItem}
              
            >
              <Input.TextArea rows={2} />
            </Form.Item>
            <Flex style={{ backgroundColor: "#141414" }}>
            
            
            
            
            <Form.Item
                label={t("purchases.fields.details.qty")}
                name="quantity"
                className={styles.formItem}
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
                className={styles.formItem}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <InputNumber type='number' prefix={"LKR"} style={{ width: "150px" }} />
              </Form.Item>
             

            
            
            
            
            
                        </Flex>
      
            <Flex style={{ backgroundColor: "#141414" }}>
              
              {/* <Form.Item
                label={t("purchases.fields.details.category")}
                name={["category", "id"]}
                className={styles.formItem}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select {...categorySelectProps} disabled />
              </Form.Item> */}
<Form.Item
  label={t("Total Price")}
  name="totalprice"
  className={styles.formItem}
  rules={[
    {
      required: true,
    },
  ]}
>
  <InputNumber  prefix={"LKR"} style={{ width: "150px",color:'red' }} disabled />
</Form.Item>
            <Form.Item
              label={t("purchases.fields.credit")}
              name="credit"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber prefix={"LKR"} style={{ width: "150px" }} />
            </Form.Item>
            </Flex>
            <Form.Item
                label={t("purchases.actions.addProduct")}
                name="add"
                className={styles.formItem}
              >
                  <Button
    onClick={() => {
      const selectedCategory = (categorySelectProps.options || []).find(
        (option) => option.value === formProps.form.getFieldValue("name")
      );
      const selectedProduct = (productSelectProps.options || []).find(
        (option) => option.value === formProps.form.getFieldValue("proname")
      );
    

  const newRow = {
    name: selectedCategory?.label?.toString() || "", 
    product: selectedProduct?.label?.toString() || "", 
        description: formProps.form.getFieldValue("description"),
        quantity: formProps.form.getFieldValue("quantity"),
        unitprice: formProps.form.getFieldValue("unitprice"),
        totalprice: formProps.form.getFieldValue("totalprice"),
        credit: formProps.form.getFieldValue("credit"),
      };
      setTableData([...tableData, newRow]);
    }}
  >Add</Button>
              </Form.Item>
            <Flex
              vertical
              gap={32}
              style={{
                padding: "32px",
              }}
            >
              <PurchaseDetailsEditableTable
  data={tableData}
  setData={setTableData}
  setTableRef={setTableRef}
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
                {...saveButtonProps}
                htmlType="submit"
                type="primary"
                // onClick={handleSave}
                icon={null}
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
