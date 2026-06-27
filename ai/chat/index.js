const { generateContent, isConfigured } = require("../shared/llmClient");

const CHAT_PROMPT = `You are a financial assistant. You have access to the user's transaction data below.
Answer the user's question based ONLY on the provided data.

All monetary amounts in the data are in Indian Rupees (INR, ₹).

RULES:
- NEVER invent numbers, amounts, or transactions
- If the data doesn't contain enough information to answer, say so clearly
- Be concise and use specific numbers from the data
- Always display amounts with ₹ symbol (e.g. ₹1,500)
- If the user asks about trends or patterns, reference the data you have`;

function isAvailable() {
  return isConfigured();
}

async function answerQuery(transactions, question) {
  if (!question || question.trim().length === 0) {
    return "Please ask a question about your finances.";
  }

  const data = transactions.slice(0, 100);

  if (data.length === 0) {
    return "No transaction data available. Add some transactions first, then ask me anything about them!";
  }

  const contents = [
    `Transaction data:\n${JSON.stringify(data, null, 2)}`,
    `User question: ${question.trim()}`,
  ].join("\n\n");

  return await generateContent({
    systemInstruction: CHAT_PROMPT,
    contents,
  });
}

module.exports = { answerQuery, isAvailable };