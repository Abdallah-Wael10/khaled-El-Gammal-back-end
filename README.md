# Khaled El Gammal Back End

Back-end RESTful API for Khaled El Gammal platform, built with **Node.js**, **Express**, and **MongoDB**.  
This API manages users, admins, products, gallery, business requests, contact forms, and customizations.

---

## Features

- **User & Admin Authentication** (JWT, hashed passwords)
- **Role-based Authorization** (admin/user separation)
- **CRUD for Products, Gallery, Business, Contact, Customize**
- **Image Uploads** (with Multer)
- **Validation** (express-validator)
- **Password Reset via Email**
- **CORS & Security** (helmet, cors)
- **Clean Code Structure** (MVC, middleware, utils)
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

Create a `.env` file in the root with:

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

- The server runs on `http://localhost:5000` by default.

---

## 📦 Main Endpoints

### **Auth**
- `POST /api/users/signup` — User registration
- `POST /api/users/login` — User login
- `POST /api/admin/signup` — Admin registration
- `POST /api/admin/login` — Admin login

### **Products**
- `GET /api/products` — List all products
- `POST /api/products` — Create (admin only, JWT)
- `PUT /api/products/:id` — Update (admin only, JWT)
- `DELETE /api/products/:id` — Delete (admin only, JWT)

### **Gallery**
- `GET /api/gallery` — List all gallery items
- `POST /api/gallery` — Create (admin only, JWT)
- `PUT /api/gallery/:id` — Update (admin only, JWT)
- `DELETE /api/gallery/:id` — Delete (admin only, JWT)

### **Business**
- `POST /api/business` — Submit business request (public)
- `GET/PUT/DELETE /api/business/...` — (admin only, JWT)

### **Contact**
- `POST /api/contact` — Submit contact form (public)
- `GET/PUT/DELETE /api/contact/...` — (admin only, JWT)

### **Customize**
- `POST /api/customize` — Submit customization with images (public)
- `GET/PUT/DELETE /api/customize/...` — (admin only, JWT)

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

## 👨‍💻 Author

- [Abdallah Wael](https://github.com/Abdallah-Wael10)

---

## 📝 License

This project is licensed under the MIT License.

---

**Feel free to fork, contribute, or open issues!**
