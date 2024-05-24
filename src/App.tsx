import React from "react";
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

import "dayjs/locale/de";

import { DashboardPage } from "./pages/dashboard";
import { OrderList, OrderShow } from "./pages/orders";
import { AuthPage } from "./pages/auth";
import { CustomerShow, CustomerList } from "./pages/customers";
import { CourierList, CourierCreate, CourierEdit } from "./pages/couriers";
import {
  ProductList,
  ProductCreate,
  ProductEdit,
  ProductShow,

} from "./pages/products";

// import { CustomerListss,CustomerShowss } from "./pages/customersss";
import { StoreCreate, StoreEdit, StoreList } from "./pages/stores";
import { CategoryCreate, CategoryEdit, CategoryList, CategoryShow } from "./pages/categories";
import { useTranslation } from "react-i18next";
import { Header, Title } from "./components";
import { BikeWhiteIcon } from "./components/icons";
import { ConfigProvider } from "./context";
import { useAutoLoginForDemo } from "./hooks";

import "@refinedev/antd/dist/reset.css";
import {
  PurchaseCreate,
  PurchaseEdit,
  PurchaseList,
  PurchaseShow,
} from "./pages/purchases";

import { SupplierCreate, SupplierEdit, SupplierList, SupplierShow } from "./pages/suppliers";

import { CustomerCreate } from "./pages/customers/create";
import { CustomerEdit } from "./pages/customers/edit";
import { AccountsList } from "./pages/accounts";
import { AccountsCreate } from "./pages/accounts/create";
import { SaleCreate, SaleList, SalesShow } from "./pages/sales";


const App: React.FC = () => {
  // This hook is used to automatically login the user.
  // We use this hook to skip the login page and demonstrate the application more quickly.
  const { loading } = useAutoLoginForDemo();

  // const API_URL = "https://api.finefoods.refine.dev";
const API_URL = " https://tyre-sales-admin-backend.onrender.com";

 
  const dataProvider = jsonServerDataProvider(API_URL);

  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  if (loading) {
    return null;
  }

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
                name: "accounts",
                list: "/accounts",
                create: "/accounts/new",
                edit: "/accounts/:id/edit",

                show: "/accounts/:id",
                meta: {
                  label: "Accounts",
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

                <Route path="/orders">
                  <Route index element={<OrderList />} />
                  <Route path=":id" element={<OrderShow />} />
                </Route>

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
                
                <Route path="/suppliers" 
                                  element={
                                    <SupplierList>
                                      <Outlet />
                                    </SupplierList>
                                  }>
                  <Route path="new" element={<SupplierCreate/>} />
                  <Route path=":id" element={<SupplierShow />} />

                  <Route path=":id/edit" element={<SupplierEdit/>} />
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
                  path="/accounts"
                  element={
                    <AccountsList>
                      <Outlet />
                    </AccountsList>
                  }
                >


                  {/* <Route path=":id" element={<CustomerShow />} /> */}
                  <Route path="new" element={<AccountsCreate />} />
                  {/* <Route path=":id/edit" element={<CustomerEdit />} /> */}



                </Route>
                

                <Route path="/stores">
                  <Route index element={<StoreList />} />
                  <Route path="new" element={<StoreCreate />} />
                  <Route path=":id/edit" element={<StoreEdit />} />
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


                <Route path="/couriers">
                  <Route
                    path=""
                    element={
                      <CourierList>
                        <Outlet />
                      </CourierList>
                    }
                  >
                    <Route path="new" element={<CourierCreate />} />
                  </Route>

                  <Route path=":id/edit" element={<CourierEdit />} />
                </Route>
              </Route>

              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="dashboard" />
                  </Authenticated>
                }
              >
                <Route
                  path="/login"
                  element={
                    <AuthPage
                      type="login"
                      formProps={{
                        initialValues: {
                          email: "demo@refine.dev",
                          password: "demodemo",
                        },
                      }}
                    />
                  }
                />
                <Route
                  path="/register"
                  element={
                    <AuthPage
                      type="register"
                      formProps={{
                        initialValues: {
                          email: "demo@refine.dev",
                          password: "demodemo",
                        },
                      }}
                    />
                  }
                />
                <Route
                  path="/forgot-password"
                  element={<AuthPage type="forgotPassword" />}
                />
                <Route
                  path="/update-password"
                  element={<AuthPage type="updatePassword" />}
                />
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
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </RefineKbarProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
