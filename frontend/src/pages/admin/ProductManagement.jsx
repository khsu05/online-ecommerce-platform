import { useEffect, useState } from "react";

import {
  Package,
  PackagePlus,
  Store,
  Boxes,
  IndianRupee,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import AppLayout from "../../components/AppLayout";

function ProductManagement() {
  // =====================================================
  // STATE
  // =====================================================

  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);

  const [formData, setFormData] = useState({
    sellerId: "",
    name: "",
    description: "",
    price: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const PRODUCT_API =
    "http://localhost:5000/api/products";

  const USER_API =
    "http://localhost:5000/api/users";

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      const response = await fetch(PRODUCT_API);

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to load products"
        );

        return;
      }

      setProducts(data);
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to load products"
      );
    }
  };

  // =====================================================
  // FETCH SELLERS
  // =====================================================

  const fetchSellers = async () => {
    try {
      const response = await fetch(USER_API);

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      const sellerUsers = data.filter(
        (user) =>
          user.role === "seller"
      );

      setSellers(sellerUsers);
    } catch (error) {
      console.error(error);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchProducts();
    fetchSellers();
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  // =====================================================
  // ADD / UPDATE PRODUCT
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let response;

      // ---------------------------------
      // UPDATE
      // ---------------------------------

      if (editingId !== null) {
        response = await fetch(
          `${PRODUCT_API}/${editingId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name: formData.name,

              description:
                formData.description,

              price: Number(
                formData.price
              ),
            }),
          }
        );
      }

      // ---------------------------------
      // CREATE
      // ---------------------------------

      else {
        if (!formData.sellerId) {
          setMessage(
            "Please select a seller"
          );

          return;
        }

        response = await fetch(
          `${PRODUCT_API}/seller/${formData.sellerId}`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name: formData.name,

              description:
                formData.description,

              price: Number(
                formData.price
              ),
            }),
          }
        );
      }

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to save product"
        );

        return;
      }

      setMessage(data.message);

      setFormData({
        sellerId: "",
        name: "",
        description: "",
        price: "",
      });

      setEditingId(null);

      fetchProducts();
    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong"
      );
    }
  };

  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  const handleEdit = (product) => {
    setEditingId(product.id);

    setFormData({
      sellerId:
        product.seller_id,

      name:
        product.name,

      description:
        product.description,

      price:
        product.price,
    });

    setMessage("");
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to remove this product?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${PRODUCT_API}/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      setMessage(data.message);

      if (response.ok) {
        if (
          Number(editingId) ===
          Number(id)
        ) {
          setEditingId(null);

          setFormData({
            sellerId: "",
            name: "",
            description: "",
            price: "",
          });
        }

        fetchProducts();
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to delete product"
      );
    }
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEdit = () => {
    setEditingId(null);

    setFormData({
      sellerId: "",
      name: "",
      description: "",
      price: "",
    });

    setMessage("");
  };

  // =====================================================
  // SELLER NAME
  // =====================================================

  const getSellerName = (sellerId) => {
    const seller =
      sellers.find(
        (item) =>
          Number(item.id) ===
          Number(sellerId)
      );

    return seller
      ? seller.name
      : `Seller #${sellerId}`;
  };

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalInventory =
    products.reduce(
      (total, product) =>
        total +
        Number(
          product.inventory_quantity ||
            0
        ),
      0
    );

  // =====================================================
  // UI
  // =====================================================

  return (
    <AppLayout
      role="admin"
      title="Product Management"
      subtitle="Manage product listings across the marketplace."
    >
      <div className="management-page admin-products-page">
        {/* MESSAGE */}

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {/* ==========================================
            SUMMARY
        ========================================== */}

        <div className="admin-product-summary">
          <div className="admin-product-summary-card">
            <div className="admin-product-summary-icon">
              <Package size={21} />
            </div>

            <div>
              <span>
                Products
              </span>

              <strong>
                {products.length}
              </strong>
            </div>
          </div>

          <div className="admin-product-summary-card">
            <div className="admin-product-summary-icon">
              <Store size={21} />
            </div>

            <div>
              <span>
                Sellers
              </span>

              <strong>
                {sellers.length}
              </strong>
            </div>
          </div>

          <div className="admin-product-summary-card">
            <div className="admin-product-summary-icon">
              <Boxes size={21} />
            </div>

            <div>
              <span>
                Inventory Units
              </span>

              <strong>
                {totalInventory}
              </strong>
            </div>
          </div>
        </div>

        {/* ==========================================
            ADD / EDIT PRODUCT
        ========================================== */}

        <section className="admin-product-section">
          <div className="admin-product-section-header">
            <div className="admin-product-heading">
              <div className="admin-product-heading-icon">
                {editingId !== null ? (
                  <Pencil size={20} />
                ) : (
                  <PackagePlus
                    size={20}
                  />
                )}
              </div>

              <div>
                <h2>
                  {editingId !== null
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p>
                  {editingId !== null
                    ? "Update product name, description, and price."
                    : "Create a product listing for a selected seller."}
                </p>
              </div>
            </div>

            {editingId !== null && (
              <button
                type="button"
                className="admin-product-close"
                onClick={
                  cancelEdit
                }
                aria-label="Cancel product editing"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="admin-product-form-area">
            <form
              className="admin-product-form"
              onSubmit={
                handleSubmit
              }
            >
              {/* SELLER */}

              {editingId === null && (
                <div className="form-group">
                  <label>
                    Seller
                  </label>

                  <select
                    name="sellerId"
                    value={
                      formData.sellerId
                    }
                    onChange={
                      handleChange
                    }
                    required
                  >
                    <option value="">
                      Select Seller
                    </option>

                    {sellers.map(
                      (seller) => (
                        <option
                          key={
                            seller.id
                          }
                          value={
                            seller.id
                          }
                        >
                          {
                            seller.name
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              {/* NAME */}

              <div className="form-group">
                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* PRICE */}

              <div className="form-group">
                <label>
                  Price
                </label>

                <div className="admin-product-price-input">
                  <IndianRupee
                    size={16}
                  />

                  <input
                    type="number"
                    name="price"
                    value={
                      formData.price
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* DESCRIPTION */}

              <div className="form-group admin-product-description-field">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  rows="4"
                  placeholder="Enter product description"
                  required
                />
              </div>

              {/* BUTTONS */}

              <div className="admin-product-form-buttons">
                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingId !== null ? (
                    <>
                      <Pencil
                        size={16}
                      />

                      Update Product
                    </>
                  ) : (
                    <>
                      <PackagePlus
                        size={16}
                      />

                      Add Product
                    </>
                  )}
                </button>

                {editingId !== null && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={
                      cancelEdit
                    }
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* ==========================================
            PRODUCT LISTINGS
        ========================================== */}

        <section className="admin-product-section">
          <div className="admin-product-section-header">
            <div className="admin-product-heading">
              <div className="admin-product-heading-icon">
                <Package
                  size={20}
                />
              </div>

              <div>
                <h2>
                  Product Listings
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
            </div>
          </div>

          <div className="admin-products-table-wrapper">
            <table className="admin-products-table">
              <thead>
                <tr>
                  <th>
                    ID
                  </th>

                  <th>
                    Product
                  </th>

                  <th>
                    Seller
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Inventory
                  </th>

                  <th>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="admin-products-empty"
                    >
                      No products
                      found.
                    </td>
                  </tr>
                ) : (
                  products.map(
                    (product) => (
                      <tr
                        key={
                          product.id
                        }
                      >
                        {/* ID */}

                        <td>
                          #
                          {
                            product.id
                          }
                        </td>

                        {/* PRODUCT */}

                        <td>
                          <div className="admin-product-table-product">
                            <div className="admin-product-thumbnail">
                              {product.image_url ? (
                                <img
                                  src={
                                    product.image_url
                                  }
                                  alt={
                                    product.name
                                  }
                                />
                              ) : (
                                <Package
                                  size={18}
                                />
                              )}
                            </div>

                            <strong>
                              {
                                product.name
                              }
                            </strong>
                          </div>
                        </td>

                        {/* SELLER */}

                        <td>
                          <div className="admin-product-seller">
                            <Store
                              size={15}
                            />

                            <div>
                              <strong>
                                {getSellerName(
                                  product.seller_id
                                )}
                              </strong>

                              <span>
                                Seller #
                                {
                                  product.seller_id
                                }
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* DESCRIPTION */}

                        <td>
                          <p className="admin-product-table-description">
                            {
                              product.description
                            }
                          </p>
                        </td>

                        {/* PRICE */}

                        <td>
                          <strong className="admin-product-table-price">
                            ₹
                            {formatPrice(
                              product.price
                            )}
                          </strong>
                        </td>

                        {/* INVENTORY */}

                        <td>
                          <div className="admin-product-inventory">
                            <Boxes
                              size={14}
                            />

                            <span>
                              {
                                product.inventory_quantity
                              }{" "}
                              units
                            </span>
                          </div>
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="admin-product-actions">
                            <button
                              type="button"
                              className="admin-product-edit-button"
                              onClick={() =>
                                handleEdit(
                                  product
                                )
                              }
                            >
                              <Pencil
                                size={14}
                              />

                              Edit
                            </button>

                            <button
                              type="button"
                              className="admin-product-delete-button"
                              onClick={() =>
                                handleDelete(
                                  product.id
                                )
                              }
                            >
                              <Trash2
                                size={14}
                              />

                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default ProductManagement;