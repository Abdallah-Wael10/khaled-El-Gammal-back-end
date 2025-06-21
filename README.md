# Khaled El Gammal Back End

A robust RESTful API for the Khaled El Gammal platform, built with **Express.js** and **MongoDB**.  
This API powers the e-commerce frontend, handling authentication, products, gallery, orders, business/contact/customize forms, and admin features.

---

## 🚀 Features

- **Express.js** REST API
- **MongoDB** with Mongoose ODM
- **JWT Authentication** (User & Admin, role-based)
- **CRUD** for Products, Gallery, Business, Contact, Customize
- **Image Uploads** (Multer, `/uploads`)
- **Validation** (express-validator)
- **Password Reset via Email** (nodemailer, Gmail)
- **CORS & Security** (helmet, cors)
- **Clean MVC Structure**
- **Ready for Frontend Integration**

---

## 📁 Project Structure

```
.
├── controllers/      # All route logic (user, admin, product, etc.)
├── middleware/       # Validation, auth, upload, etc.
├── model/            # Mongoose models (User, Admin, Product, etc.)
├── routes/           # Express routers for each resource
├── uploads/          # Uploaded images
├── utils/            # Helper functions (JWT, etc.)
├── .env              # Environment variables
├── index.js          # App entry point
├── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```
MONGO_URL=your_mongodb_connection_string
PORT=5000
JWT_SECRET_KEY=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

---

## 🛠️ Installation & Run

```bash
git clone https://github.com/Abdallah-Wael10/khaled-El-Gammal-back-end.git
cd khaled-El-Gammal-back-end
npm install
npm start
```

