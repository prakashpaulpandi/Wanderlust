// Google Gemini AI service using active gemini-3.6-flash model
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const getApiKey = () => import.meta.env.VITE_GEMINI_API_KEY || '';

const buildPrompt = (userMessage, destination, conversationHistory = []) => {
  const systemContext = `You are Wanderlust AI, a knowledgeable and friendly travel assistant specialising in ${destination.name}, ${destination.country}. 
You help travellers plan their trips, answer questions about the destination, recommend places to visit, and provide cultural insights.
Be concise, warm, and practical. Format your responses clearly.`;

  const history = conversationHistory
    .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  return `${systemContext}\n\n${history ? `Conversation so far:\n${history}\n\n` : ''}User: ${userMessage}`;
};

export const sendChatMessage = async (message, destination, conversationHistory = []) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Gemini API key is missing. Please check your .env file.');

  const prompt = buildPrompt(message, destination, conversationHistory);
  const models = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-3.7-flash'];
  let lastError = null;

  for (const model of models) {
    try {
      const response = await fetch(`${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
      } else {
        const errJson = await response.json().catch(() => ({}));
        lastError = errJson?.error?.message || `Gemini API error: ${response.statusText}`;
      }
    } catch (e) {
      lastError = e.message;
    }
  }

  throw new Error(lastError || 'Gemini API call failed.');
};

export const generateItinerary = async (destination, days, preferences = '') => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Gemini API key is missing. Please check your .env file.');

  const prompt = `Create a detailed ${days}-day travel itinerary for ${destination.name}, ${destination.country}.
${preferences ? `Traveller preferences: ${preferences}` : ''}

Format the response as a structured JSON array with this exact shape:
[
  {
    "day": 1,
    "title": "Day title",
    "theme": "Short theme (e.g. Arrival & City Exploration)",
    "morning": { "activity": "Activity name", "description": "What to do and why", "tip": "Practical tip" },
    "afternoon": { "activity": "Activity name", "description": "What to do and why", "tip": "Practical tip" },
    "evening": { "activity": "Activity name", "description": "What to do and why", "tip": "Practical tip" },
    "accommodation": "Suggested area or type of accommodation",
    "estimatedCost": "Rough cost estimate in USD"
  }
]

Include the famous places: ${destination.famousPlaces.map((p) => p.name).join(', ')}.
Return ONLY valid JSON, no markdown fences.`;

  const models = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-3.7-flash'];
  let lastError = null;

  for (const model of models) {
    try {
      const response = await fetch(`${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 4096,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleaned);
      } else {
        const errJson = await response.json().catch(() => ({}));
        lastError = errJson?.error?.message || `Gemini API error: ${response.statusText}`;
      }
    } catch (e) {
      lastError = e.message;
    }
  }

  throw new Error(lastError || 'Failed to generate itinerary with Gemini API.');
};
