import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  RotateCcw,
  Eye,
  Heart,
  ShoppingBag,
  Package,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";

import { BUYER_ID } from "../../config/userIds";
import AppLayout from "../../components/AppLayout";

function ProductBrowsing() {
  const buyerId = BUYER_ID;

  const navigate = useNavigate();

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [products, setProducts] = useState([]);

  const [message, setMessage] = useState("");

  const [toast, setToast] = useState(null);

  const [search, setSearch] = useState("");

  const [minPrice, setMinPrice] = useState("");

  const [maxPrice, setMaxPrice] = useState("");

  const [quantities, setQuantities] = useState({});

  const [selectedProducts, setSelectedProducts] =
    useState({});

  // --------------------------------------------------
  // API
  // --------------------------------------------------

  const PRODUCT_API =
    "http://localhost:5000/api/products";

  // --------------------------------------------------
  // PRICE FORMAT
  // --------------------------------------------------

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // --------------------------------------------------
  // TOAST
  // --------------------------------------------------

  const showToast = (
    toastMessage,
    type = "success"
  ) => {
    setToast({
      message: toastMessage,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  // --------------------------------------------------
  // FETCH PRODUCTS
  // --------------------------------------------------

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();

      if (search.trim()) {
        params.append(
          "search",
          search.trim()
        );
      }

      if (minPrice !== "") {
        params.append(
          "minPrice",
          minPrice
        );
      }

      if (maxPrice !== "") {
        params.append(
          "maxPrice",
          maxPrice
        );
      }

      const queryString =
        params.toString();

      const url = queryString
        ? `${PRODUCT_API}/browse?${queryString}`
        : `${PRODUCT_API}/browse`;

      const response =
        await fetch(url);

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

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    fetchProducts();
  }, []);

  // --------------------------------------------------
  // SEARCH / FILTER
  // --------------------------------------------------

  const handleSearch = (event) => {
    event.preventDefault();

    fetchProducts();
  };

  // --------------------------------------------------
  // RESET
  // --------------------------------------------------

  const resetFilters = async () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");

    try {
      const response = await fetch(
        `${PRODUCT_API}/browse`
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

  // --------------------------------------------------
  // VIEW DETAILS
  // --------------------------------------------------

  const viewProduct = async (
    product
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/browsing-history/buyer/${buyerId}/product/${product.id}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const data =
          await response.json();

        console.error(
          "Browsing history error:",
          data
        );
      }
    } catch (error) {
      console.error(
        "Failed to record browsing history:",
        error
      );
    }

    navigate(
      `/buyer/products/${product.id}`,
      {
        state: {
          product,
        },
      }
    );
  };

  // --------------------------------------------------
  // WISHLIST
  // --------------------------------------------------

  const addToWishlist = async (
    productId
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/wishlist/buyer/${buyerId}/product/${productId}`,
        {
          method: "POST",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        showToast(
          data.message ||
            "Failed to add product to wishlist",
          "error"
        );

        return;
      }

      showToast(
        data.message ||
          "Added to wishlist",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to add product to wishlist",
        "error"
      );
    }
  };

  // --------------------------------------------------
  // PRODUCT SELECTION
  // --------------------------------------------------

  const toggleProduct = (
    productId
  ) => {
    setSelectedProducts(
      (previous) => ({
        ...previous,

        [productId]:
          !previous[productId],
      })
    );

    setQuantities(
      (previous) => ({
        ...previous,

        [productId]:
          previous[productId] || 1,
      })
    );
  };

  // --------------------------------------------------
  // QUANTITY
  // --------------------------------------------------

  const updateQuantity = (
    productId,
    value,
    maxInventory
  ) => {
    let quantity =
      Number(value);

    if (
      Number.isNaN(quantity) ||
      quantity < 1
    ) {
      quantity = 1;
    }

    if (
      quantity > maxInventory
    ) {
      quantity =
        maxInventory;
    }

    setQuantities(
      (previous) => ({
        ...previous,

        [productId]:
          quantity,
      })
    );
  };

  // --------------------------------------------------
  // PURCHASE
  // --------------------------------------------------

  const placeOrder = async () => {
    const items = products
      .filter(
        (product) =>
          selectedProducts[
            product.id
          ]
      )
      .map((product) => ({
        product_id:
          product.id,

        quantity:
          quantities[
            product.id
          ] || 1,
      }));

    if (items.length === 0) {
      showToast(
        "Please select at least one product",
        "error"
      );

      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/buyer/${buyerId}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            items,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        showToast(
          data.message ||
            "Failed to place order",
          "error"
        );

        return;
      }

      showToast(
        `${data.message}. Order ID: ${data.orderId}`,
        "success"
      );

      setSelectedProducts({});

      setQuantities({});

      fetchProducts();
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to place order",
        "error"
      );
    }
  };

  // --------------------------------------------------
  // SELECTED COUNT
  // --------------------------------------------------

  const selectedCount =
    Object.values(
      selectedProducts
    ).filter(Boolean).length;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <AppLayout
      role="buyer"
      title="Browse Products"
      subtitle="Search, explore, and purchase products."
    >
      {/* TOAST */}

      {toast && (
        <div
          className={`toast-notification toast-${toast.type}`}
        >
          {toast.type ===
          "success" ? (
            <CheckCircle2
              size={19}
            />
          ) : (
            <AlertCircle
              size={19}
            />
          )}

          <span>
            {toast.message}
          </span>
        </div>
      )}

      <div className="marketplace-page">
        {/* ERROR MESSAGE */}

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        <div className="marketplace-layout">
          {/* ======================================
              LEFT FILTER SIDEBAR
          ====================================== */}

          <aside className="marketplace-filters">
            <div className="filter-heading">
              <div>
                <SlidersHorizontal
                  size={18}
                />

                <h3>
                  Filters
                </h3>
              </div>
            </div>

            <form
              onSubmit={
                handleSearch
              }
            >
              {/* SEARCH */}

              <div className="market-filter-group">
                <label>
                  Search
                </label>

                <div className="market-search-input">
                  <Search
                    size={16}
                  />

                  <input
                    type="text"
                    value={
                      search
                    }
                    onChange={(
                      event
                    ) =>
                      setSearch(
                        event.target
                          .value
                      )
                    }
                    placeholder="Search products"
                  />
                </div>
              </div>

              {/* PRICE FILTER */}

              <div className="market-filter-group">
                <label>
                  Price
                </label>

                <div className="market-price-inputs">
                  <div>
                    <span>
                      Min
                    </span>

                    <input
                      type="number"
                      value={
                        minPrice
                      }
                      onChange={(
                        event
                      ) =>
                        setMinPrice(
                          event.target
                            .value
                        )
                      }
                      min="0"
                      placeholder="₹0"
                    />
                  </div>

                  <div>
                    <span>
                      Max
                    </span>

                    <input
                      type="number"
                      value={
                        maxPrice
                      }
                      onChange={(
                        event
                      ) =>
                        setMaxPrice(
                          event.target
                            .value
                        )
                      }
                      min="0"
                      placeholder="Any"
                    />
                  </div>
                </div>
              </div>

              {/* FILTER BUTTONS */}

              <div className="market-filter-actions">
                <button
                  type="submit"
                  className="primary-button"
                >
                  <Search
                    size={15}
                  />

                  Apply Filters
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    resetFilters
                  }
                >
                  <RotateCcw
                    size={15}
                  />

                  Reset
                </button>
              </div>
            </form>
          </aside>

          {/* ======================================
              PRODUCT RESULTS
          ====================================== */}

          <section className="marketplace-results">
            {/* RESULTS HEADER */}

            <div className="marketplace-results-header">
              <div>
                <h2>
                  Products
                </h2>

                <p>
                  {products.length}{" "}
                  result
                  {products.length ===
                  1
                    ? ""
                    : "s"}{" "}
                  found
                </p>
              </div>

              <Package
                size={22}
              />
            </div>

            {/* EMPTY */}

            {products.length ===
            0 ? (
              <div className="product-empty-state">
                <Package
                  size={40}
                />

                <h3>
                  No products found
                </h3>

                <p>
                  Try changing
                  your search or
                  price filters.
                </p>
              </div>
            ) : (
              <div className="product-grid">
                {products.map(
                  (product) => {
                    const inventory =
                      Number(
                        product.inventory_quantity
                      );

                    const selected =
                      Boolean(
                        selectedProducts[
                          product.id
                        ]
                      );

                    return (
                      <article
                        className="product-card"
                        key={
                          product.id
                        }
                      >
                        {/* IMAGE */}

                        <div className="product-image-wrapper">
                          <img
                            src={
                              product.image_url ||
                              "/products/placeholder.jpg"
                            }
                            alt={
                              product.name
                            }
                            className="product-image"
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

                        {/* INFO */}

                        <div className="product-info">
                          <h3>
                            {
                              product.name
                            }
                          </h3>

                          <p className="product-description">
                            {
                              product.description
                            }
                          </p>

                          {/* PRICE */}

                          <div className="product-price">
                            ₹
                            {formatPrice(
                              product.price
                            )}
                          </div>

                          {/* STOCK */}

                          <div className="product-stock-line">
                            {inventory <=
                            0 ? (
                              <span className="out-of-stock-text">
                                Out of
                                Stock
                              </span>
                            ) : inventory <=
                              5 ? (
                              <span className="low-stock-text">
                                Only{" "}
                                {
                                  inventory
                                }{" "}
                                left
                              </span>
                            ) : (
                              <span className="in-stock-text">
                                In Stock:{" "}
                                {
                                  inventory
                                }
                              </span>
                            )}
                          </div>
                        </div>

                        {/* BUTTONS */}

                        <div className="product-actions">
                          <button
                            type="button"
                            className="view-details-button"
                            onClick={() =>
                              viewProduct(
                                product
                              )
                            }
                          >
                            <Eye
                              size={15}
                            />

                            Details
                          </button>

                          <button
                            type="button"
                            className="wishlist-button"
                            onClick={() =>
                              addToWishlist(
                                product.id
                              )
                            }
                          >
                            <Heart
                              size={15}
                            />

                            Wishlist
                          </button>
                        </div>

                        {/* SELECT */}

                        {inventory >
                          0 && (
                          <div className="product-select-area">
                            <label className="product-select-label">
                              <input
                                type="checkbox"
                                checked={
                                  selected
                                }
                                onChange={() =>
                                  toggleProduct(
                                    product.id
                                  )
                                }
                              />

                              <span>
                                Select
                                Product
                              </span>
                            </label>

                            {selected && (
                              <div className="quantity-control">
                                <label>
                                  Qty
                                </label>

                                <input
                                  type="number"
                                  min="1"
                                  max={
                                    inventory
                                  }
                                  value={
                                    quantities[
                                      product
                                        .id
                                    ] ||
                                    1
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    updateQuantity(
                                      product.id,
                                      event
                                        .target
                                        .value,
                                      inventory
                                    )
                                  }
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  }
                )}
              </div>
            )}

            {/* ======================================
                PURCHASE BAR
            ====================================== */}

            <div className="marketplace-purchase-bar">
              <div className="purchase-selection-info">
                <ShoppingBag
                  size={20}
                />

                <div>
                  <strong>
                    {
                      selectedCount
                    }{" "}
                    product
                    {selectedCount ===
                    1
                      ? ""
                      : "s"}{" "}
                    selected
                  </strong>

                  <span>
                    Select products
                    to create your
                    order.
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="primary-button purchase-button"
                onClick={
                  placeOrder
                }
              >
                <ShoppingBag
                  size={17}
                />

                Purchase Selected
              </button>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}

export default ProductBrowsing;