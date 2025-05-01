import React, { lazy } from "react";
import { createRoot } from "react-dom/client";
import dayjs from "dayjs";
import "./i18n";
import { LoadingPage } from "./components/loading";

import WeekDay from "dayjs/plugin/weekday";
import LocaleData from "dayjs/plugin/localeData";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

const App = lazy(() => import("./App"));

dayjs.extend(WeekDay);
dayjs.extend(LocaleData);
dayjs.extend(LocalizedFormat);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <React.Suspense fallback={<LoadingPage/>}>
      <App />
    </React.Suspense>
  </React.StrictMode>,
);
