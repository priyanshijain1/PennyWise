# 💰 PennyWise

- A full-stack **Expense Management System** built with **React.js, Node.js, Express.js, MongoDB, and Ant Design**.  
- Track, analyze, and manage your income & expenses with ease.
  
<p align="center">
  <img src="client/src/PennyWise Logo.png" alt="PennyWise" style="width:850px ; height:440px ; object-fit:cover;" />
</p>



## 🧾 Table of Contents
- [Overview](#overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Setup / Installation](#setup--installation)  
- [Usage](#usage)  

---

## 📖 Overview
PennyWise is designed to simplify **personal finance management**.  
It allows you to **record transactions, categorize them, filter/search, and visualize** your spending vs. income with intuitive analytics dashboards.  

---

## ✨ Features
- 🔑 User authentication and secure API endpoints  
- ➕ Add, ✏️ Edit, ❌ Delete transactions  
- 🔍 Filter transactions by date range, frequency, or type (income/expense)  
- 📊 Analytics dashboard:  
  - Income vs. expense ratio  
  - Turnover breakdowns with percentages  
  - Graphical progress indicators  
- 📱 Responsive design with **Ant Design**  
- ⚡ Fast API using **Express.js + MongoDB**  

---

## 🛠 Tech Stack

| Layer       | Technologies |
|-------------|--------------|
| **Frontend** | React.js, Ant Design, Axios |
| **Backend**  | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ORM) |
| **Utilities**| Moment.js, JWT (if auth is enabled), Git/GitHub |

---



## ⚡ Setup / Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/priyanshijain1/PennyWise.git
   cd PennyWise


2. **Backend setup**
    ```bash
    npm install
    create a .env file in root with:
    MONGO_URI=your_mongo_connection_string
    PORT=8080 (or any available port)
    npm run server


3. **Frontend setup**
    ```bash
    cd client
    npm install
    npm start

    
4. **Access the app**
    - Backend:
       ```bash
       http://localhost:8080
     
    - Frontend:
       ```bash
       http://localhost:3000

---

## 🚀 Usage
- Go to the homepage and click Add New to record a transaction.
- Use the Edit ✏️ icon to update transaction details.
- Use the Delete ❌ icon to remove unwanted transactions.
- Switch between Table View and Analytics View using the icons.
- Filter by frequency or type.
