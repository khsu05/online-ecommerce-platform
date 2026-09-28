import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Heart,
  Package,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import AppLayout from "../../components/AppLayout";
import { BUYER_ID } from "../../config/userIds";

function ProductDetails() {
  const { productId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const buyerId = BUYER_ID;

  const [product, setProduct] =
    useState(
      location.state?.product || null
    );

  const [loading, setLoading] =
    useState(!location.state?.product);

  const [toast, setToast] =
    useState(null);

  // --------------------------------------------
  // PRICE FORMAT
  // --------------------------------------------

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // --------------------------------------------
  // TOAST
  // --------------------------------------------

  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  // --------------------------------------------
  // LOAD PRODUCT IF PAGE REFRESHES
  // --------------------------------------------

  useEffect(() => {
    if (product) {
      return;
    }

    const loadProduct =
      async () => {
        try {
          const response =
            await fetch(
              "http://localhost:5000/api/products/browse"
            );

          const data =
            await response.json();

          const foundProduct =
            data.find(
              (item) =>
                Number(item.id) ===
                Number(productId)
            );

          setProduct(
            foundProduct || null
          );
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    loadProduct();
  }, [productId, product]);

  // --------------------------------------------
  // ADD TO WISHLIST
  // --------------------------------------------

  const addToWishlist =
    async () => {
      if (!product) {
        return;
      }

      try {
        const response =
          await fetch(
            `http://localhost:5000/api/wishlist/buyer/${buyerId}/product/${product.id}`,
            {
              method: "POST",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          showToast(
            data.message ||
              "Failed to add to wishlist",
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
          "Failed to add to wishlist",
          "error"
        );
      }
    };

  // --------------------------------------------
  // LOADING
  // --------------------------------------------

  if (loading) {
    return (
      <AppLayout
        role="buyer"
        title="Product Details"
        subtitle="Loading product information."
      >
        <div className="management-page">
          <div className="management-section">
            Loading product...
          </div>
        </div>
      </AppLayout>
    );
  }

  // --------------------------------------------
  // NOT FOUND
  // --------------------------------------------

  if (!product) {
    return (
      <AppLayout
        role="buyer"
        title="Product Details"
        subtitle="Product information."
      >
        <div className="management-page">
          <div className="management-section product-not-found">
            <Package size={42} />

            <h2>
              Product not found
            </h2>

            <button
              className="primary-button"
              onClick={() =>
                navigate(
                  "/buyer/products"
                )
              }
            >
              Back to Products
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const inventory = Number(
    product.inventory_quantity
  );

  return (
    <AppLayout
      role="buyer"
      title="Product Details"
      subtitle="View complete information about this product."
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
        {/* BACK */}

        <button
          type="button"
          className="product-back-button"
          onClick={() =>
            navigate(
              "/buyer/products"
            )
          }
        >
          <ArrowLeft size={18} />

          Back to Products
        </button>

        {/* PRODUCT */}

        <div className="product-page-card">
          {/* IMAGE SIDE */}

          <div className="product-page-image-area">
            <img
              src={
                product.image_url ||
                "/products/placeholder.jpg"
              }
              alt={product.name}
              onError={(event) => {
                event.currentTarget.onerror =
                  null;

                event.currentTarget.src =
                  "/products/placeholder.jpg";
              }}
            />
          </div>

          {/* INFORMATION SIDE */}

          <div className="product-page-info">
            <span className="product-page-category">
              Product
            </span>

            <h1>
              {product.name}
            </h1>

            <p className="product-page-description">
              {product.description}
            </p>

            <div className="product-page-price">
              ₹
              {formatPrice(
                product.price
              )}
            </div>

            <div className="product-page-stock">
              {inventory <= 0 ? (
                <span className="stock-badge out-of-stock-badge">
                  Out of Stock
                </span>
              ) : inventory <= 5 ? (
                <span className="stock-badge low-stock-badge">
                  Only {inventory} left
                </span>
              ) : (
                <span className="stock-badge">
                  In Stock: {inventory}
                </span>
              )}
            </div>

            <div className="product-page-divider" />

            <div className="product-information-row">
              <span>
                Product ID
              </span>

              <strong>
                #{product.id}
              </strong>
            </div>

            <div className="product-information-row">
              <span>
                Available Quantity
              </span>

              <strong>
                {inventory}
              </strong>
            </div>

            {/* ACTION */}

            <div className="product-page-actions">
              <button
                type="button"
                className="product-page-wishlist"
                onClick={
                  addToWishlist
                }
              >
                <Heart size={19} />

                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default ProductDetails;