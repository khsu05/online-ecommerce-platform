import { useEffect, useState } from "react";

import {
  Package,
  Pencil,
  Boxes,
  IndianRupee,
  AlertTriangle,
  X,
} from "lucide-react";

import { SELLER_ID } from "../../config/userIds";
import AppLayout from "../../components/AppLayout";

function SellerProducts() {
  const sellerId = SELLER_ID;

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [products, setProducts] = useState([]);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [inventoryProduct, setInventoryProduct] =
    useState(null);

  const [message, setMessage] = useState("");

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [inventoryQuantity, setInventoryQuantity] =
    useState("");

  const API_URL =
    "http://localhost:5000/api/products";

  // --------------------------------------------------
  // PRICE FORMAT
  // --------------------------------------------------

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // --------------------------------------------------
  // FETCH PRODUCTS
  // --------------------------------------------------

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${API_URL}/seller/${sellerId}`
      );

      const data = await response.json();

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

  // --------------------------------------------------
  // START PRODUCT EDIT
  // --------------------------------------------------

  const startEdit = (product) => {
    setEditingProduct(product.id);

    setInventoryProduct(null);

    setProductForm({
      name: product.name,
      description:
        product.description,
      price: product.price,
    });

    setMessage("");
  };

  // --------------------------------------------------
  // PRODUCT FORM CHANGE
  // --------------------------------------------------

  const handleProductChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setProductForm(
      (previous) => ({
        ...previous,

        [name]: value,
      })
    );
  };

  // --------------------------------------------------
  // UPDATE PRODUCT
  // --------------------------------------------------

  const updateProduct = async (
    event
  ) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/${editingProduct}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name:
              productForm.name,

            description:
              productForm.description,

            price:
              Number(
                productForm.price
              ),
          }),
        }
      );

      const data =
        await response.json();

      setMessage(data.message);

      if (response.ok) {
        setEditingProduct(null);

        setProductForm({
          name: "",
          description: "",
          price: "",
        });

        fetchProducts();
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to update product"
      );
    }
  };

  // --------------------------------------------------
  // CANCEL PRODUCT EDIT
  // --------------------------------------------------

  const cancelProductEdit = () => {
    setEditingProduct(null);

    setProductForm({
      name: "",
      description: "",
      price: "",
    });
  };

  // --------------------------------------------------
  // START INVENTORY UPDATE
  // --------------------------------------------------

  const startInventoryUpdate = (
    product
  ) => {
    setInventoryProduct(
      product.id
    );

    setEditingProduct(null);

    setInventoryQuantity(
      product.inventory_quantity
    );

    setMessage("");
  };

  // --------------------------------------------------
  // UPDATE INVENTORY
  // --------------------------------------------------

  const updateInventory = async (
    event
  ) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/seller/${sellerId}/product/${inventoryProduct}/inventory`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            inventory_quantity:
              Number(
                inventoryQuantity
              ),
          }),
        }
      );

      const data =
        await response.json();

      setMessage(data.message);

      if (response.ok) {
        setInventoryProduct(
          null
        );

        setInventoryQuantity(
          ""
        );

        fetchProducts();
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to update inventory"
      );
    }
  };

  // --------------------------------------------------
  // CANCEL INVENTORY
  // --------------------------------------------------

  const cancelInventoryEdit = () => {
    setInventoryProduct(null);

    setInventoryQuantity("");
  };

  // --------------------------------------------------
  // SELECTED PRODUCTS
  // --------------------------------------------------

  const selectedEditProduct =
    products.find(
      (product) =>
        Number(product.id) ===
        Number(editingProduct)
    );

  const selectedInventoryProduct =
    products.find(
      (product) =>
        Number(product.id) ===
        Number(inventoryProduct)
    );

  // --------------------------------------------------
  // LOW STOCK COUNT
  // --------------------------------------------------

  const lowStockCount =
    products.filter(
      (product) =>
        Number(
          product.inventory_quantity
        ) <= 5
    ).length;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <AppLayout
      role="seller"
      title="Product Listings"
      subtitle="Manage your products and inventory quantities."
    >
      <div className="management-page seller-products-page">
        {/* MESSAGE */}

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {/* ==========================================
            PRODUCT SUMMARY
        ========================================== */}

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

        {/* ==========================================
            PRODUCT LIST
        ========================================== */}

        <section className="seller-products-section">
          <div className="seller-products-header">
            <div>
              <h2>
                Your Products
              </h2>

              <p>
                {products.length}{" "}
                product
                {products.length ===
                1
                  ? ""
                  : "s"}{" "}
                listed
              </p>
            </div>

            <Package size={22} />
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
                Your listed
                products will
                appear here.
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
                      {/* IMAGE */}

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

                      {/* CONTENT */}

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

                        {/* INVENTORY */}

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

                      {/* ACTIONS */}

                      <div className="seller-product-actions">
                        <button
                          type="button"
                          className="seller-product-edit-button"
                          onClick={() =>
                            startEdit(
                              product
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
                            startInventoryUpdate(
                              product
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

        {/* ==========================================
            EDIT PRODUCT
        ========================================== */}

        {editingProduct &&
          selectedEditProduct && (
            <section className="seller-edit-section">
              <div className="seller-edit-header">
                <div>
                  <span>
                    Product
                    Management
                  </span>

                  <h2>
                    Edit Product
                  </h2>

                  <p>
                    Update product
                    information and
                    pricing.
                  </p>
                </div>

                <button
                  type="button"
                  className="seller-form-close"
                  onClick={
                    cancelProductEdit
                  }
                  aria-label="Close edit product"
                >
                  <X
                    size={18}
                  />
                </button>
              </div>

              <div className="seller-edit-layout">
                {/* PRODUCT PREVIEW */}

                <div className="seller-edit-preview">
                  <div className="seller-edit-preview-image">
                    <img
                      src={
                        selectedEditProduct.image_url ||
                        "/products/placeholder.jpg"
                      }
                      alt={
                        selectedEditProduct.name
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

                  <strong>
                    {
                      selectedEditProduct.name
                    }
                  </strong>

                  <span>
                    Product #
                    {
                      selectedEditProduct.id
                    }
                  </span>
                </div>

                {/* EDIT FORM */}

                <form
                  className="management-form seller-edit-form"
                  onSubmit={
                    updateProduct
                  }
                >
                  <div className="form-group">
                    <label>
                      Product Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={
                        productForm.name
                      }
                      onChange={
                        handleProductChange
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={
                        productForm.description
                      }
                      onChange={
                        handleProductChange
                      }
                      rows="4"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Price
                    </label>

                    <input
                      type="number"
                      name="price"
                      value={
                        productForm.price
                      }
                      onChange={
                        handleProductChange
                      }
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-buttons">
                    <button
                      type="submit"
                      className="primary-button"
                    >
                      Update Product
                    </button>

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={
                        cancelProductEdit
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}

        {/* ==========================================
            INVENTORY
        ========================================== */}

        {inventoryProduct &&
          selectedInventoryProduct && (
            <section className="seller-edit-section">
              <div className="seller-edit-header">
                <div>
                  <span>
                    Inventory
                    Management
                  </span>

                  <h2>
                    Update Inventory
                  </h2>

                  <p>
                    Change the
                    available quantity
                    for this product.
                  </p>
                </div>

                <button
                  type="button"
                  className="seller-form-close"
                  onClick={
                    cancelInventoryEdit
                  }
                  aria-label="Close inventory form"
                >
                  <X
                    size={18}
                  />
                </button>
              </div>

              <div className="seller-inventory-edit-layout">
                <div className="seller-inventory-product">
                  <div className="seller-inventory-product-icon">
                    <Boxes
                      size={24}
                    />
                  </div>

                  <div>
                    <span>
                      Product
                    </span>

                    <strong>
                      {
                        selectedInventoryProduct.name
                      }
                    </strong>

                    <small>
                      Current stock:{" "}
                      {
                        selectedInventoryProduct.inventory_quantity
                      }
                    </small>
                  </div>
                </div>

                <form
                  className="management-form seller-inventory-form"
                  onSubmit={
                    updateInventory
                  }
                >
                  <div className="form-group">
                    <label>
                      Inventory Quantity
                    </label>

                    <input
                      type="number"
                      value={
                        inventoryQuantity
                      }
                      onChange={(
                        event
                      ) =>
                        setInventoryQuantity(
                          event
                            .target
                            .value
                        )
                      }
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-buttons">
                    <button
                      type="submit"
                      className="primary-button"
                    >
                      Update Inventory
                    </button>

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={
                        cancelInventoryEdit
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}
      </div>
    </AppLayout>
  );
}

export default SellerProducts;