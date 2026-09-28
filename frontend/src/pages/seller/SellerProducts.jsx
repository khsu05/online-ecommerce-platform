import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Package,
  Pencil,
  Boxes,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";

import {
  SELLER_ID,
} from "../../config/userIds";

import AppLayout from "../../components/AppLayout";

function SellerProducts() {
  const sellerId =
    SELLER_ID;

  const navigate =
    useNavigate();

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    message,
    setMessage,
  ] = useState("");

  const API_URL =
    "http://localhost:5000/api/products";

  const formatPrice = (
    price
  ) => {
    return Number(
      price || 0
    ).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  const fetchProducts =
    async () => {
      try {
        const response =
          await fetch(
            `${API_URL}/seller/${sellerId}`
          );

        const data =
          await response.json();

        if (!response.ok) {
          setMessage(
            data.message ||
              "Failed to load products"
          );

          return;
        }

        setProducts(data);
        setMessage("");
      } catch (error) {
        console.error(error);

        setMessage(
          "Failed to load products"
        );
      }
    };

  useEffect(() => {
    fetchProducts();
  }, []);

  const lowStockCount =
    products.filter(
      (product) =>
        Number(
          product.inventory_quantity
        ) <= 5
    ).length;

  return (
    <AppLayout
      role="seller"
      title="Product Listings"
      subtitle="Manage your products and inventory quantities."
    >
      <div className="management-page seller-products-page">
        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        <div className="seller-products-summary">
          <div className="seller-summary-card">
            <div className="seller-summary-icon">
              <Package
                size={21}
              />
            </div>

            <div>
              <span>
                Total Products
              </span>

              <strong>
                {products.length}
              </strong>
            </div>
          </div>

          <div className="seller-summary-card">
            <div className="seller-summary-icon">
              <AlertTriangle
                size={21}
              />
            </div>

            <div>
              <span>
                Low Stock
              </span>

              <strong>
                {lowStockCount}
              </strong>
            </div>
          </div>
        </div>

        <section className="seller-products-section">
          <div className="seller-products-header">
            <div>
              <h2>
                Your Products
              </h2>

              <p>
                {products.length}{" "}
                product
                {products.length === 1
                  ? ""
                  : "s"}{" "}
                listed
              </p>
            </div>

            <Package
              size={22}
            />
          </div>

          {products.length === 0 ? (
            <div className="seller-products-empty">
              <Package
                size={38}
              />

              <h3>
                No products found
              </h3>

              <p>
                Your listed products
                will appear here.
              </p>
            </div>
          ) : (
            <div className="seller-product-grid">
              {products.map(
                (product) => {
                  const inventory =
                    Number(
                      product.inventory_quantity
                    );

                  return (
                    <article
                      className="seller-product-card"
                      key={
                        product.id
                      }
                    >
                      <div className="seller-product-image">
                        <img
                          src={
                            product.image_url ||
                            "/products/placeholder.jpg"
                          }
                          alt={
                            product.name
                          }
                          onError={(
                            event
                          ) => {
                            event.currentTarget.onerror =
                              null;

                            event.currentTarget.src =
                              "/products/placeholder.jpg";
                          }}
                        />
                      </div>

                      <div className="seller-product-content">
                        <div className="seller-product-title-row">
                          <h3>
                            {
                              product.name
                            }
                          </h3>

                          <span>
                            #
                            {
                              product.id
                            }
                          </span>
                        </div>

                        <p className="seller-product-description">
                          {
                            product.description
                          }
                        </p>

                        <div className="seller-product-price">
                          <IndianRupee
                            size={17}
                          />

                          <strong>
                            {formatPrice(
                              product.price
                            )}
                          </strong>
                        </div>

                        <div className="seller-product-inventory">
                          <div>
                            <span>
                              Inventory
                            </span>

                            <strong>
                              {
                                inventory
                              }{" "}
                              unit
                              {inventory ===
                              1
                                ? ""
                                : "s"}
                            </strong>
                          </div>

                          {inventory <=
                          0 ? (
                            <span className="seller-stock-badge seller-stock-out">
                              Out of
                              Stock
                            </span>
                          ) : inventory <=
                            5 ? (
                            <span className="seller-stock-badge seller-stock-low">
                              Low Stock
                            </span>
                          ) : (
                            <span className="seller-stock-badge seller-stock-good">
                              In Stock
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="seller-product-actions">
                        <button
                          type="button"
                          className="seller-product-edit-button"
                          onClick={() =>
                            navigate(
                              `/seller/products/${product.id}/edit`
                            )
                          }
                        >
                          <Pencil
                            size={15}
                          />

                          Edit Product
                        </button>

                        <button
                          type="button"
                          className="seller-inventory-button"
                          onClick={() =>
                            navigate(
                              `/seller/products/${product.id}/inventory`
                            )
                          }
                        >
                          <Boxes
                            size={15}
                          />

                          Inventory
                        </button>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

export default SellerProducts;