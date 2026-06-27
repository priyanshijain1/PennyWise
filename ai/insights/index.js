const { generateContent, isConfigured } = require("../shared/llmClient");

const INSIGHT_PROMPT = `You are a financial analyst. Analyze the provided transactions and return a JSON object.

All monetary amounts in the data are in Indian Rupees (INR, ₹).

RULES:
- NEVER invent numbers, amounts, or transactions that don't exist in the data
- Only reference specific amounts that appear in the provided data
- Always display amounts with ₹ symbol (e.g. ₹1,500)
- If data is empty or insufficient, acknowledge it honestly
- Be concise and specific with numbers

Return valid JSON (no markdown) with this exact structure:
{
  "summary": "2-3 sentence overview of financial activity",
  "keyInsights": ["insight1", "insight2", "insight3"],
  "anomalies": ["anomaly description with amount"] or null,
  "savingsTip": "one specific actionable tip"
}`;

function isAvailable() {
  return isConfigured();
}

async function getInsights(transactions) {
  const data = transactions.slice(0, 100);

  if (data.length === 0) {
    return {
      summary: "No transactions to analyze. Add some transactions to get started.",
      keyInsights: [],
      anomalies: null,
      savingsTip: null,
    };
  }

  const contents = JSON.stringify(data, null, 2);

  const raw = await generateContent({
    systemInstruction: INSIGHT_PROMPT,
    contents,
    responseMimeType: "application/json",
  });

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Failed to parse AI response. Please try again.");
  }
}

module.exports = { getInsights, isAvailable };