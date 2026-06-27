const Tesseract = require("tesseract.js");

let workerPromise = null;

async function getWorker() {
  if (!workerPromise) {
    workerPromise = Tesseract.createWorker("eng");
  }
  return workerPromise;
}

const DATE_PATTERNS = [
  /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/,
  /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b/i,
];

const TOTAL_PATTERNS = [
  /total[:\s]*₹?\s*([\d,]+\.?\d*)/i,
  /total[:\s]*\$?\s*([\d,]+\.?\d*)/i,
  /amount due[:\s]*₹?\s*([\d,]+\.?\d*)/i,
  /grand total[:\s]*₹?\s*([\d,]+\.?\d*)/i,
  /₹?\s*([\d,]+\.\d{2})\s*$/m,
];

function extractDate(text) {
  for (const p of DATE_PATTERNS) {
    const m = text.match(p);
    if (m) return m[0];
  }
  return null;
}

function extractTotal(text) {
  for (const p of TOTAL_PATTERNS) {
    const m = text.match(p);
    if (m) return parseFloat(m[1].replace(/,/g, ""));
  }
  return null;
}

function extractMerchant(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines[0]?.replace(/^[•\-\*\d\s.]+\s*/, "") || null;
}

function extractItems(text) {
  const items = [];
  for (const line of text.split("\n")) {
    const m = line.trim().match(/^(.+?)\s+₹?\s*([\d,]+\.?\d*)\s*$/);
    if (m) {
      const price = parseFloat(m[2].replace(/,/g, ""));
      if (price > 0) items.push({ name: m[1].trim(), price });
    }
  }
  return items.length > 0 ? items : null;
}

async function scanReceipt(imageBuffer) {
  const worker = await getWorker();
  const { data } = await worker.recognize(imageBuffer);
  const text = data.text.trim();
  if (!text) throw new Error("Could not read any text from the image.");

  return {
    raw: text,
    merchant: extractMerchant(text),
    date: extractDate(text),
    total: extractTotal(text),
    items: extractItems(text),
  };
}

process.on("exit", () => {
  if (workerPromise) workerPromise.then((w) => w.terminate());
});

module.exports = { scanReceipt };
