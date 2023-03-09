import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import ChangelogPage from "../pages/changelog/ChangelogPage";
import AlertPage from "../pages/component/AlertPage";
import ButtonPage from "../pages/component/ButtonPage";
import ComponentPageLayout from "../pages/component/ComponentPageLayout";
import AnalyticsPage from "../pages/dashboard/AnalyticsPage";
import DashboardIndex from "../pages/dashboard/DashboardIndex";
import DashboardPageLayout from "../pages/dashboard/DashboardPageLayout";
import DefaultPage from "../pages/dashboard/DefaultPage";
import SaasPage from "../pages/dashboard/SaasPage";
import DocumentationPage from "../pages/documentation/DocumentationPage";
import HomePage from "../pages/home/HomePage";
import InstallationPage from "../pages/installation/InstallationPage";

const appRoutes = [
  {
    index: true,
    element: <HomePage />,
    state: "home",
  },
  {
    path: "/installation",
    element: <InstallationPage />,
    state: "installation",
    sidebarProps: {
      displayText: "Installation",
      icon: <FileDownloadOutlinedIcon />,
    },
  },
  {
    path: "/dashboard",
    element: <DashboardPageLayout />,
    state: "dashboard",
    sidebarProps: {
      displayText: "Dashboard",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "dashboard.index",
      },
      {
        path: "/dashboard/default",
        element: <DefaultPage />,
        state: "dashboard.default",
        sidebarProps: {
          displayText: "Default",
        },
      },
      {
        path: "/dashboard/analytics",
        element: <AnalyticsPage />,
        state: "dashboard.analytics",
        sidebarProps: {
          displayText: "Analytic",
        },
      },
      {
        path: "/dashboard/saas",
        element: <SaasPage />,
        state: "dashboard.saas",
        sidebarProps: {
          displayText: "Saas",
        },
      },
    ],
  },
  {
    path: "/component",
    element: <ComponentPageLayout />,
    state: "component",
    sidebarProps: {
      displayText: "Components",
      icon: <AppsOutlinedIcon />,
    },
    child: [
      {
        path: "/component/alert",
        element: <AlertPage />,
        state: "component.alert",
        sidebarProps: {
          displayText: "Alert",
        },
      },
      {
        path: "/component/button",
        element: <ButtonPage />,
        state: "component.button",
        sidebarProps: {
          displayText: "Button",
        },
      },
    ],
  },
  {
    path: "/documentation",
    element: <DocumentationPage />,
    state: "documentation",
    sidebarProps: {
      displayText: "Documentation",
      icon: <ArticleOutlinedIcon />,
    },
  },
  {
    path: "/changelog",
    element: <ChangelogPage />,
    state: "changelog",
    sidebarProps: {
      displayText: "Changelog",
      icon: <FormatListBulletedOutlinedIcon />,
    },
  },
];

export default appRoutes;
