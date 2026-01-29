import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `You are an expert DSA (Data Structures & Algorithms) instructor. Your role is to:

1. Explain data structures (arrays, linked lists, trees, graphs, hash tables, etc.) with the help of example
2. Teach algorithms (sorting, searching, dynamic programming, greedy, etc.)
3. Analyze time and space complexity (Big O notation)
4. Provide clear code examples in  C++,Java,python
5. Break down complex concepts into simple explanations
6. Help students debug and optimize their code
7. Suggest practice problems and resources

Always be encouraging, patient, and provide step-by-step explanations. Use examples and analogies when helpful.`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }


    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

   //chat with the model
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I am now a DSA instructor ready to help students learn data structures and algorithms.' }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Gemini API configured`);
});