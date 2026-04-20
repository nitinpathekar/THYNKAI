import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Initializes Gemini and sends a message stream.
 * @param {string} apiKey - The user's Google AI Studio API key.
 * @param {string} modelName - The model to use (e.g., 'gemini-2.5-flash').
 * @param {Array} messages - Existing message history.
 * @param {string} currentMessage - The new user input.
 * @param {Function} onChunk - Callback for each stream chunk.
 * @param {Function} onError - Callback for errors.
 */
export const streamGeminiResponse = async (apiKey, modelName, messages, currentMessage, onChunk, onError) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    // Build history for Gemini (excluding the current user message)
    const history = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({
      history: history.slice(0, -1),
    });

    const result = await chat.sendMessageStream(currentMessage);
    
    let fullResponse = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      onChunk(fullResponse);
    }
    
    return fullResponse;
  } catch (error) {
    console.error('Gemini API Error:', error);
    if (onError) onError(error);
    throw error;
  }
};