- The server runs on [http://localhost:5000](http://localhost:5000) by default.

---

## 📦 Main Endpoints

### **Auth (User & Admin)**

| Endpoint                       | Method | Body / Params                | Description                |
|--------------------------------|--------|------------------------------|----------------------------|
| `/api/users/signup`            | POST   | fullName, email, phone, password | Register new user      |
| `/api/users/login`             | POST   | email, password              | User login                 |
| `/api/users/forgot-password`   | POST   | email                        | Send reset code            |
| `/api/users/reset-password`    | POST   | email, code, newPassword     | Reset password             |
| `/api/users/`                  | GET    | (JWT, admin)                 | List all users             |
| `/api/users/:id`               | GET    | (JWT, admin)                 | Get user by ID             |
| `/api/users/:id`               | DELETE | (JWT, admin)                 | Delete user by ID          |

| `/api/admin/signup`            | POST   | fullName, email, phone, password | Register new admin      |
| `/api/admin/login`             | POST   | email, password              | Admin login                |
| `/api/admin/forgot-password`   | POST   | email                        | Send reset code            |
| `/api/admin/reset-password`    | POST   | email, code, newPassword     | Reset password             |
| `/api/admin/`                  | GET    | (JWT)                        | List all admins            |
| `/api/admin/:id`               | GET    | (JWT)                        | Get admin by ID            |
| `/api/admin/:id`               | DELETE | (JWT)                        | Delete admin by ID         |

---

### **Products**

| Endpoint                       | Method | Body / Params                | Description                |
|--------------------------------|--------|------------------------------|----------------------------|
| `/api/products`                | GET    |                              | List all products          |
| `/api/products/:id`            | GET    |                              | Get product by ID          |
| `/api/products`                | POST   | (JWT, admin) + FormData      | Create product (with images)|
| `/api/products/:id`            | PUT    | (JWT, admin) + FormData      | Update product (with images)|
| `/api/products/:id`            | DELETE | (JWT, admin)                 | Delete product             |
| `/api/products/:id/images`     | POST   | (JWT, admin) + FormData      | Add image to product       |
| `/api/products/:id/images/:imageName` | PUT | (JWT, admin) + FormData | Replace specific image     |
| `/api/products/:id/images/:imageName` | DELETE | (JWT, admin)         | Delete specific image      |

- **Image fields:** `mainImage` (single), `images` (array)

---

### **Gallery**

| Endpoint                       | Method | Body / Params                | Description                |
|--------------------------------|--------|------------------------------|----------------------------|
| `/api/gallery`                 | GET    |                              | List all gallery items     |
| `/api/gallery/:id`             | GET    |                              | Get gallery item by ID     |
| `/api/gallery`                 | POST   | (JWT, admin) + FormData      | Create gallery item        |
| `/api/gallery/:id`             | PUT    | (JWT, admin) + FormData      | Update gallery item        |
| `/api/gallery/:id`             | DELETE | (JWT, admin)                 | Delete gallery item        |

- **Image field:** `image` (single)

---

### **Business Requests**

| Endpoint                       | Method | Body / Params                | Description                |
|--------------------------------|--------|------------------------------|----------------------------|
| `/api/business`                | POST   | name, category, email, phone, comment | Submit business request (public) |
| `/api/business`                | GET    | (JWT, admin)                 | List all business requests |
| `/api/business/:id`            | GET    | (JWT, admin)                 | Get business by ID         |
| `/api/business/:id`            | PUT    | (JWT, admin)                 | Update business            |
| `/api/business/:id`            | DELETE | (JWT, admin)                 | Delete business            |

---

### **Contact Requests**

| Endpoint                       | Method | Body / Params                | Description                |
|--------------------------------|--------|------------------------------|----------------------------|
| `/api/contact`                 | POST   | name, email, phone, comment  | Submit contact form (public)|
| `/api/contact`                 | GET    | (JWT, admin)                 | List all contacts          |
| `/api/contact/:id`             | GET    | (JWT, admin)                 | Get contact by ID          |
| `/api/contact/:id`             | PUT    | (JWT, admin)                 | Update contact             |
| `/api/contact/:id`             | DELETE | (JWT, admin)                 | Delete contact             |

---

### **Customize Requests**

| Endpoint                       | Method | Body / Params                | Description                |
|--------------------------------|--------|------------------------------|----------------------------|
| `/api/customize`               | POST   | name, email, phone, comment, image[] | Submit customize request (public, images) |
| `/api/customize`               | GET    | (JWT, admin)                 | List all customize requests|
| `/api/customize/:id`           | GET    | (JWT, admin)                 | Get customize by ID        |
| `/api/customize/:id`           | PUT    | (JWT, admin) + FormData      | Update customize           |
| `/api/customize/:id`           | DELETE | (JWT, admin)                 | Delete customize           |

- **Image field:** `image` (array, max 5)

---

### **Checkout (Orders)**

| Endpoint                       | Method | Body / Params                | Description                |
|--------------------------------|--------|------------------------------|----------------------------|
| `/api/checkout`                | POST   | userInfo, items[], total     | Place order (public)       |
| `/api/checkout`                | GET    | (JWT, admin)                 | List all orders            |
| `/api/checkout/:id`            | GET    | (JWT, admin)                 | Get order by ID            |
| `/api/checkout/:id/status`     | PUT    | (JWT, admin), status         | Update order status        |

---

## 🔒 Authentication & Authorization

- **JWT** is used for all protected routes.
- **Admin-only** routes require a valid JWT with `role: "admin"`.
- Use the `Authorization: Bearer <token>` header for protected requests.

---

## 🖼️ Image Upload

- Images are uploaded via `Multer` and stored in `/uploads`.
- Access images at: `http://localhost:5000/uploads/<filename>`

---

## 📝 Validation

- All input is validated using `express-validator`.
- Errors are returned as JSON with status `422`.

---

## 📧 Password Reset

- Users & admins can reset passwords via email (Gmail SMTP).
- Requires valid `EMAIL_USER` and `EMAIL_PASS` in `.env`.

---

## 📝 Status Codes

- `200` OK (success)
- `201` Created (resource created)
- `400` Bad request (validation, logic error)
- `401` Unauthorized (no/invalid token)
- `403` Forbidden (not admin)
- `404` Not found
- `422` Validation error

---

## 👨‍💻 Author

- [Abdallah Wael](https://github.com/Abdallah-Wael10)

---

## 📝 License

This project is licensed under the MIT License.

---

**Feel free to fork, contribute, or open issues!**
