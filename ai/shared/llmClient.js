const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

function isConfigured() {
  return !!GROQ_API_KEY;
}

const MIN_REQUEST_INTERVAL = 2000;
const MAX_RETRIES = 3;
let lastRequestTime = 0;
let queue = Promise.resolve();

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function classifyError(status, body) {
  const message = body?.error?.message || "";
  if (status === 429) {
    if (message.toLowerCase().includes("quota") || message.toLowerCase().includes("daily")) {
      return {
        code: "QUOTA_EXCEEDED",
        message:
          "Groq daily request limit reached (14,400/day for most models). Resets at midnight UTC or try a different model at console.groq.com",
      };
    }
    return { code: "RATE_LIMITED", message: "Groq rate limit reached. Try again shortly." };
  }
  if (status === 403 || status === 401) {
    return {
      code: "INVALID_KEY",
      message: "Invalid Groq API key. Get one at https://console.groq.com/keys",
    };
  }
  return { code: "API_ERROR", message: `Groq API error (${status}): ${message || body?.error?.status || "Unknown"}` };
}

function buildBody({ systemInstruction, contents, responseMimeType }) {
  const body = {
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: contents },
    ],
    temperature: 0.1,
    max_tokens: 2048,
  };
  if (responseMimeType === "application/json") {
    body.response_format = { type: "json_object" };
  }
  return body;
}

function parseResponse(data) {
  return data.choices?.[0]?.message?.content || null;
}

async function generateContent({ systemInstruction, contents, responseMimeType }) {
  if (!GROQ_API_KEY) {
    throw Object.assign(new Error("Groq API key not configured"), { code: "MISSING_API_KEY" });
  }

  const body = buildBody({ systemInstruction, contents, responseMimeType });

  return new Promise((resolve, reject) => {
    queue = queue
      .then(async () => {
        const elapsed = Date.now() - lastRequestTime;
        if (elapsed < MIN_REQUEST_INTERVAL) {
          await delay(MIN_REQUEST_INTERVAL - elapsed);
        }
        lastRequestTime = Date.now();

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 20000);

          try {
            const response = await fetch(GROQ_API_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GROQ_API_KEY}`,
              },
              body: JSON.stringify(body),
              signal: controller.signal,
            });

            const rawBody = await response.text();
            let parsedBody;
            try {
              parsedBody = JSON.parse(rawBody);
            } catch {
              parsedBody = { error: { message: rawBody } };
            }

            if (!response.ok) {
              const { code, message } = classifyError(response.status, parsedBody);

              if (code === "RATE_LIMITED" && attempt < MAX_RETRIES) {
                await delay(Math.pow(2, attempt) * 1000);
                continue;
              }

              return reject(Object.assign(new Error(message), { code }));
            }

            const text = parseResponse(parsedBody);
            if (!text) {
              return reject(new Error("Groq returned an empty response"));
            }

            resolve(text);
            return;
          } finally {
            clearTimeout(timeout);
          }
        }
      })
      .catch(() => {});
  });
}

module.exports = { generateContent, isConfigured };
