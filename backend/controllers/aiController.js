const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ===================== AI SPENDING INSIGHTS ===================== */
exports.getSpendingInsights = async (req, res) => {
  try {
    const { expenses, incomes } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `
      You are a personal finance advisor. Analyze these transactions and give 3-4 short, 
      friendly and helpful insights. Keep each point under 2 sentences. Be specific with numbers.
      
      Incomes: ${JSON.stringify(incomes)}
      Expenses: ${JSON.stringify(expenses)}
      
      Format your response as a simple numbered list. No markdown, no bold text.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ insights: text });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "AI insights failed" });
  }
};

/* ===================== SMART CATEGORY SUGGESTION ===================== */
exports.suggestCategory = async (req, res) => {
  try {
    const { title } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `
      Based on this expense title: "${title}"
      Suggest the most appropriate category from this list only:
      education, groceries, health, subscriptions, takeaways, clothing, travelling, other
      
      Reply with just one word — the category name. Nothing else.
    `;

    const result = await model.generateContent(prompt);
    const category = result.response.text().trim().toLowerCase();
    res.json({ category });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Category suggestion failed" });
  }
};