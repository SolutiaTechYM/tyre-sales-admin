

import {
  useShow,
  IResourceComponentsProps,
  useNavigation,
} from "@refinedev/core";
import { Flex, Grid } from "antd";
import { ICustomer, ISupplier } from "../../interfaces";
import {

  Drawer,
} from "../../components";
import { SupplierInfoSummary } from "../../components/supplier/infoSummary";
import { SupplierInfoList } from "../../components/supplier/infoList";
import { SupplierOrderHistory } from "../../components/supplier/orderHistory";
// import { SupplierOrderHistory } from "../../components/supplier/orderHistory";

export const SupplierShow: React.FC<IResourceComponentsProps> = () => {
  const { list } = useNavigation();
  const breakpoint = Grid.useBreakpoint();
  const { queryResult } = useShow<ISupplier>();

  const { data } = queryResult;
  const user = data?.data;
console.log(user);
console.log(user);

  return (
    <Drawer
      open
      onClose={() => list("suppliers")}
      width={breakpoint.sm ? "736px" : "100%"}
    >
      <Flex
        vertical
        gap={32}
        style={{
          padding: "32px",
        }}
      >
        <SupplierInfoSummary supplier={user} />
        <SupplierInfoList supplier={user} />
      {user &&  <SupplierOrderHistory supplier={user} />}
      </Flex>
    </Drawer>
  );
};
