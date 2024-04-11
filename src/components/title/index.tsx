import { useLink } from "@refinedev/core";
import { Space, theme } from "antd";

import { TyreLogoIcon, TyreLogoText } from "../../components";
import { Logo } from "./styled";

type TitleProps = {
  collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { token } = theme.useToken();
  const Link = useLink();

  return (
    <Logo>
      <Link to="/">
        {collapsed ? (
          <TyreLogoIcon />
        ) : (
          <Space size={12}>
            <TyreLogoIcon
              style={{
                fontSize: "32px",
                color: token.colorTextHeading,
              }}
            />
            <TyreLogoText
              style={{
                color: token.colorTextHeading,
                width: "100%",
                height: "auto",
              }}
            />
          </Space>
        )}
      </Link>
    </Logo>
  );
};
