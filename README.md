# Online E-commerce Platform

A full-stack e-commerce platform built with **React + Vite**, **Node.js + Express**, and **MySQL**.

The system supports three user roles:

- **Admin** — manages users, products, orders, and system activity
- **Seller** — manages products, inventory, orders, and sales performance
- **Buyer** — browses products, purchases products, tracks orders, manages wishlist, addresses, payment methods, and account details

> This project follows the college project specification. Role selection is used to enter the Admin, Seller, or Buyer portal. Password-based authentication is not included in the current project scope.

---

## Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Lucide React
- CSS

### Backend

- Node.js
- Express.js
- MySQL
- CORS
- dotenv

### Database

- MySQL
- Database name: `ecommerce_db`

---

## Project Structure

```text
online-ecommerce-platform/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── products/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── AppLayout.jsx
│   │   ├── config/
│   │   │   └── userIds.js
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── seller/
│   │   │   ├── buyer/
│   │   │   └── RoleSelection.jsx
│   │   ├── services/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

# Features

## Admin Portal

### Admin Dashboard

Displays live platform information using the existing APIs:

- Total users
- Total products
- Total orders
- System activity records

### User Management

Admin can:

- View users
- Create users
- Update users
- Delete users
- Manage user role:
  - Admin
  - Seller
  - Buyer

User data includes:

- Name
- Email
- Role

### Product Management

Admin can:

- View marketplace products
- Create products for a seller
- Update product information
- Delete products

Product information includes:

- Product name
- Description
- Price
- Inventory quantity
- Product image

### Order Management

Admin can:

- View all orders
- View order items
- Update order status

Supported statuses:

- `Pending`
- `Processing`
- `Fulfilled`

### System Activity Monitoring

Admin can:

- View recent system activities
- View activity ID
- View user information
- View activity description
- View activity date and time

The System Activity page automatically refreshes every **5 seconds**.

---

# Seller Portal

## Seller Dashboard

Displays live seller information including:

- Product count
- Order count
- Low-stock count
- Total sales

## Product Listings

Seller can:

- View seller products
- View product images
- Update product name
- Update product description
- Update product price
- View inventory status

## Inventory Management

Seller can:

- View inventory quantities
- Update product inventory
- View inventory graph
- View low-stock alerts

## Order Management

Seller can:

- View orders containing seller products
- View order details
- Update order status

Supported statuses:

- `Pending`
- `Processing`
- `Fulfilled`

## Sales Performance

Seller can view:

- Total orders
- Total units sold
- Total sales
- Sales trend graph
- Sales report table

---

# Buyer Portal

## Buyer Dashboard

Provides access to:

- Product browsing
- Featured products
- Browsing history
- Orders
- Wishlist
- Account overview

## Product Browsing

Buyer can:

- Browse products
- Search products
- Filter by minimum price
- Filter by maximum price
- View product images
- View product details
- Select purchase quantity
- Add products to wishlist
- Purchase selected products

## Product Details

Displays:

- Product image
- Product name
- Description
- Price
- Inventory availability
- Wishlist action

## Browsing History

The platform stores products viewed by the buyer.

Buyer can view:

- Product image
- Product information
- Price
- Date/time viewed

## Wishlist

Buyer can:

- Add products
- Remove products
- View current price
- View price when added
- See price changes

## Orders

Buyer can:

- Place orders
- View order history
- Open a dedicated order details page
- View ordered products
- View quantity
- View price
- View subtotal
- View total amount
- Track order status

## Account Overview

Buyer can manage:

### Personal Details

- Name
- Email

### Address Book

- Add address
- Edit address
- Delete address

### Payment Methods

Supported payment method types:

- Cash on Delivery
- Card
- EMI

For card entries, the frontend only stores a masked representation of the card number rather than the full card number.

---

# Frontend Routes

## Role Selection

```text
/
```

## Admin

```text
/admin
/admin/users
/admin/products
/admin/orders
/admin/system-activities
```

## Seller

```text
/seller
/seller/products
/seller/orders
/seller/inventory
/seller/sales
```

## Buyer

```text
/buyer
/buyer/products
/buyer/products/:productId
/buyer/history
/buyer/orders
/buyer/orders/:orderId
/buyer/wishlist
/buyer/account
```

---

# API Overview

Backend server:

```text
http://localhost:5000
```

## Users

```text
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

GET    /api/users/:id/profile
PUT    /api/users/:id/profile
```

## Products

```text
GET    /api/products
GET    /api/products/browse
GET    /api/products/seller/:sellerId
POST   /api/products/seller/:sellerId
PUT    /api/products/:id
DELETE /api/products/:id

GET    /api/products/seller/:sellerId/inventory
PUT    /api/products/seller/:sellerId/product/:productId/inventory
```

## Orders

```text
GET    /api/orders
GET    /api/orders/buyer/:buyerId
GET    /api/orders/seller/:sellerId
GET    /api/orders/:orderId/items

POST   /api/orders/buyer/:buyerId

