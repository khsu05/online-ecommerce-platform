import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Boxes,
} from "lucide-react";

import AppLayout from "../../components/AppLayout";

import {
  SELLER_ID,
} from "../../config/userIds";

function SellerInventoryProduct() {
  const {
    productId,
  } = useParams();

  const navigate =
    useNavigate();

  const [
    product,
    setProduct,
  ] = useState(null);

  const [
    inventoryQuantity,
    setInventoryQuantity,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const API_URL =
    "http://localhost:5000/api/products";

  useEffect(() => {
    const fetchProduct =
      async () => {
        try {
          const response =
            await fetch(
              `${API_URL}/seller/${SELLER_ID}`
            );

          const data =
            await response.json();

          if (!response.ok) {
            setMessage(
              data.message ||
                "Failed to load product"
            );

            return;
          }

          const foundProduct =
            data.find(
              (item) =>
                Number(item.id) ===
                Number(productId)
            );

          if (!foundProduct) {
            setMessage(
              "Product not found"
            );

            return;
          }

          setProduct(
            foundProduct
          );

          setInventoryQuantity(
            foundProduct.inventory_quantity
          );
        } catch (error) {
          console.error(error);

          setMessage(
            "Failed to load product"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProduct();
  }, [productId]);

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      try {
        const response =
          await fetch(
            `${API_URL}/seller/${SELLER_ID}/product/${productId}/inventory`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  inventory_quantity:
                    Number(
                      inventoryQuantity
                    ),
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setMessage(
            data.message ||
              "Failed to update inventory"
          );

          return;
        }

        navigate(
          "/seller/products"
        );
      } catch (error) {
        console.error(error);

        setMessage(
          "Failed to update inventory"
        );
      }
    };

  return (
    <AppLayout
      role="seller"
      title="Update Inventory"
      subtitle="Manage the available quantity for this product."
    >
      <div className="management-page">
        <button
          type="button"
          className="product-back-button"
          onClick={() =>
            navigate(
              "/seller/products"
            )
          }
        >
          <ArrowLeft
            size={17}
          />

          Back to Products
        </button>

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {loading ? (
          <div className="seller-edit-section">
            Loading product...
          </div>
        ) : product ? (
          <section className="seller-edit-section">
            <div className="seller-edit-header">
              <div>
                <span>
                  Inventory Management
                </span>

                <h2>
                  Update Inventory
                </h2>

                <p>
                  Change the available
                  quantity for this
                  product.
                </p>
              </div>
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
                    {product.name}
                  </strong>

                  <small>
                    Current stock:{" "}
                    {
                      product.inventory_quantity
                    }
                  </small>
                </div>
              </div>

              <form
                className="management-form seller-inventory-form"
                onSubmit={
                  handleSubmit
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
                        event.target
                          .value
                      )
                    }
                    min="0"
                    step="1"
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
                    onClick={() =>
                      navigate(
                        "/seller/products"
                      )
                    }
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </section>
        ) : null}
      </div>
    </AppLayout>
  );
}

export default SellerInventoryProduct;