import { Link } from "react-router-dom";

import {
  ShieldCheck,
  Store,
  ShoppingBag,
  ArrowRight,
  Layers3,
} from "lucide-react";

function RoleSelection() {
  return (
    <div className="role-selection-page">
      <header className="role-topbar">
        <div className="role-brand">
          <div className="role-brand-icon">
            <Layers3 size={23} />
          </div>

          <div>
            <strong>E-Commerce</strong>
          </div>
        </div>
      </header>

      <main className="role-selection-main">
        <section className="role-selection-header">
          <span className="role-selection-label">
            Online Marketplace
          </span>

          <h1>
            Welcome to the
            <span> E-Commerce Platform</span>
          </h1>

          <p>
            Select your role to access the tools and
            features available to you.
          </p>
        </section>

        <section className="role-selection-grid">
          <Link
            to="/admin"
            className="professional-role-card"
          >
            <div className="professional-role-icon">
              <ShieldCheck size={30} />
            </div>

            <div className="role-card-content">
              <span className="role-small-label">
                Administration
              </span>

              <h2>Admin</h2>

              <p>
                Manage users, products, orders,
                and monitor system activity.
              </p>
            </div>

            <div className="role-card-action">
              Enter Admin Portal
              <ArrowRight size={18} />
            </div>
          </Link>

          <Link
            to="/seller"
            className="professional-role-card"
          >
            <div className="professional-role-icon">
              <Store size={30} />
            </div>

            <div className="role-card-content">
              <span className="role-small-label">
                Store Management
              </span>

              <h2>Seller</h2>

              <p>
                Manage products, inventory,
                customer orders, and sales performance.
              </p>
            </div>

            <div className="role-card-action">
              Enter Seller Portal
              <ArrowRight size={18} />
            </div>
          </Link>

          <Link
            to="/buyer"
            className="professional-role-card"
          >
            <div className="professional-role-icon">
              <ShoppingBag size={30} />
            </div>

            <div className="role-card-content">
              <span className="role-small-label">
                Shopping
              </span>

              <h2>Buyer</h2>

              <p>
                Browse products, purchase items,
                track orders, and manage your account.
              </p>
            </div>

            <div className="role-card-action">
              Enter Buyer Portal
              <ArrowRight size={18} />
            </div>
          </Link>
        </section>

        <div className="role-selection-footer">
          Online E-Commerce Platform
        </div>
      </main>
    </div>
  );
}

export default RoleSelection;