PUT    /api/orders/:orderId/status
```

## Browsing History

```text
GET  /api/browsing-history/buyer/:buyerId
POST /api/browsing-history/buyer/:buyerId/product/:productId
```

## Wishlist

```text
GET    /api/wishlist/buyer/:buyerId
POST   /api/wishlist/buyer/:buyerId/product/:productId
DELETE /api/wishlist/buyer/:buyerId/product/:productId
```

## Addresses

```text
GET    /api/addresses/buyer/:buyerId
POST   /api/addresses/buyer/:buyerId
PUT    /api/addresses/buyer/:buyerId/:addressId
DELETE /api/addresses/buyer/:buyerId/:addressId
```

## Payment Methods

```text
GET    /api/payment-methods/buyer/:buyerId
POST   /api/payment-methods/buyer/:buyerId
PUT    /api/payment-methods/buyer/:buyerId/:paymentId
DELETE /api/payment-methods/buyer/:buyerId/:paymentId
```

## System Activity

```text
GET /api/system-activities
```

## Seller Dashboard

```text
GET /api/seller-dashboard/:sellerId/sales-performance
GET /api/seller-dashboard/:sellerId/inventory-overview
```

---

# Database

Database name:

```sql
ecommerce_db
```

Main tables used by the project:

```text
users
products
orders
order_items
wishlist
browsing_history
addresses
payment_methods
system_activities
```

## Main Relationships

- A seller can have multiple products.
- A buyer can place multiple orders.
- An order can contain multiple order items.
- A buyer can have multiple wishlist items.
- A buyer can have browsing history records.
- A buyer can have multiple addresses.
- A buyer can have multiple payment methods.
- Platform actions can be stored in system activities.

---

# Product Images

Product images are stored in:

```text
frontend/public/products/
```

Example database path:

```text
/products/laptop.jpg
```

Do **not** store the path as:

```text
/public/products/laptop.jpg
```

Vite automatically serves files inside the `public` directory from the root URL.

---

# Demo User IDs

The current frontend uses centralized demo IDs from:

```text
frontend/src/config/userIds.js
```

Current values:

```js
export const BUYER_ID = 9;
export const SELLER_ID = 2;
```

If the corresponding database users are recreated and receive different IDs, update this file.

---

# Environment Configuration

Create:

```text
backend/.env
```

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_db
```

Do not commit the real `.env` file to GitHub.

---

# Installation

## Requirements

Recommended project environment used during development:

```text
Node.js: 24.21.0
npm:     11.19.0
MySQL
```

---

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd online-ecommerce-platform
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3. Configure MySQL

Create the database:

```sql
CREATE DATABASE ecommerce_db;
```

Create/import the project's required tables before starting the backend.

Make sure the values in:

```text
backend/.env
```

match your local MySQL configuration.

---

## 4. Start the Backend

From:

```text
online-ecommerce-platform/backend
```

run:

```bash
node server.js
```

Expected output:

```text
Server running on http://localhost:5000
```

---

## 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

## 6. Start the Frontend

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# Testing Checklist

Before submitting or demonstrating the project, verify:

## Admin

- Dashboard loads
- User CRUD works
- Product CRUD works
- Orders load
- Order status changes work
- Order details load
- System activity loads
- System activity auto-refresh works

## Seller

- Dashboard loads
- Product images display
- Product editing works
- Inventory updates work
- Orders load
- Order status updates work
- Inventory overview works
- Low-stock section works
- Sales performance loads

## Buyer

- Dashboard loads
- Product browsing works
- Search works
- Price filters work
- Product details load
- Browsing history works
- Wishlist works
- Product purchase works
- Order history works
- Dedicated order details page works
- Account details update
- Address CRUD works
- Payment method CRUD works

---

# Screenshots

You can add project screenshots to a folder such as:

```text
screenshots/
```

Suggested screenshots:

```text
01-role-selection.png
02-admin-dashboard.png
03-admin-products.png
04-seller-dashboard.png
05-seller-inventory.png
06-buyer-dashboard.png
07-product-browsing.png
08-product-details.png
09-buyer-orders.png
10-account-overview.png
```

Then include them in this README after adding the files to the repository.

---

# Security Notes

- Database credentials are stored in `.env`.
- `.env` should not be committed.
- Full card numbers are not intended to be stored by the frontend.
- This academic project currently uses role selection rather than a password-based authentication system.

---

# Git Ignore

The project should exclude generated and secret files such as:

```gitignore
node_modules/
.env
dist/
```

---

# Project Status

```text
Frontend Routes              Complete
Backend API Integration      Complete
Admin Portal                 Complete
Seller Portal                Complete
Buyer Portal                 Complete
Product Images               Complete
Order Management             Complete
Wishlist                     Complete
Browsing History             Complete
Account Management           Complete
System Activity Monitoring   Complete
Responsive UI                Complete
Functional Testing           Passed
```

---

## Author

Student project — Online E-commerce Platform.
