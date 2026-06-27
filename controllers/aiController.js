const crypto = require("crypto");
const insights = require("../ai/insights");
const chat = require("../ai/chat");
const { scanReceipt } = require("../ai/ocr");

const requestLog = new Map();
const insightCache = new Map();
const RATE_LIMIT = 50;
const RATE_WINDOW = 3600000;

function checkRateLimit(userId) {
  const now = Date.now();
  if (!requestLog.has(userId)) {
    requestLog.set(userId, []);
  }
  const timestamps = requestLog.get(userId).filter((t) => now - t < RATE_WINDOW);
  if (timestamps.length >= RATE_LIMIT) {
    return false;
  }
  timestamps.push(now);
  requestLog.set(userId, timestamps);
  return true;
}

function hashTransactions(transactions) {
  return crypto.createHash("md5").update(JSON.stringify(transactions)).digest("hex");
}

function handleAIError(res, err) {
  const map = {
    MISSING_API_KEY: [503, "AI features are not configured. Set GROQ_API_KEY in .env to enable."],
    QUOTA_EXCEEDED: [
      429,
      "Groq daily request limit reached (14,400/day for most models). Resets at midnight UTC. Get a key at https://console.groq.com/keys",
    ],
    RATE_LIMITED: [429, "AI service is temporarily rate limited. Please wait a moment and try again."],
    INVALID_KEY: [503, "Invalid Groq API key. Get one at https://console.groq.com/keys"],
  };
  const entry = map[err.code];
  if (entry) {
    return res.status(entry[0]).json({ success: false, message: entry[1] });
  }
  return res.status(500).json({
    success: false,
    message: err.message || "An error occurred while processing your request.",
  });
}

async function getInsights(req, res) {
  try {
    if (!checkRateLimit(req.user)) {
      return res.status(429).json({
        success: false,
        message: "You've reached the hourly limit for AI requests (50/hour). Please try again later.",
      });
    }

    if (!insights.isAvailable()) {
      return res.status(503).json({
        success: false,
        message: "AI features are not configured. Set GROQ_API_KEY in .env to enable.",
      });
    }

    const { transactions } = req.body;
    if (!Array.isArray(transactions)) {
      return res.status(400).json({ success: false, message: "Invalid transaction data." });
    }

    const cacheKey = `${req.user}:${hashTransactions(transactions)}`;
    const cached = insightCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < 300000) {
      return res.json({ success: true, data: cached.result, cached: true });
    }

    const result = await insights.getInsights(transactions);
    insightCache.set(cacheKey, { result, ts: Date.now() });
    res.json({ success: true, data: result });
  } catch (err) {
    handleAIError(res, err);
  }
}

async function askQuestion(req, res) {
  try {
    if (!checkRateLimit(req.user)) {
      return res.status(429).json({
        success: false,
        message: "You've reached the hourly limit for AI requests (50/hour). Please try again later.",
      });
    }

    if (!chat.isAvailable()) {
      return res.status(503).json({
        success: false,
        message: "AI features are not configured. Set GEMINI_API_KEY in .env to enable.",
      });
    }

    const { transactions, question } = req.body;
    if (!Array.isArray(transactions)) {
      return res.status(400).json({ success: false, message: "Invalid transaction data." });
    }
    if (!question || typeof question !== "string") {
      return res.status(400).json({ success: false, message: "Question is required." });
    }

    const answer = await chat.answerQuery(transactions, question);
    res.json({ success: true, data: { answer } });
  } catch (err) {
    handleAIError(res, err);
  }
}

async function scanReceiptHandler(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No receipt image provided." });
    }

    const result = await scanReceipt(req.file.buffer);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Failed to process receipt." });
  }
}

module.exports = { getInsights, askQuestion, scanReceiptHandler };