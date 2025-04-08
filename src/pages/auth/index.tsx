import { AuthPage as AntdAuthPage, AuthProps } from "@refinedev/antd";
import { Flex } from "antd";
import { Link } from "react-router-dom";
import { TyreLogoIcon, TyreLogoText } from "../../components";

const authWrapperProps = {
  style: {
    background:
      "radial-gradient(50% 50% at 50% 50%,rgba(255, 255, 255, 0) 0%,rgba(0, 0, 0, 0.5) 100%),url('images/tyre_login.jpg')",
    backgroundSize: "cover",
  },
};

const renderAuthContent = (content: React.ReactNode) => {
  return (
    <div
      style={{
        maxWidth: 408,
        margin: "auto",
      }}
    >
      <Link to="/">
        <Flex
          align="center"
          justify="center"
          gap={12}
          style={{
            marginBottom: 16,
          }}
        >
          <TyreLogoIcon
            style={{
              width: 64,
              height: 64,
              color: "#fff",
            }}
          />
          <TyreLogoText
            style={{
              color: "#fff",
              width: "300px",
              height: "auto",
            }}
          />
        </Flex>
      </Link>
      {content}
    </div>
  );
};

const AuthPage: React.FC<AuthProps> = ({ type, formProps }) => {
  return (
    <AntdAuthPage
      type={type}
      wrapperProps={authWrapperProps}
      renderContent={renderAuthContent}
      formProps={formProps}
    />
  );
};

export default AuthPage;