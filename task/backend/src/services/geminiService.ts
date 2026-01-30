import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('⚠️  Gemini API key not configured. AI features will be disabled.');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const geminiService = {
  async getHealthAdvice(symptoms: string, medicalHistory?: string): Promise<string> {
    if (!genAI) {
      throw new Error('Gemini API is not configured. Please add a valid GEMINI_API_KEY to your .env file.');
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `You are a helpful medical AI assistant. A patient is experiencing the following symptoms: ${symptoms}.
      ${medicalHistory ? `Their medical history includes: ${medicalHistory}.` : ''}
      
      Please provide:
      1. Possible causes (general information only)
      2. Self-care recommendations
      3. When to seek immediate medical attention
      4. General health tips
      
      Important: Always remind them to consult with a healthcare professional for proper diagnosis and treatment.
      Keep the response concise, helpful, and easy to understand.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error: any) {
      console.error('Gemini API error:', error);
      if (error.message?.includes('403') || error.message?.includes('API key')) {
        throw new Error('Invalid Gemini API key. Please get a new key from https://makersuite.google.com/app/apikey');
      }
      throw new Error('Failed to get health advice. Please try again later.');
    }
  },

  async getDoctorRecommendation(symptoms: string): Promise<string> {
    if (!genAI) {
      throw new Error('Gemini API is not configured. Please add a valid GEMINI_API_KEY to your .env file.');
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Based on these symptoms: ${symptoms}
      
      Recommend which type of doctor specialist the patient should consult (e.g., Cardiologist, Dermatologist, Pediatrician, etc.).
      Provide a brief explanation why this specialist is recommended.
      Keep it concise and professional.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error: any) {
      console.error('Gemini API error:', error);
      if (error.message?.includes('403') || error.message?.includes('API key')) {
        throw new Error('Invalid Gemini API key. Please get a new key from https://makersuite.google.com/app/apikey');
      }
      throw new Error('Failed to get doctor recommendation. Please try again later.');
    }
  },

  async getHealthTips(category: string): Promise<string> {
    if (!genAI) {
      throw new Error('Gemini API is not configured. Please add a valid GEMINI_API_KEY to your .env file.');
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Provide 5 practical health tips for ${category}.
      Make them actionable, easy to follow, and evidence-based.
      Format as a numbered list.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error: any) {
      console.error('Gemini API error:', error);
      if (error.message?.includes('403') || error.message?.includes('API key')) {
        throw new Error('Invalid Gemini API key. Please get a new key from https://makersuite.google.com/app/apikey');
      }
      throw new Error('Failed to get health tips. Please try again later.');
    }
  },

  async analyzeMedicalReport(reportText: string): Promise<string> {
    if (!genAI) {
      throw new Error('Gemini API is not configured. Please add a valid GEMINI_API_KEY to your .env file.');
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Analyze this medical report and provide a simple explanation in layman's terms:
      
      ${reportText}
      
      Explain:
      1. Key findings
      2. What the values mean
      3. Any areas of concern
      4. General recommendations
      
      Keep it simple and easy to understand for non-medical professionals.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error: any) {
      console.error('Gemini API error:', error);
      if (error.message?.includes('403') || error.message?.includes('API key')) {
        throw new Error('Invalid Gemini API key. Please get a new key from https://makersuite.google.com/app/apikey');
      }
      throw new Error('Failed to analyze report. Please try again later.');
    }
  },
};
