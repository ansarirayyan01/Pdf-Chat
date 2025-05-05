import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Queue } from 'bullmq';
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define API key from environment variable
const API_KEY = process.env.GOOGLE_API_KEY;
console.log('API key loaded from environment variables');

const client = new GoogleGenerativeAI(API_KEY);

const myQueue = new Queue('file-upload-queue', {
    connection: {
        host: 'localhost',
        port: 6379,
    },
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${uniqueSuffix}-${file.originalname}`)
    }
});

const upload = multer({ storage: storage });

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/chat', async (req, res) => {
    try {
        const userQuery = req.query.message;
        console.log(`Processing query: ${userQuery}`);

        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: API_KEY,
            modelName: "embedding-001",
        });

        console.log('Connecting to Qdrant...');
        const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
            url: "http://localhost:6333",
            collectionName: "langchainjs-testing",
        });

        console.log('Retrieving relevant documents...');
        const ret = vectorStore.asRetriever({
            k: 2,
        });

        const result = await ret.invoke(userQuery);
        console.log(`Found ${result.length} relevant documents`);

        const SYSTEM_PROMPT = `You are a helpful assistant. Answer the user's question based on the provided context from the given pdf.
        Format your response in clean, readable markdown.
        Context:
        ${JSON.stringify(result)}
        `;

        console.log('Generating response with Gemini...');
        // Try with a more widely available model first
        const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chatResult = await model.generateContent({
            contents: [
                { role: "user", parts: [{ text: userQuery }] }
            ],
            systemInstruction: SYSTEM_PROMPT,
        });

        // Extract the response text
        const response = chatResult.response;
        const text = response.text();
        console.log('Response generated successfully');

        return res.json({
            message: text,
            docs: result.map(doc => ({
                pageContent: doc.pageContent,
                metadata: doc.metadata
            }))
        });
    } catch (error) {
        console.error("Error in chat endpoint:", error);
        return res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
});

app.post('/upload/pdf', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        await myQueue.add('file-ready', JSON.stringify({
            filename: req.file.originalname,
            destination: req.file.destination,
            path: req.file.path,
        }));
        res.json({ message: 'File uploaded successfully', file: req.file });
    } catch (error) {
        console.error("Error in file upload:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});