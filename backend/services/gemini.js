import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

async function generateAIResponse(prompt, forQuiz) {
  // Initialize the generative AI model with your API key
  const genAI = new GoogleGenerativeAI(process.env.geminiApiKey);

  // Use the model you want (gemini-1.5-flash, gemini-1.5-pro, etc.)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // const finalPrompt = forQuiz
    //   ? "Give me just the 20 questions in json format with 4 options and the correct option from the given paragraph. Please don't give me any other text. " +
    //     prompt
    //   : "I have this following content. I want you to make the concise note i.e. easy to study without not much extra text, just the response: " +
    //     prompt;

    const finalPrompt = forQuiz
      ? `Generate exactly 20 multiple choice questions from the given content. Return ONLY a JSON array with this exact format:
            [
              {
                "question": "Your question here?",
                "options": ["Actual answer choice 1", "Actual answer choice 2", "Actual answer choice 3", "Actual answer choice 4"],
                "answer": "Actual answer choice 1"
              }
            ]
            
            IMPORTANT RULES:
            - Each "options" array must contain 4 REAL answer choices, not letters like A, B, C, D
            - The "answer" field must contain the exact text of the correct option
            - Make sure all options are plausible and related to the content
            - Return only the JSON array, no other text or markdown
            
            Content: ` + prompt
      : "I have this following content. I want you to make the concise note i.e. easy to study without not much extra text, just the response: " +
        prompt;

    // Generate content based on the provided prompt
    const result = await model.generateContent(finalPrompt);

    // Return the result text
    console.log(result.response.text());
    return result.response.text();
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}

export { generateAIResponse };
