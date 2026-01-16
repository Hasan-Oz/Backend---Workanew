Here is your **Final Master API Cheatsheet**. 📜

This includes everything we built: the standard email login, the new social logins, and the workshop data. Save this file as `README.md` in your project folder so you have it on your new computer.

---

# 📘 WorkAnew API Documentation

**Base URL:** `http://localhost:3000/api`

## 🔐 1. Authentication

### **A. Standard Login (Email/Password)**

* **Register:**
* **POST** `/auth/register`
* **Body:** `{ "username": "John", "email": "john@test.com", "password": "123", "role": "teacher" }`


* **Login:**
* **POST** `/auth/login`
* **Body:** `{ "email": "john@test.com", "password": "123" }`
* **Returns:** `{ "token": "eyJh...", "role": "teacher" }`



### **B. Social Login (Google & Facebook)**

* **Google Login:**
* **GET** `http://localhost:3000/api/auth/google`
* *Action:* Open this link in the browser. It will redirect to Google.
* *Result:* Redirects to Frontend with token: `http://localhost:5173/login-success?token=eyJh...`


* **Facebook Login:**
* **GET** `http://localhost:3000/api/auth/facebook`
* *Action:* Open this link in the browser.
* *Result:* Redirects to Frontend with token.



---

## 🛠️ 2. Workshops (Protected Data)

**Important:** For these routes, you must send the token in the Header!

* **Header Key:** `Authorization`
* **Header Value:** `Bearer <PASTE_YOUR_TOKEN_HERE>`

### **Endpoints**

* **Get All Workshops:**
* **GET** `/workshops`
* *Access:* Public (Anyone can see)


* **Create Workshop:**
* **POST** `/workshops`
* *Access:* **Teachers Only** 🔒
* **Body:** `{ "topic": "React Mastery", "status": "public" }`



---

## 📦 3. How to Move This Project

When moving to a new computer:

1. **Copy** the `src` folder, `package.json`, `drizzle.config.ts`, `.env`, and `sqlite.db`.
2. **Do NOT Copy** the `node_modules` folder.
3. **Run:** `npm install` on the new computer.
4. **Run:** `npm run dev` to start.

---

You are all set! Safe travels with your code to the new computer. Good luck with the frontend! 🚀