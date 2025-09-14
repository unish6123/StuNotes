import { GoogleGenerativeAI } from "@google/generative-ai"; 
import 'dotenv/config';

async function generateAIResponse(prompt) {
    // Initialize the generative AI model with your API key
    const genAI = new GoogleGenerativeAI(process.env.geminiApiKey);

    // Use the model you want (gemini-1.5-flash, gemini-1.5-pro, etc.)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const finalPrompt = "Give me just the 20 questions in json format with 4 options and the correct option from the given paragraph.Please don't give me the any other text." + prompt
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
