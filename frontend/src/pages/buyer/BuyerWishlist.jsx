import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Heart,
  Eye,
  Trash2,
  Package,
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { BUYER_ID } from "../../config/userIds";
import AppLayout from "../../components/AppLayout";

function BuyerWishlist() {
  const buyerId = BUYER_ID;

  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(null);

  const API_URL =
    `http://localhost:5000/api/wishlist/buyer/${buyerId}`;

  // --------------------------------------------------
  // FORMAT PRICE
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
  // FETCH WISHLIST
  // --------------------------------------------------

  const fetchWishlist = async () => {
    try {
      const response =
        await fetch(API_URL);

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to load wishlist"
        );

        return;
      }

      setWishlist(data);
      setMessage("");
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to load wishlist"
      );
    }
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    fetchWishlist();
  }, []);

  // --------------------------------------------------
  // OPEN PRODUCT
  // --------------------------------------------------

  const viewProduct = (
    productId
  ) => {
    navigate(
      `/buyer/products/${productId}`
    );
  };

  // --------------------------------------------------
  // REMOVE PRODUCT
  // --------------------------------------------------

  const removeFromWishlist =
    async (productId) => {
      const confirmed =
        window.confirm(
          "Remove this product from your wishlist?"
        );

      if (!confirmed) {
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/product/${productId}`,
            {
              method: "DELETE",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          showToast(
            data.message ||
              "Failed to remove product from wishlist",
            "error"
          );

          return;
        }

        showToast(
          data.message ||
            "Product removed from wishlist",
          "success"
        );

        fetchWishlist();
      } catch (error) {
        console.error(error);

        showToast(
          "Failed to remove product from wishlist",
          "error"
        );
      }
    };

  // --------------------------------------------------
  // PRICE CHANGE UI
  // --------------------------------------------------

  const renderPriceChange = (
    item
  ) => {
    if (
      item.price_change ===
      "Decreased"
    ) {
      return (
        <span className="wishlist-price-change wishlist-price-down">
          <TrendingDown size={15} />

          Price decreased
        </span>
      );
    }

    if (
      item.price_change ===
      "Increased"
    ) {
      return (
        <span className="wishlist-price-change wishlist-price-up">
          <TrendingUp size={15} />

          Price increased
        </span>
      );
    }

    return (
      <span className="wishlist-price-change wishlist-price-same">
        <Minus size={15} />

        No price change
      </span>
    );
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <AppLayout
      role="buyer"
      title="Wishlist"
      subtitle="Manage your favorite products and track price changes."
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

      <div className="management-page">
        {/* ERROR MESSAGE */}

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {/* HEADER */}

        <div className="wishlist-page-header">
          <div>
            <h2>
              Favorite Products
            </h2>

            <p>
              {wishlist.length}{" "}
              product
              {wishlist.length === 1
                ? ""
                : "s"}{" "}
              saved in your wishlist
            </p>
          </div>

          <div className="wishlist-header-icon">
            <Heart size={22} />
          </div>
        </div>

        {/* EMPTY WISHLIST */}

        {wishlist.length === 0 ? (
          <div className="wishlist-empty-state">
            <div className="wishlist-empty-icon">
              <Heart size={34} />
            </div>

            <h2>
              Your wishlist is empty
            </h2>

            <p>
              Products you save from the
              marketplace will appear here.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                navigate(
                  "/buyer/products"
                )
              }
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map(
              (item) => (
                <article
                  className="wishlist-card"
                  key={item.id}
                >
                  {/* IMAGE */}

                  <div className="wishlist-image-wrapper">
                    <img
                      src={
                        item.image_url ||
                        "/products/placeholder.jpg"
                      }
                      alt={item.name}
                      onError={(
                        event
                      ) => {
                        event.currentTarget.onerror =
                          null;

                        event.currentTarget.src =
                          "/products/placeholder.jpg";
                      }}
                    />

                    <div className="wishlist-heart-badge">
                      <Heart
                        size={17}
                        fill="currentColor"
                      />
                    </div>
                  </div>

                  {/* PRODUCT */}

                  <div className="wishlist-card-content">
                    <div className="wishlist-product-title">
                      <h3>
                        {item.name}
                      </h3>

                      <span>
                        Product #
                        {
                          item.product_id
                        }
                      </span>
                    </div>

                    <p className="wishlist-description">
                      {
                        item.description
                      }
                    </p>

                    {/* CURRENT PRICE */}

                    <div className="wishlist-current-price">
                      ₹
                      {formatPrice(
                        item.current_price
                      )}
                    </div>

                    {/* PRICE DETAILS */}

                    <div className="wishlist-price-details">
                      <div>
                        <span>
                          Price when added
                        </span>

                        <strong>
                          ₹
                          {formatPrice(
                            item.price_when_added
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Current price
                        </span>

                        <strong>
                          ₹
                          {formatPrice(
                            item.current_price
                          )}
                        </strong>
                      </div>
                    </div>

                    {/* CHANGE */}

                    <div className="wishlist-change-area">
                      {renderPriceChange(
                        item
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="wishlist-card-actions">
                    <button
                      type="button"
                      className="wishlist-view-button"
                      onClick={() =>
                        viewProduct(
                          item.product_id
                        )
                      }
                    >
                      <Eye size={16} />

                      View Product
                    </button>

                    <button
                      type="button"
                      className="wishlist-remove-button"
                      onClick={() =>
                        removeFromWishlist(
                          item.product_id
                        )
                      }
                    >
                      <Trash2
                        size={16}
                      />

                      Remove
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default BuyerWishlist;