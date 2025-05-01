import React, { lazy } from "react";
import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbarProvider } from "@refinedev/kbar";
import {
  useNotificationProvider,
  ThemedLayoutV2,
  ErrorComponent,
} from "@refinedev/antd";
import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import {
  ShoppingOutlined,
  ShopOutlined,
  DashboardOutlined,
  UserOutlined,
  TagsOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  FundOutlined,
} from "@ant-design/icons";
import jsonServerDataProvider from "@refinedev/simple-rest";
import { authProvider } from "./authProvider";
import ConfigProvider from "./context/configProvider";

import "dayjs/locale/de";

import Header from "./components/header";
import Title from "./components/title";
import DashboardPage from "./pages/dashboard";
import AuthPage from "./pages/auth";
import CustomerShow from "./pages/customers/show";
import CustomerList from "./pages/customers/list";
import CustomerCreate from "./pages/customers/create";
import CustomerEdit from "./pages/customers/edit";

import ProductList from "./pages/products/list";
import ProductCreate from "./pages/products/create";
import ProductEdit from "./pages/products/edit";
import ProductShow from "./pages/products/show";

import CategoryCreate from "./pages/categories/create";
import CategoryEdit from "./pages/categories/edit";
import CategoryList from "./pages/categories/list";
import CategoryShow from "./pages/categories/show";

import PurchaseCreate from "./pages/purchases/create";
import PurchaseEdit from "./pages/purchases/edit";
import PurchaseList from "./pages/purchases/list";
import PurchaseShow from "./pages/purchases/show";

import SupplierCreate from "./pages/suppliers/create";
import SupplierEdit from "./pages/suppliers/edit";
import SupplierList from "./pages/suppliers/list";
import SupplierShow from "./pages/suppliers/show";

import SaleCreate from "./pages/sales/create";
import SaleList from "./pages/sales/list";
import SalesShow from "./pages/sales/show";

import PaymentList from "./pages/payments/list";
import PaymentCreate from "./pages/payments/create";

import axiosInstance from "./utils/axios-instance";
import { useTranslation } from "react-i18next";
import titleHandler from "./utils/title-handler";

const API_URL = import.meta.env.VITE_APP_API_URL;

