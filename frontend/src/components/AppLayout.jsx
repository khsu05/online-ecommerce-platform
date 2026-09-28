import { Link, NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  Activity,
  Boxes,
  ChartNoAxesCombined,
  ShoppingBag,
  History,
  Heart,
  User,
  Store,
  ArrowLeftRight,
} from "lucide-react";

function AppLayout({
  role,
  title,
  subtitle,
  children,
}) {
  const adminLinks = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: ClipboardList,
    },
    {
      label: "System Activity",
      path: "/admin/system-activities",
      icon: Activity,
    },
  ];

  const sellerLinks = [
    {
      label: "Dashboard",
      path: "/seller",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      path: "/seller/products",
      icon: Package,
    },
    {
      label: "Orders",
      path: "/seller/orders",
      icon: ClipboardList,
    },
    {
      label: "Inventory",
      path: "/seller/inventory",
      icon: Boxes,
    },
    {
      label: "Sales Performance",
      path: "/seller/sales",
      icon: ChartNoAxesCombined,
    },
  ];

  const buyerLinks = [
    {
      label: "Dashboard",
      path: "/buyer",
      icon: LayoutDashboard,
    },
    {
      label: "Browse Products",
      path: "/buyer/products",
      icon: ShoppingBag,
    },
    {
      label: "Browsing History",
      path: "/buyer/history",
      icon: History,
    },
    {
      label: "Orders",
      path: "/buyer/orders",
      icon: ClipboardList,
    },
    {
      label: "Wishlist",
      path: "/buyer/wishlist",
      icon: Heart,
    },
    {
      label: "Account",
      path: "/buyer/account",
      icon: User,
    },
  ];

  let links = [];

  if (role === "admin") {
    links = adminLinks;
  }

  if (role === "seller") {
    links = sellerLinks;
  }

  if (role === "buyer") {
    links = buyerLinks;
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link
          to="/"
          className="sidebar-brand"
        >
          <div className="brand-icon">
            <Store size={24} />
          </div>

          <div>
            <strong>E-Commerce</strong>
            <span>Platform</span>
          </div>
        </Link>

        <div className="role-indicator">
          <span>{role}</span>
          Portal
        </div>

        <nav className="sidebar-navigation">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === `/${role}`}
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link sidebar-link-active"
                    : "sidebar-link"
                }
              >
                <Icon size={19} />

                <span>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <Link
            to="/"
            className="switch-role-link"
          >
            <ArrowLeftRight size={18} />
            Switch Role
          </Link>
        </div>
      </aside>

      <div className="app-workspace">
        <header className="workspace-header">
          <div>
            <h1>{title}</h1>

            {subtitle && (
              <p>{subtitle}</p>
            )}
          </div>

          <div className="workspace-role">
            <span className="role-dot" />

            {role.charAt(0).toUpperCase() +
              role.slice(1)}
          </div>
        </header>

        <main className="workspace-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;