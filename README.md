# PennyWise — Expense Management System

Full-stack MERN expense tracker with AI-powered insights, natural language chat, and receipt OCR. Built with React 19, Ant Design 5, Node.js, Express, and MongoDB.

<p align="center">
  <img src="client/src/PennyWise Logo.png" alt="PennyWise" style="width:850px ; height:440px ; object-fit:cover;" />
</p>

---

## Features

- **User authentication** — register/login with JWT-secured API
- **Transaction management** — add, edit, delete income/expense records
- **Smart filtering** — filter by date range, frequency (7d/30d/1y/custom), or type
- **Analytics dashboard** — income vs expense ratio, category breakdowns with progress bars
- **AI Spending Insights** — auto-generated financial analysis, key insights, anomaly detection, and savings tips powered by Groq (Llama 3.1 8B)
- **AI Chat** — floating chatbot to ask natural language questions about your spending (e.g. "How much did I spend on food?")
- **Receipt OCR** — upload a receipt photo; automatically extracts merchant, date, total, and line items using Tesseract.js
- **Responsive** — Ant Design UI works on desktop and mobile

---

## Tech Stack

| Layer        | Technologies |
|-------------|--------------|
| **Frontend** | React 19, Ant Design 5, React Router 7, Axios, Moment.js |
| **Backend**  | Node.js, Express 4, Mongoose 8, JWT, bcryptjs |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **AI / ML**  | Groq API (Llama 3.1 8B) — free tier (14,400 requests/day), Tesseract.js 7 (WASM OCR) |
| **Tooling**  | Create React App, Nodemon, Concurrently |

---

## Setup / Installation

### Prerequisites
- Node.js 18+
- MongoDB connection string (Atlas or local)
- Groq API key (free, no credit card) at https://console.groq.com/keys

### 1. Clone & install
```bash
git clone https://github.com/priyanshijain1/PennyWise.git
cd PennyWise
npm install
cd client && npm install && cd ..
```

### 2. Environment variables
Create `.env` in the project root:
```env
PORT=8080
MONGO_URL=your_mongo_connection_string
JWT_SECRET=your_random_secret
GROQ_API_KEY=gsk_your_groq_api_key
```

### 3. Run
```bash
# Backend + Frontend concurrently
npm run dev

# Or separately:
npm run server   # http://localhost:8080
npm run client   # http://localhost:3000
```

---

## API Reference

All routes prefixed with `/api/v1`:

### Users
- `POST /users/register` — `{ name, email, password }` → 201
- `POST /users/login` — `{ email, password }` → `{ token, user }`

### Transactions (require `Authorization: Bearer <token>`)
- `POST /transactions/get-transaction` — `{ frequency, selectedDate, type }` → filtered list
- `POST /transactions/add-transaction` — `{ amount, type, category, reference, description, date }`
- `POST /transactions/edit-transaction` — `{ transactionId, payload }`
- `POST /transactions/delete-transaction` — `{ transactionId }`

### AI (require `Authorization: Bearer <token>`, rate limited to 50/hour)
- `POST /ai/insights` — `{ transactions }` → AI-generated financial analysis (summary, keyInsights, anomalies, savingsTip)
- `POST /ai/query` — `{ transactions, question }` → AI answer to natural language question
- `POST /ai/receipt` — `multipart/form-data` with `receipt` image file → `{ merchant, date, total, items }`

---

## Usage

1. **Register / Login** — create an account
2. **Add transactions** — click "Add Transaction" to record income or expenses
3. **Filter & view** — toggle between table and analytics views; filter by time period or type
4. **AI Insights** — scroll down to see auto-generated spending analysis (updates when transactions change)
5. **AI Chat** — click the robot icon (bottom-right) to ask questions like:
   - "How much did I spend on food this month?"
   - "What's my biggest expense category?"
   - "Compare my income vs expenses"
6. **Receipt OCR** — click "Scan Receipt" to upload a photo; merchant, total, and items are extracted automatically

---

## Project Structure

```
PennyWise/
├── ai/
│   ├── shared/
│   │   └── llmClient.js        # Groq API wrapper (OpenAI-compatible format)
│   ├── insights/
│   │   └── index.js            # Spending insights engine
│   ├── chat/
│   │   └── index.js            # NLP chat engine
│   └── ocr/
│       └── index.js            # Receipt OCR engine (Tesseract.js)
├── controllers/
│   ├── transactionCtrl.js      # Transaction CRUD
│   ├── userController.js       # Auth (login/register)
│   └── aiController.js         # AI endpoints + rate limiter + cache
├── middleware/
│   └── authMiddleware.js       # JWT verification
├── models/
│   ├── transactionModel.js     # Transaction schema
│   └── userModel.js            # User schema
├── routes/
│   ├── transactionRoutes.js    # Transaction routes
│   ├── userRoute.js            # Auth routes
│   └── aiRoutes.js             # AI endpoints (/insights, /query, /receipt)
├── server.js                   # Express entry point
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AiInsights.js   # AI insights panel
│   │   │   ├── AiChat.js       # Floating chat bot
│   │   │   └── Analytics.js    # Category analytics
│   │   ├── pages/
│   │   │   ├── Homepage.js     # Main dashboard
│   │   │   ├── Login.js        # Login page
│   │   │   └── Register.js     # Registration page
│   │   └── utils/api.js        # Axios instance with JWT interceptor
│   └── package.json
├── .env                        # Environment variables
└── package.json
```

---

## AI Architecture

### Provider: Groq (free tier)
- **Model**: `llama-3.1-8b-instant` — 14,400 requests/day, 30 RPM, no credit card needed
- **API**: OpenAI-compatible format (`api.groq.com/openai/v1`)
- **Fallback**: Clear error messages if API key is missing or rate limited

### Rate Limiting
- **App-level**: 50 requests/user/hour (in-memory Map, resets on server restart)
- **API-level**: Groq enforces 30 RPM / 14,400 RPD per organization
- **Throttle**: Client-side minimum 2s gap between requests
- **Retry**: Exponential backoff (1s → 2s → 4s) on transient rate limits

### Receipt OCR
- **Engine**: Tesseract.js v7 (pure JavaScript WebAssembly, no native dependencies)
- **Upload**: multer (max 5MB, image/jpeg/png/webp only)
- **Parsing**: Regex-based extraction of merchant name, date, total amount, and line items
- **No external API calls** — all processing happens locally

---


