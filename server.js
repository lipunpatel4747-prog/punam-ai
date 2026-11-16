const express = require("express");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

let aiClient;

async function getAI() {
  if (!aiClient) {
    const { GoogleGenAI } = await import("@google/genai");
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });
  }
  return aiClient;
}

app.get("/", (req, res) => {
  res.send("PUNAM AI Server is running!");
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ reply: "Message bhejo." });
    }

    const ai = await getAI();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Abhi AI se jawab nahi mil raha." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("PUNAM AI running on port " + PORT);
});