const App: React.FC = () => {
  // This hook is used to automatically login the user.
  // We use this hook to skip the login page and demonstrate the application more quickly

  // const API_URL = "https://api.finefoods.refine.dev";
  // const API_URL = VITE_APP_API_URL;
  // const API_URL = "http://localhost:3000";

  const dataProvider = jsonServerDataProvider(API_URL, axiosInstance);

  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: Record<string, string | number>) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      <ConfigProvider>
        <RefineKbarProvider>
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: "dashboard",
                list: "/",
                meta: {
                  label: "Dashboard",
                  icon: <DashboardOutlined />,
                },
              },
              // {
              //   name: "orders",
              //   list: "/orders",
              //   show: "/orders/:id",
              //   meta: {
              //     icon: <ShoppingOutlined />,
              //   },
              // },
              // {
              //   name: "users",
              //   list: "/customers",
              //   show: "/customers/:id",
              //   meta: {
              //     icon: <UserOutlined />,
              //   },
              // },
              {
                name: "suppliers",
                list: "/suppliers",
                show: "/suppliers/:id",
                create: "/suppliers/new",
                edit: "/suppliers/:id/edit",
                meta: {
                  label: "Suppliers",
                  icon: <ShopOutlined />,
                },
              },
              {
                name: "customers",
                list: "/customers",
                create: "/customers/new",
                edit: "/customers/:id/edit",

                show: "/customers/:id",
                meta: {
                  label: "Customers",
                  icon: <UserOutlined />,
                },
              },
              {
                name: "products",
                list: "/products",
                create: "/products/new",
                edit: "/products/:id/edit",
                show: "/products/:id",
                meta: {
                  label: "Products",
                  icon: <UnorderedListOutlined />,
                },
              },
              {
                name: "purchases",
                list: "/purchases",
                create: "/purchases/new",
                edit: "/purchases/:id/edit",
                show: "/purchases/:id",
                meta: {
                  label: "Purchases",
                  icon: <ShoppingCartOutlined />,
                },
              },
              {
                name: "sales",
                list: "/sales",
                create: "/sales/new",
                edit: "/sales/:id/edit",
                show: "/sales/:id",
                meta: {
                  label: "Sales",
                  icon: <DollarOutlined />,
                },
              },
              {
                name: "categories",
                list: "/categories",
                create: "/categories/new",
                edit: "/categories/:id/edit",
                show: "/categories/:id",
                meta: {
                  label: "Categories",
                  icon: <TagsOutlined />,
                },
              },
              // {
              //   name: "stores",
              //   list: "/stores",
              //   create: "/stores/new",
              //   edit: "/stores/:id/edit",
              //   meta: {
              //     icon: <ShopOutlined />,
              //   },
              // },
              // {
              //   name: "couriers",
              //   list: "/couriers",
              //   create: "/couriers/new",
              //   edit: "/couriers/:id/edit",
              //   show: "/couriers/:id",
              //   meta: {
              //     icon: <BikeWhiteIcon />,
              //   },
              // },
              {
                name: "transactions",
                list: "/transactions",
                create: "/transactions/new",
                edit: "/transactions/:id/edit",

                show: "/transactions/:id",
                meta: {
                  label: "Transactions",
                  icon: <FundOutlined />,
                },
              },
            ]}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/login" />}
                    v3LegacyAuthProviderCompatible
                  >
                    <ThemedLayoutV2 Header={Header} Title={Title}>
                      <div
                        style={{
                          maxWidth: "1200px",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      >
                        <Outlet />
                      </div>
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route index element={<DashboardPage />} />

                <Route
                  path="/customers"
                  element={
                    <CustomerList>
                      <Outlet />
                    </CustomerList>
                  }
                >
                  <Route path=":id" element={<CustomerShow />} />
                  <Route path="new" element={<CustomerCreate />} />
                  <Route path=":id/edit" element={<CustomerEdit />} />
                </Route>

                {/* my */}
                {/* <Route
                  path="/newcustomers"
                  element={
                    <CustomerListss>
                      <Outlet />
                    </CustomerListss>
                  }
                >
                  <Route path=":id" element={<CustomerShowss />} />
                </Route> */}

                {/* xx */}

                <Route
                  path="/suppliers"
                  element={
                    <SupplierList>
                      <Outlet />
                    </SupplierList>
                  }
                >
                  <Route path="new" element={<SupplierCreate />} />
                  <Route path=":id" element={<SupplierShow />} />

                  <Route path=":id/edit" element={<SupplierEdit />} />
                </Route>

                <Route
                  path="/products"
                  element={
                    <ProductList>
                      <Outlet />
                    </ProductList>
                  }
                >
                  <Route path="new" element={<ProductCreate />} />
                  <Route path=":id" element={<ProductShow />} />
                  <Route path=":id/edit" element={<ProductEdit />} />
                </Route>

                <Route
                  path="/purchases"
                  element={
                    <PurchaseList>
                      <Outlet />
                    </PurchaseList>
                  }
                >
                  <Route path="new" element={<PurchaseCreate />} />
                  <Route path=":id" element={<PurchaseShow />} />
                  <Route path=":id/edit" element={<PurchaseEdit />} />
                </Route>

                <Route
                  path="/sales"
                  element={
                    <SaleList>
                      <Outlet />
                    </SaleList>
                  }
                >
                  <Route path="new" element={<SaleCreate />} />
                  <Route path=":id" element={<SalesShow />} />
                  {/* <Route path=":id/edit" element={<PurchaseEdit />} /> */}
                </Route>

                <Route
                  path="/transactions"
                  element={
                    <PaymentList>
                      <Outlet />
                    </PaymentList>
                  }
                >
                  {/* <Route path=":id" element={<CustomerShow />} /> */}
                  <Route path="new" element={<PaymentCreate />} />
                  {/* <Route path=":id/edit" element={<CustomerEdit />} /> */}
                </Route>

                {/* <Route path="/categories" element={<CategoryList />} /> */}

                <Route
                  path="/categories"
                  element={
                    <CategoryList>
                      <Outlet />
                    </CategoryList>
                  }
                >
                  <Route path="new" element={<CategoryCreate />} />
                  <Route path=":id" element={<CategoryShow />} />
                  <Route path=":id/edit" element={<CategoryEdit />} />
                </Route>
              </Route>

              <Route
                element={
                  <Authenticated
                    key="auth-pages"
                    fallback={<Outlet />}
                    v3LegacyAuthProviderCompatible
                  >
                    <NavigateToResource resource="dashboard" />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<AuthPage type="login" />} />
                {/*<Route*/}
                {/*  path="/register"*/}
                {/*  element={*/}
                {/*    <AuthPage*/}
                {/*      type="register"*/}
                {/*      formProps={{*/}
                {/*        initialValues: {*/}
                {/*          email: "demo@refine.dev",*/}
                {/*          password: "demodemo",*/}
                {/*        },*/}
                {/*      }}*/}
                {/*    />*/}
                {/*  }*/}
                {/*/>*/}
                {/*<Route*/}
                {/*    path="/forgot-password"*/}
                {/*    element={<AuthPage type="forgotPassword"/>}*/}
                {/*/>*/}
                {/* <Route
                  path="/update-password"
                  element={<AuthPage type="updatePassword" />}
                /> */}
              </Route>

              <Route
                element={
                  <Authenticated key="catch-all">
                    <ThemedLayoutV2 Header={Header} Title={Title}>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
            <DocumentTitleHandler handler={titleHandler} />
            <UnsavedChangesNotifier />
          </Refine>
        </RefineKbarProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
