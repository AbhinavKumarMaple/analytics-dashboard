import {
  LayoutDashboard,
  LineChart,
  Building,
  Globe,
  Settings,
  Users,
  HelpCircle,
  Home,
} from "lucide-react";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: NavigationItem[];
}

export const navigationItems: NavigationItem[] = [
  {
    id: "data-analytics",
    label: "Data Analytics",
    href: "#",
    icon: Home,
    children: [
      // {
      //   id: "dashboard",
      //   label: "Dashboard",
      //   href: "/dashboard",
      //   icon: LayoutDashboard,
      // },
      {
        id: "market-view",
        label: "Market View",
        href: "/market",
        // icon: Globe,
      },
      {
        id: "acquisition-view",
        label: "Acquisition View",
        href: "/acquisition",
        // icon: Building,
      },
      {
        id: "urls",
        label: "URLs",
        href: "/urls",
        // icon: Globe,
      },
      {
        id: "charts",
        label: "PowerBi Charts",
        href: "/charts",
        // icon: LineChart,
      },
      {
        id: "properties",
        label: "Properties",
        href: "/properties",
        // icon: Building,
      },
    ],
  },
];

// Additional navigation items that could be added in the future
export const secondaryNavigationItems: NavigationItem[] = [
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    id: "help",
    label: "Help & Support",
    href: "/help",
    icon: HelpCircle,
  },
];
