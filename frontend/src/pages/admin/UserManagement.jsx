import { useEffect, useState } from "react";

import {
  Users,
  UserPlus,
  UserRound,
  Store,
  ShieldCheck,
  Pencil,
  Trash2,
  X,
  Mail,
} from "lucide-react";

import AppLayout from "../../components/AppLayout";

function UserManagement() {
  // =====================================================
  // STATE
  // =====================================================

  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "buyer",
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const API_URL =
    "http://localhost:5000/api/users";

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to load users"
        );

        return;
      }

      setUsers(data);
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to load users"
      );
    }
  };

  useEffect(() => {
    fetchUsers();
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
  // ADD / UPDATE USER
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const url =
        editingId !== null
          ? `${API_URL}/${editingId}`
          : API_URL;

      const method =
        editingId !== null
          ? "PUT"
          : "POST";

      const response = await fetch(
        url,
        {
          method,

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            formData
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to save user"
        );

        return;
      }

      setMessage(
        data.message
      );

      setFormData({
        name: "",
        email: "",
        role: "buyer",
      });

      setEditingId(null);

      fetchUsers();
    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong"
      );
    }
  };

  // =====================================================
  // EDIT USER
  // =====================================================

  const handleEdit = (user) => {
    setEditingId(user.id);

    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    setMessage("");
  };

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      setMessage(
        data.message
      );

      if (response.ok) {
        if (
          Number(editingId) ===
          Number(id)
        ) {
          cancelEdit();
        }

        fetchUsers();
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to delete user"
      );
    }
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEdit = () => {
    setEditingId(null);

    setFormData({
      name: "",
      email: "",
      role: "buyer",
    });

    setMessage("");
  };

  // =====================================================
  // COUNTS
  // =====================================================

  const adminCount =
    users.filter(
      (user) =>
        user.role === "admin"
    ).length;

  const sellerCount =
    users.filter(
      (user) =>
        user.role === "seller"
    ).length;

  const buyerCount =
    users.filter(
      (user) =>
        user.role === "buyer"
    ).length;

  // =====================================================
  // ROLE ICON
  // =====================================================

  const getRoleIcon = (role) => {
    if (role === "admin") {
      return (
        <ShieldCheck
          size={17}
        />
      );
    }

    if (role === "seller") {
      return (
        <Store size={17} />
      );
    }

    return (
      <UserRound size={17} />
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <AppLayout
      role="admin"
      title="User Management"
      subtitle="Manage user accounts and platform roles."
    >
      <div className="management-page admin-users-page">
        {/* MESSAGE */}

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {/* ==========================================
            SUMMARY
        ========================================== */}

        <div className="admin-user-summary">
          <div className="admin-user-summary-card">
            <div className="admin-user-summary-icon">
              <Users size={21} />
            </div>

            <div>
              <span>
                Total Users
              </span>

              <strong>
                {users.length}
              </strong>
            </div>
          </div>

          <div className="admin-user-summary-card">
            <div className="admin-user-summary-icon">
              <ShieldCheck
                size={21}
              />
            </div>

            <div>
              <span>
                Admins
              </span>

              <strong>
                {adminCount}
              </strong>
            </div>
          </div>

          <div className="admin-user-summary-card">
            <div className="admin-user-summary-icon">
              <Store size={21} />
            </div>

            <div>
              <span>
                Sellers
              </span>

              <strong>
                {sellerCount}
              </strong>
            </div>
          </div>

          <div className="admin-user-summary-card">
            <div className="admin-user-summary-icon">
              <UserRound
                size={21}
              />
            </div>

            <div>
              <span>
                Buyers
              </span>

              <strong>
                {buyerCount}
              </strong>
            </div>
          </div>
        </div>

        {/* ==========================================
            ADD / EDIT USER
        ========================================== */}

        <section className="admin-user-section">
          <div className="admin-user-section-header">
            <div className="admin-user-section-title">
              <div className="admin-user-section-icon">
                {editingId !== null ? (
                  <Pencil
                    size={20}
                  />
                ) : (
                  <UserPlus
                    size={20}
                  />
                )}
              </div>

              <div>
                <h2>
                  {editingId !== null
                    ? "Edit User"
                    : "Add User"}
                </h2>

                <p>
                  {editingId !== null
                    ? "Update the selected user's name, email, or role."
                    : "Create a new user account with the required role."}
                </p>
              </div>
            </div>

            {editingId !== null && (
              <button
                type="button"
                className="admin-user-close-button"
                onClick={
                  cancelEdit
                }
                aria-label="Cancel editing"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="admin-user-form-area">
            <form
              className="admin-user-form"
              onSubmit={
                handleSubmit
              }
            >
              {/* NAME */}

              <div className="form-group">
                <label>
                  Name
                </label>

                <div className="admin-user-input-icon">
                  <UserRound
                    size={17}
                  />

                  <input
                    type="text"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter user name"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div className="form-group">
                <label>
                  Email
                </label>

                <div className="admin-user-input-icon">
                  <Mail size={17} />

                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              {/* ROLE */}

              <div className="form-group">
                <label>
                  Role
                </label>

                <select
                  name="role"
                  value={
                    formData.role
                  }
                  onChange={
                    handleChange
                  }
                  required
                >
                  <option value="admin">
                    Admin
                  </option>

                  <option value="seller">
                    Seller
                  </option>

                  <option value="buyer">
                    Buyer
                  </option>
                </select>
              </div>

              {/* BUTTONS */}

              <div className="admin-user-form-buttons">
                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingId !== null ? (
                    <>
                      <Pencil
                        size={16}
                      />

                      Update User
                    </>
                  ) : (
                    <>
                      <UserPlus
                        size={16}
                      />

                      Add User
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
            USER ACCOUNTS
        ========================================== */}

        <section className="admin-user-section">
          <div className="admin-user-section-header">
            <div className="admin-user-section-title">
              <div className="admin-user-section-icon">
                <Users size={20} />
              </div>

              <div>
                <h2>
                  User Accounts
                </h2>

                <p>
                  {users.length}{" "}
                  user
                  {users.length === 1
                    ? ""
                    : "s"}{" "}
                  currently registered
                </p>
              </div>
            </div>
          </div>

          <div className="admin-users-table-wrapper">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>
                    ID
                  </th>

                  <th>
                    User
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="admin-users-empty"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map(
                    (user) => (
                      <tr
                        key={
                          user.id
                        }
                      >
                        {/* ID */}

                        <td>
                          #
                          {
                            user.id
                          }
                        </td>

                        {/* NAME */}

                        <td>
                          <div className="admin-user-table-name">
                            <div className="admin-user-avatar">
                              {getRoleIcon(
                                user.role
                              )}
                            </div>

                            <strong>
                              {
                                user.name
                              }
                            </strong>
                          </div>
                        </td>

                        {/* EMAIL */}

                        <td>
                          <span className="admin-user-email">
                            {
                              user.email
                            }
                          </span>
                        </td>

                        {/* ROLE */}

                        <td>
                          <span
                            className={`admin-role-badge admin-role-${user.role}`}
                          >
                            {getRoleIcon(
                              user.role
                            )}

                            {
                              user.role
                            }
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="admin-user-actions">
                            <button
                              type="button"
                              className="admin-user-edit-button"
                              onClick={() =>
                                handleEdit(
                                  user
                                )
                              }
                              title="Edit user"
                            >
                              <Pencil
                                size={15}
                              />

                              Edit
                            </button>

                            <button
                              type="button"
                              className="admin-user-delete-button"
                              onClick={() =>
                                handleDelete(
                                  user.id
                                )
                              }
                              title="Delete user"
                            >
                              <Trash2
                                size={15}
                              />

                              Delete
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

export default UserManagement;