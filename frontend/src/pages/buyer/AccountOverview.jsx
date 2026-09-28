import { useEffect, useState } from "react";

import {
  User,
  Mail,
  CreditCard,
  WalletCards,
  MapPin,
  Home,
  Pencil,
  Trash2,
  Plus,
  X,
  ShieldCheck,
} from "lucide-react";

import { BUYER_ID } from "../../config/userIds";
import AppLayout from "../../components/AppLayout";

// =====================================================
// CARD PROVIDER DETECTION
// =====================================================

const detectCardProvider = (cardNumber) => {
  const number =
    cardNumber.replace(/\D/g, "");

  // Visa
  if (/^4/.test(number)) {
    return "Visa";
  }

  // Mastercard 51-55
  if (/^5[1-5]/.test(number)) {
    return "Mastercard";
  }

  // Mastercard 2221-2720
  if (number.length >= 4) {
    const firstFour = Number(
      number.slice(0, 4)
    );

    if (
      firstFour >= 2221 &&
      firstFour <= 2720
    ) {
      return "Mastercard";
    }
  }

  // American Express
  if (/^3[47]/.test(number)) {
    return "American Express";
  }

  if (number.length > 0) {
    return "Other Card";
  }

  return "";
};

function AccountOverview() {
  const buyerId = BUYER_ID;

  // =====================================================
  // API URLS
  // =====================================================

  const USER_API =
    `http://localhost:5000/api/users/${buyerId}/profile`;

  const ADDRESS_API =
    `http://localhost:5000/api/addresses/buyer/${buyerId}`;

  const PAYMENT_API =
    `http://localhost:5000/api/payment-methods/buyer/${buyerId}`;

  const [message, setMessage] =
    useState("");

  // =====================================================
  // PERSONAL DETAILS
  // =====================================================

  const [profile, setProfile] =
    useState({
      name: "",
      email: "",
    });

  const fetchProfile = async () => {
    try {
      const response =
        await fetch(USER_API);

      const data =
        await response.json();

      if (response.ok) {
        setProfile({
          name: data.name,
          email: data.email,
        });
      } else {
        setMessage(
          data.message ||
            "Failed to load personal details"
        );
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to load personal details"
      );
    }
  };

  const updateProfile =
    async (event) => {
      event.preventDefault();

      try {
        const response =
          await fetch(
            USER_API,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                profile
              ),
            }
          );

        const data =
          await response.json();

        setMessage(
          data.message
        );
      } catch (error) {
        console.error(error);

        setMessage(
          "Failed to update personal details"
        );
      }
    };

  // =====================================================
  // ADDRESS BOOK
  // =====================================================

  const emptyAddressForm = {
    address_line: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  };

  const [
    addresses,
    setAddresses,
  ] = useState([]);

  const [
    addressForm,
    setAddressForm,
  ] = useState(
    emptyAddressForm
  );

  const [
    editingAddressId,
    setEditingAddressId,
  ] = useState(null);

  const fetchAddresses =
    async () => {
      try {
        const response =
          await fetch(
            ADDRESS_API
          );

        const data =
          await response.json();

        if (response.ok) {
          setAddresses(data);
        } else {
          setMessage(
            data.message ||
              "Failed to load addresses"
          );
        }
      } catch (error) {
        console.error(error);

        setMessage(
          "Failed to load addresses"
        );
      }
    };

  const handleAddressChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setAddressForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  const submitAddress =
    async (event) => {
      event.preventDefault();

      try {
        const url =
          editingAddressId
            ? `${ADDRESS_API}/${editingAddressId}`
            : ADDRESS_API;

        const method =
          editingAddressId
            ? "PUT"
            : "POST";

        const response =
          await fetch(url, {
            method,

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              addressForm
            ),
          });

        const data =
          await response.json();

        setMessage(
          data.message
        );

        if (response.ok) {
          setAddressForm(
            emptyAddressForm
          );

          setEditingAddressId(
            null
          );

          fetchAddresses();
        }
      } catch (error) {
        console.error(error);

        setMessage(
          "Failed to save address"
        );
      }
    };

  const editAddress = (
    address
  ) => {
    setEditingAddressId(
      address.id
    );

    setAddressForm({
      address_line:
        address.address_line,
      city: address.city,
      state: address.state,
      postal_code:
        address.postal_code,
      country:
        address.country,
    });

    setMessage("");
  };

  const deleteAddress =
    async (addressId) => {
      const confirmed =
        window.confirm(
          "Delete this address?"
        );

      if (!confirmed) {
        return;
      }

      try {
        const response =
          await fetch(
            `${ADDRESS_API}/${addressId}`,
            {
              method:
                "DELETE",
            }
          );

        const data =
          await response.json();

        setMessage(
          data.message
        );

        if (response.ok) {
          fetchAddresses();
        }
      } catch (error) {
        console.error(error);

        setMessage(
          "Failed to delete address"
        );
      }
    };

  const cancelAddressEdit =
    () => {
      setEditingAddressId(
        null
      );

      setAddressForm(
        emptyAddressForm
      );

      setMessage("");
    };

  // =====================================================
  // PAYMENT METHODS
  // =====================================================

  const emptyPaymentForm = {
    method_type: "COD",
    card_number: "",
  };

  const [
    paymentMethods,
    setPaymentMethods,
  ] = useState([]);

  const [
    paymentForm,
    setPaymentForm,
  ] = useState(
    emptyPaymentForm
  );

  const [
    editingPaymentId,
    setEditingPaymentId,
  ] = useState(null);

  const fetchPaymentMethods =
    async () => {
      try {
        const response =
          await fetch(
            PAYMENT_API
          );

        const data =
          await response.json();

        if (response.ok) {
          setPaymentMethods(
            data
          );
        } else {
          setMessage(
            data.message ||
              "Failed to load payment methods"
          );
        }
      } catch (error) {
        console.error(error);

        setMessage(
          "Failed to load payment methods"
        );
      }
    };

  const handlePaymentChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    // Payment type changed
    if (
      name ===
      "method_type"
    ) {
      setPaymentForm({
        method_type:
          value,
        card_number: "",
      });

      return;
    }

    // Card number
    if (
      name ===
      "card_number"
    ) {
      const digitsOnly =
        value
          .replace(
            /\D/g,
            ""
          )
          .slice(
            0,
            19
          );

      setPaymentForm(
        (previous) => ({
          ...previous,

          card_number:
            digitsOnly,
        })
      );
    }
  };

  const submitPaymentMethod =
    async (event) => {
      event.preventDefault();

      const methodType =
        paymentForm.method_type;

      const isCard =
        methodType ===
        "Card";

      const cardDigits =
        paymentForm.card_number.replace(
          /\D/g,
          ""
        );

      let provider = "";
      let maskedDetails =
        null;

      // ---------------------------------
      // CARD
      // ---------------------------------

      if (isCard) {
        /*
          During edit, an empty card field
          means keep the existing masked card.
        */

        if (
          !cardDigits &&
          editingPaymentId
        ) {
          const existingPayment =
            paymentMethods.find(
              (
                payment
              ) =>
                payment.id ===
                editingPaymentId
            );

          provider =
            existingPayment?.provider ||
            "";

          maskedDetails =
            existingPayment
              ?.masked_details ||
            null;
        } else {
          if (
            cardDigits.length <
              12 ||
            cardDigits.length >
              19
          ) {
            setMessage(
              "Please enter a valid card number"
            );

            return;
          }

          provider =
            detectCardProvider(
              cardDigits
            );

          const lastFour =
            cardDigits.slice(
              -4
            );

          maskedDetails =
            `**** **** **** ${lastFour}`;
        }
      }

      // ---------------------------------
      // COD
      // ---------------------------------

      if (
        methodType ===
        "COD"
      ) {
        provider =
          "Cash on Delivery";

        maskedDetails =
          null;
      }

      // ---------------------------------
      // EMI
      // ---------------------------------

      if (
        methodType ===
        "EMI"
      ) {
        provider = "EMI";

        maskedDetails =
          null;
      }

      const paymentData = {
        method_type:
          methodType,

        provider,

        masked_details:
          maskedDetails,
      };

      try {
        const url =
          editingPaymentId
            ? `${PAYMENT_API}/${editingPaymentId}`
            : PAYMENT_API;

        const method =
          editingPaymentId
            ? "PUT"
            : "POST";

        const response =
          await fetch(
            url,
            {
              method,

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  paymentData
                ),
            }
          );

        const data =
          await response.json();

        setMessage(
          data.message
        );

        if (response.ok) {
          setPaymentForm(
            emptyPaymentForm
          );

          setEditingPaymentId(
            null
          );

          fetchPaymentMethods();
        }
      } catch (error) {
        console.error(error);

        setMessage(
          "Failed to save payment method"
        );
      }
    };

  const editPaymentMethod =
    (payment) => {
      setEditingPaymentId(
        payment.id
      );

      setPaymentForm({
        method_type:
          payment.method_type,

        card_number: "",
      });

      setMessage("");
    };

  const deletePaymentMethod =
    async (
      paymentId
    ) => {
      const confirmed =
        window.confirm(
          "Delete this payment method?"
        );

      if (!confirmed) {
        return;
      }

      try {
        const response =
          await fetch(
            `${PAYMENT_API}/${paymentId}`,
            {
              method:
                "DELETE",
            }
          );

        const data =
          await response.json();

        setMessage(
          data.message
        );

        if (response.ok) {
          fetchPaymentMethods();
        }
      } catch (error) {
        console.error(error);

        setMessage(
          "Failed to delete payment method"
        );
      }
    };

  const cancelPaymentEdit =
    () => {
      setEditingPaymentId(
        null
      );

      setPaymentForm(
        emptyPaymentForm
      );

      setMessage("");
    };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
    fetchPaymentMethods();
  }, []);

  // =====================================================
  // UI
  // =====================================================

  return (
    <AppLayout
      role="buyer"
      title="Account Overview"
      subtitle="Manage your personal details, payment methods, and address book."
    >
      <div className="management-page account-overview-page">
        {/* MESSAGE */}

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {/* ==========================================
            PERSONAL DETAILS
        ========================================== */}

        <section className="account-section">
          <div className="account-section-header">
            <div className="account-section-title">
              <div className="account-section-icon">
                <User
                  size={21}
                />
              </div>

              <div>
                <h2>
                  Personal Details
                </h2>

                <p>
                  Manage your basic
                  account information.
                </p>
              </div>
            </div>
          </div>

          <div className="account-section-body">
            <form
              className="account-profile-form"
              onSubmit={
                updateProfile
              }
            >
              <div className="form-group">
                <label>
                  Name
                </label>

                <div className="account-input-with-icon">
                  <User
                    size={17}
                  />

                  <input
                    type="text"
                    value={
                      profile.name
                    }
                    onChange={(
                      event
                    ) =>
                      setProfile(
                        (
                          previous
                        ) => ({
                          ...previous,

                          name:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  Email
                </label>

                <div className="account-input-with-icon">
                  <Mail
                    size={17}
                  />

                  <input
                    type="email"
                    value={
                      profile.email
                    }
                    onChange={(
                      event
                    ) =>
                      setProfile(
                        (
                          previous
                        ) => ({
                          ...previous,

                          email:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    required
                  />
                </div>
              </div>

              <div className="account-form-action">
                <button
                  type="submit"
                  className="primary-button"
                >
                  Update Personal Details
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ==========================================
            PAYMENT METHODS
        ========================================== */}

        <section className="account-section">
          <div className="account-section-header">
            <div className="account-section-title">
              <div className="account-section-icon">
                <WalletCards
                  size={21}
                />
              </div>

              <div>
                <h2>
                  Payment Methods
                </h2>

                <p>
                  Manage payment
                  options saved to your
                  account.
                </p>
              </div>
            </div>
          </div>

          <div className="account-section-body">
            <div className="account-two-column-layout">
              {/* PAYMENT FORM */}

              <div className="account-form-card">
                <div className="account-subheading">
                  <div>
                    <h3>
                      {editingPaymentId
                        ? "Edit Payment Method"
                        : "Add Payment Method"}
                    </h3>

                    <p>
                      Choose COD,
                      Card, or EMI.
                    </p>
                  </div>

                  {editingPaymentId && (
                    <button
                      type="button"
                      className="account-small-close"
                      onClick={
                        cancelPaymentEdit
                      }
                    >
                      <X
                        size={17}
                      />
                    </button>
                  )}
                </div>

                <form
                  className="management-form account-inner-form"
                  onSubmit={
                    submitPaymentMethod
                  }
                >
                  <div className="form-group">
                    <label>
                      Method Type
                    </label>

                    <select
                      name="method_type"
                      value={
                        paymentForm.method_type
                      }
                      onChange={
                        handlePaymentChange
                      }
                    >
                      <option value="COD">
                        Cash on Delivery
                      </option>

                      <option value="Card">
                        Card
                      </option>

                      <option value="EMI">
                        EMI
                      </option>
                    </select>
                  </div>

                  {paymentForm.method_type ===
                    "Card" && (
                    <div className="form-group">
                      <label>
                        Card Number
                      </label>

                      <div className="account-input-with-icon">
                        <CreditCard
                          size={17}
                        />

                        <input
                          type="text"
                          name="card_number"
                          value={
                            paymentForm.card_number
                          }
                          onChange={
                            handlePaymentChange
                          }
                          inputMode="numeric"
                          placeholder={
                            editingPaymentId
                              ? "Leave blank to keep current card"
                              : "Enter test card number"
                          }
                        />
                      </div>

                      {paymentForm.card_number && (
                        <div className="card-provider-preview">
                          <ShieldCheck
                            size={14}
                          />

                          <span>
                            {detectCardProvider(
                              paymentForm.card_number
                            ) ||
                              "Card"}
                          </span>
                        </div>
                      )}

                      <small className="account-help-text">
                        Only the
                        masked last four
                        digits are saved.
                        Use test/dummy
                        card details for
                        this project.
                      </small>
                    </div>
                  )}

                  {paymentForm.method_type ===
                    "COD" && (
                    <div className="payment-method-note">
                      <WalletCards
                        size={18}
                      />

                      <div>
                        <strong>
                          Cash on
                          Delivery
                        </strong>

                        <span>
                          No card
                          information is
                          required.
                        </span>
                      </div>
                    </div>
                  )}

                  {paymentForm.method_type ===
                    "EMI" && (
                    <div className="payment-method-note">
                      <CreditCard
                        size={18}
                      />

                      <div>
                        <strong>
                          EMI
                        </strong>

                        <span>
                          EMI payment
                          method will be
                          saved to your
                          account.
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="form-buttons">
                    <button
                      type="submit"
                      className="primary-button"
                    >
                      <Plus
                        size={16}
                      />

                      {editingPaymentId
                        ? "Update Payment Method"
                        : "Add Payment Method"}
                    </button>

                    {editingPaymentId && (
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={
                          cancelPaymentEdit
                        }
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* SAVED PAYMENTS */}

              <div className="account-list-area">
                <div className="account-subheading">
                  <div>
                    <h3>
                      Saved Methods
                    </h3>

                    <p>
                      {
                        paymentMethods.length
                      }{" "}
                      payment
                      {paymentMethods.length ===
                      1
                        ? ""
                        : "s"}{" "}
                      saved
                    </p>
                  </div>
                </div>

                {paymentMethods.length ===
                0 ? (
                  <div className="account-empty-list">
                    <CreditCard
                      size={28}
                    />

                    <span>
                      No payment
                      methods saved.
                    </span>
                  </div>
                ) : (
                  <div className="account-card-list">
                    {paymentMethods.map(
                      (
                        payment
                      ) => (
                        <div
                          key={
                            payment.id
                          }
                          className="saved-payment-card"
                        >
                          <div className="saved-item-icon">
                            <CreditCard
                              size={20}
                            />
                          </div>

                          <div className="saved-item-content">
                            <strong>
                              {
                                payment.method_type
                              }
                            </strong>

                            <span>
                              {payment.provider ||
                                "Payment Method"}
                            </span>

                            {payment.masked_details && (
                              <small>
                                {
                                  payment.masked_details
                                }
                              </small>
                            )}
                          </div>

                          <div className="saved-item-actions">
                            <button
                              type="button"
                              className="saved-edit-button"
                              onClick={() =>
                                editPaymentMethod(
                                  payment
                                )
                              }
                              title="Edit"
                            >
                              <Pencil
                                size={15}
                              />
                            </button>

                            <button
                              type="button"
                              className="saved-delete-button"
                              onClick={() =>
                                deletePaymentMethod(
                                  payment.id
                                )
                              }
                              title="Delete"
                            >
                              <Trash2
                                size={15}
                              />
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            ADDRESS BOOK
        ========================================== */}

        <section className="account-section">
          <div className="account-section-header">
            <div className="account-section-title">
              <div className="account-section-icon">
                <MapPin
                  size={21}
                />
              </div>

              <div>
                <h2>
                  Address Book
                </h2>

                <p>
                  Manage your saved
                  delivery addresses.
                </p>
              </div>
            </div>
          </div>

          <div className="account-section-body">
            <div className="account-two-column-layout">
              {/* ADDRESS FORM */}

              <div className="account-form-card">
                <div className="account-subheading">
                  <div>
                    <h3>
                      {editingAddressId
                        ? "Edit Address"
                        : "Add Address"}
                    </h3>

                    <p>
                      Enter your
                      address details.
                    </p>
                  </div>

                  {editingAddressId && (
                    <button
                      type="button"
                      className="account-small-close"
                      onClick={
                        cancelAddressEdit
                      }
                    >
                      <X
                        size={17}
                      />
                    </button>
                  )}
                </div>

                <form
                  className="management-form account-inner-form"
                  onSubmit={
                    submitAddress
                  }
                >
                  <div className="form-group">
                    <label>
                      Address
                    </label>

                    <input
                      type="text"
                      name="address_line"
                      value={
                        addressForm.address_line
                      }
                      onChange={
                        handleAddressChange
                      }
                      placeholder="Street address"
                      required
                    />
                  </div>

                  <div className="account-address-row">
                    <div className="form-group">
                      <label>
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={
                          addressForm.city
                        }
                        onChange={
                          handleAddressChange
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        State
                      </label>

                      <input
                        type="text"
                        name="state"
                        value={
                          addressForm.state
                        }
                        onChange={
                          handleAddressChange
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="account-address-row">
                    <div className="form-group">
                      <label>
                        Postal Code
                      </label>

                      <input
                        type="text"
                        name="postal_code"
                        value={
                          addressForm.postal_code
                        }
                        onChange={
                          handleAddressChange
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Country
                      </label>

                      <input
                        type="text"
                        name="country"
                        value={
                          addressForm.country
                        }
                        onChange={
                          handleAddressChange
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-buttons">
                    <button
                      type="submit"
                      className="primary-button"
                    >
                      <Plus
                        size={16}
                      />

                      {editingAddressId
                        ? "Update Address"
                        : "Add Address"}
                    </button>

                    {editingAddressId && (
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={
                          cancelAddressEdit
                        }
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* SAVED ADDRESSES */}

              <div className="account-list-area">
                <div className="account-subheading">
                  <div>
                    <h3>
                      Saved Addresses
                    </h3>

                    <p>
                      {
                        addresses.length
                      }{" "}
                      address
                      {addresses.length ===
                      1
                        ? ""
                        : "es"}{" "}
                      saved
                    </p>
                  </div>
                </div>

                {addresses.length ===
                0 ? (
                  <div className="account-empty-list">
                    <MapPin
                      size={28}
                    />

                    <span>
                      No addresses
                      saved.
                    </span>
                  </div>
                ) : (
                  <div className="account-card-list">
                    {addresses.map(
                      (
                        address
                      ) => (
                        <div
                          key={
                            address.id
                          }
                          className="saved-address-card"
                        >
                          <div className="saved-item-icon">
                            <Home
                              size={20}
                            />
                          </div>

                          <div className="saved-item-content">
                            <strong>
                              {
                                address.address_line
                              }
                            </strong>

                            <span>
                              {
                                address.city
                              }
                              ,{" "}
                              {
                                address.state
                              }
                            </span>

                            <small>
                              {
                                address.postal_code
                              }
                              ,{" "}
                              {
                                address.country
                              }
                            </small>
                          </div>

                          <div className="saved-item-actions">
                            <button
                              type="button"
                              className="saved-edit-button"
                              onClick={() =>
                                editAddress(
                                  address
                                )
                              }
                              title="Edit"
                            >
                              <Pencil
                                size={15}
                              />
                            </button>

                            <button
                              type="button"
                              className="saved-delete-button"
                              onClick={() =>
                                deleteAddress(
                                  address.id
                                )
                              }
                              title="Delete"
                            >
                              <Trash2
                                size={15}
                              />
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default AccountOverview;