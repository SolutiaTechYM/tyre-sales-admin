import {
  BaseKey,
  HttpError,
  useGetToPath,
  useGo,
  useModal,
  useNavigation,
  useOne,
  useShow,
  useTranslate,
  useDelete,
} from "@refinedev/core";
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Grid,
  List,
  Modal,
  Table,
  Typography,
  theme,
  message,
} from "antd";
import {  TableColumnsType } from "antd";

import { useSearchParams } from "react-router-dom";
import { Drawer } from "../../drawer";
import { ICategory, IProduct, IPurchase,IPurchaseProductshow } from "../../../interfaces";
import { DeleteButton, NumberField } from "@refinedev/antd";
import { PurchaseStatus } from "../status";
import { DeleteOutlined, EditOutlined, FilePdfOutlined } from "@ant-design/icons";
import { PurchaseDetailsTable } from "../details-table";
import { PdfLayout } from "../../../pages/purchases/PdfLayout";
import { useState } from "react";
import { ColumnsType } from "antd/es/table";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

export const PurchaseDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();
  const [record, setRecord] = useState<IPurchase>();

  const { show, visible, close } = useModal();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const { mutate: deletePurchase } = useDelete();

  const { queryResult } = useShow<IPurchase, HttpError>({
    resource: "purchases",
    id: props?.id,
  });
  const purchase = queryResult.data?.data;

  const handleDrawerClose = () => {
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

  const handleDeleteConfirm = () => {
    if (purchase?.id) {
      deletePurchase(
        {
          resource: "purchases",
          id: purchase.id,
        },
        {
          onSuccess: () => {
            setDeleteModalVisible(false);
            handleDrawerClose();
            message.success("Purchase deleted successfully");
          },
          onError: (error) => {
            setDeleteModalVisible(false);
            message.error("Error deleting purchase: " + error.message);
          },
        }
      );
    } else {
      message.error("Cannot delete purchase: Invalid ID");
      setDeleteModalVisible(false);
    }
  };

  // const columns = [
  //   // {
  //   //   title: '',
  //   //   dataIndex: 'productID',
  //   //   key: 'productID',
  //   // },
  //   {
  //     title: 'Product Code',
  //     dataIndex: 'productCode',
  //     key: 'productCode',
  //   },
  //   {
  //     title: 'Category / Product Name',
  //     dataIndex: 'categoryName', 
  //     key: 'categoryName',
  //     render: (categoryName: string, record: IPurchaseProductshow) => (
  //       `${categoryName} - ${record.productName}`
  //     ),
  //   },
  //   {
  //     title: 'Unit Price',
  //     dataIndex: 'unitPrice',
      
  //     key: 'unitPrice',
  //     align: "right",
  //     render: (value: number) => <NumberField value={value} options={{
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     }} />,
  //   },
  //   {
  //     title: 'Quantity',
  //     dataIndex: 'quantity',
  //     key: 'quantity',
  //   },
  //   {
  //     title: 'Total',
  //     dataIndex: 'totalPrice',
  //     key: 'totalPrice',
  //     render: (value: number) => <NumberField value={value} options={{
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     }} />,
  //   },
  // ];



  const columns: ColumnsType<IPurchaseProductshow> = [
    {
      title: "Product Code",
      dataIndex: "productCode",
      key: "productCode",
    },
    {
      title: "Category / Product Name",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (categoryName: string, record: IPurchaseProductshow) => (
        `${categoryName} - ${record.productName}`
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      align: "right", 
      render: (value: number) => (
        <NumberField
          value={value}
          style={{
            fontWeight: 'bold'}}
          options={{
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }}
        />
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "right", 
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "right", 

      render: (value: number) => (
        <NumberField
          value={value}
          options={{
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }}
        />
      ),
    },
  ];
  
  return (
    <>
      <Drawer
        open={true}
        width={breakpoint.sm ? "1134px" : "100%"}
        zIndex={1001}
        onClose={handleDrawerClose}
        
      >
        <Flex
          vertical
          style={{
            backgroundColor: token.colorBgContainer,
          }}
        >
          <Flex style={{ padding: "16px", justifyContent: "space-between" }}>
            <Flex vertical>
              <Typography.Title level={5}>
                Purchase Code : {purchase?.code}
              </Typography.Title>
              <Typography.Text type="secondary">
                {purchase?.note}
              </Typography.Text>
              <Typography.Text>
                Due Amount:{" "}
                {purchase?.due_amount !== undefined ? (
                  purchase.due_amount < 0 ? (
                    <span
                      style={{
                        color: "lightgreen",
                        fontVariantNumeric: "tabular-nums",
                        whiteSpace: "nowrap",
                      }}
                    >
                      C{" "}
                      {Math.abs(purchase.due_amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  ) : purchase.due_amount > 0 ? (
                    <span
                      style={{
                        color: "red",
                        fontVariantNumeric: "tabular-nums",
                        whiteSpace: "nowrap",
                      }}
                    >
                      D{" "}
                      {purchase.due_amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  ) : (
                    "-"
                  )
                ) : (
                  <NumberField value={0} options={{ style: "currency", currency: "USD" }} />
                )}
              </Typography.Text>
              <Typography.Text>
                Total Price:{" "}
                <NumberField
                  value={purchase?.totalAmount || 0}
                  options={{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }}
                  style={{
                    fontWeight: "bold"
                  }}
                />
              </Typography.Text>
            </Flex >
            <Flex vertical>
              <Typography.Title level={5} style={{ color: "green" }}>
                Print Invoice
              </Typography.Title>

              <Button
                style={{ alignSelf: "center", borderColor: "green" }}
                size="large"
                icon={<FilePdfOutlined style={{ color: "green" }} />}
                onClick={() => {
                  setRecord(purchase);
                  show();
                }}
              />
            </Flex>
          </Flex>
          <Divider
            style={{
              margin: 0,
              padding: 0,
            }}
          />
          <Flex
            vertical
            gap={32}
            style={{
              padding: "32px",
            }}
          >
            <Table dataSource={purchase?.purchaseDetails} columns={columns} />
            <Flex style={{ justifyContent: "flex-end" }}>
              <Button
                style={{ alignSelf: "center", borderColor: "red" }}
                size="large"
                icon={<DeleteOutlined style={{ color: "red" }} />}
                onClick={() => setDeleteModalVisible(true)}
              >
                Delete Purchase
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Drawer>

      <Modal visible={visible} onCancel={close} width="80%" footer={null} zIndex={99999999}>
        <PdfLayout record={record} />
      </Modal>

      <Modal
        title="Confirm Delete"
        visible={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
        zIndex={2147483647} 
      >
        <p>Are you sure you want to delete this purchase?</p>
      </Modal>
    </>
  );
};