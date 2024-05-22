import { SaveButton, useDrawerForm } from "@refinedev/antd";
import {
  BaseKey,
  useApiUrl,
  useGetToPath,
  useGo,
  useTranslate,
} from "@refinedev/core";
import InputMask from "react-input-mask";

import { getValueFromEvent, useSelect } from "@refinedev/antd";
import { useForm } from "antd/lib/form/Form";
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
  DatePicker,
} from "antd";
import {  ITransaction, ICategory, ICustomer } from "../../../interfaces";
import { useSearchParams } from "react-router-dom";
import { Drawer } from "../../drawer";
import { UploadOutlined } from "@ant-design/icons";
import { useStyles } from "./styled";

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
  const breakpoint = Grid.useBreakpoint();
  const { styles, theme } = useStyles();

  const [form] = useForm();
  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<ITransaction>({
      resource: "payments",
      id: props?.id, // when undefined, id will be read from the URL.
      action: props.action,
      redirect: false,
      onMutationSuccess: () => {
        console.log("Form data:", form.getFieldsValue());
        props.onMutationSuccess?.();
      },
      // form,
    });

  const { selectProps: categorySelectProps } = useSelect<ICustomer>({
    resource: "users",
  });

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


  
  const title = props.action === "edit" ? null : t("Add Capital");

  return (
    <Drawer
      {...drawerProps}
      open={true}
      title={title}
      width={breakpoint.sm ? "378px" : "100%"}
      zIndex={1001}
      onClose={onDrawerCLose}
    >
      <Spin spinning={formLoading}>
        <Form {...formProps} layout="vertical">

          <Flex vertical>
            <Form.Item
              label={t("Date")}
              name="date"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="please enter name " type="date"/>
            </Form.Item>
            <Form.Item
              label={t("Type")}
              name="type"
              className={styles.formItem}
              initialValue={"Capital"}
           
            >
               <Input  disabled/>
               
           {/* <InputMask mask="(999) 999 99 99"> */}
            {/* 
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore */}
            {/* {(props: InputProps) => (
              <Input
                {...props}
                placeholder="please enter Phone number"
              />
            )}
          </InputMask> */}

            </Form.Item>

            <Form.Item
              label={t("Value")}
              name="value"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
         <InputNumber prefix={"LKR"} style={{ width: "150px" }} type="number"/>
            </Form.Item>

            {/* <Form.Item
              label={t("Company")}
              name="Company"
              className={styles.formItem}
             rules={[
                {
                  required: true,
                },
              ]}
            >
            <Input
   
              placeholder="optional"
            />
            </Form.Item> */}


            {/* <Form.Item
              label={t("createdAt")}
              name="createdAt"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
             <DatePicker style={{ width: "100%" }} />
            </Form.Item> */}

            {/* <Form.Item
              label={t("products.fields.category")}
              name={["category", "id"]}
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select {...categorySelectProps} />
            </Form.Item> */}
         
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
