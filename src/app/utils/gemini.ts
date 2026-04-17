/**
 * Google Gemini AI Integration
 * Provides real AI-powered responses for the NeuroCart AI shopping assistant.
 * Falls back to local rule-based responses if API key is not configured.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface GeminiResponse {
  text: string;
  fromGemini: boolean;
}

/**
 * Calls the Google Gemini API to generate a shopping assistant response.
 * @param userMessage - The user's input message
 * @param context - Optional behavioral context (viewed products, cart, etc.)
 * @returns AI-generated response text
 */
export async function callGeminiAPI(
  userMessage: string,
  context?: {
    cartItemCount?: number;
    recentSearches?: string[];
    topViewedCategory?: string;
  }
): Promise<GeminiResponse> {
  if (!GEMINI_API_KEY) {
    return { text: '', fromGemini: false };
  }

  const systemPrompt = `You are NeuroCart AI, an intelligent e-commerce shopping assistant. 
You help users find products, compare options, and get the best deals.
${context?.cartItemCount ? `The user currently has ${context.cartItemCount} items in their cart.` : ''}
${context?.recentSearches?.length ? `Recent searches: ${context.recentSearches.slice(0, 3).join(', ')}.` : ''}
${context?.topViewedCategory ? `User is most interested in: ${context.topViewedCategory}.` : ''}

Keep responses concise, friendly, and helpful. Focus on:
- Finding products within budget constraints
- Comparing similar products
- Suggesting deals and discounts
- Providing personalized recommendations based on browsing behavior

Respond in plain text only. Do not use markdown formatting.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `User: ${userMessage}` },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    return { text, fromGemini: true };
  } catch (error) {
    console.warn('Gemini API call failed, using local fallback:', error);
    return { text: '', fromGemini: false };
  }
}

/**
 * Sanitizes user input to prevent XSS and injection attacks.
 * @param input - Raw user input string
 * @returns Sanitized string safe for processing and display
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .slice(0, 500) // Limit message length
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/javascript:/gi, '') // Prevent JS injection
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}
