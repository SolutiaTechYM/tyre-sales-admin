import {
  useShow,
  IResourceComponentsProps,
  useNavigation,
} from "@refinedev/core";
import { Flex, Grid } from "antd";
import { ICustomer } from "../../interfaces";
import {
  CustomerInfoList,
  CustomerInfoSummary,
  Drawer,
} from "../../components";
import { CustomerOrderHistory } from "../../components/customer/orderHistory";

export const CustomerShow: React.FC<IResourceComponentsProps> = () => {
  const { list } = useNavigation();
  const breakpoint = Grid.useBreakpoint();
  const { queryResult } = useShow<ICustomer>();

  const { data } = queryResult;
  const user = data?.data;

  return (
    <Drawer
      open
      onClose={() => list("customers")}
      width={breakpoint.sm ? "736px" : "100%"}
    >
      <Flex
        vertical
        gap={32}
        style={{
          padding: "32px",
        }}
      >
        <CustomerInfoSummary customer={user} />
        <CustomerInfoList customer={user} />
        {user && <CustomerOrderHistory customer={user} />}
      </Flex>
    </Drawer>
  );
};
