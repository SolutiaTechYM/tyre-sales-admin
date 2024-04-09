import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { CreateButton, List } from "@refinedev/antd";
import { PropsWithChildren, useState } from "react";
import { useLocation } from "react-router-dom";
import { SupplierListTable } from "../../components/supplier";

export const SupplierList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();

  const t = useTranslate();

  return (
    <List
      breadcrumb={false}
      headerButtons={(props) => [
        <CreateButton
          {...props.createButtonProps}
          key="create"
          size="large"
          onClick={() => {
            return go({
              to: `${createUrl("suppliers")}`,
              query: {
                to: pathname,
              },
              options: {
                keepQuery: true,
              },
              type: "replace",
            });
          }}
        >
          {t("suppliers.actions.add")}
        </CreateButton>,
      ]}
    >
      <SupplierListTable />
      {children}
    </List>
  );
};
