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
  Package,
} from "lucide-react";

import AppLayout from "../../components/AppLayout";

import {
  SELLER_ID,
} from "../../config/userIds";

function SellerEditProduct() {
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
    formData,
    setFormData,
  ] = useState({
    name: "",
    description: "",
    price: "",
  });

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

          setFormData({
            name:
              foundProduct.name,
            description:
              foundProduct.description,
            price:
              foundProduct.price,
          });
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

  const handleChange = (
    event
  ) => {
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

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      try {
        const response =
          await fetch(
            `${API_URL}/${productId}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  name:
                    formData.name,

                  description:
                    formData.description,

                  price:
                    Number(
                      formData.price
                    ),
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setMessage(
            data.message ||
              "Failed to update product"
          );

          return;
        }

        navigate(
          "/seller/products"
        );
      } catch (error) {
        console.error(error);

        setMessage(
          "Failed to update product"
        );
      }
    };

  return (
    <AppLayout
      role="seller"
      title="Edit Product"
      subtitle="Update product information and pricing."
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
                  Product Management
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
            </div>

            <div className="seller-edit-layout">
              <div className="seller-edit-preview">
                <div className="seller-edit-preview-image">
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
                      size={46}
                    />
                  )}
                </div>

                <strong>
                  {product.name}
                </strong>

                <span>
                  Product #
                  {product.id}
                </span>
              </div>

              <form
                className="management-form seller-edit-form"
                onSubmit={
                  handleSubmit
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
                      formData.name
                    }
                    onChange={
                      handleChange
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
                      formData.description
                    }
                    onChange={
                      handleChange
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
                      formData.price
                    }
                    onChange={
                      handleChange
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

export default SellerEditProduct;