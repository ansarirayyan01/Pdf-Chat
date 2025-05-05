import { Worker } from 'bullmq';
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define API key - use environment variable if available, otherwise use hardcoded key
const API_KEY = process.env.GOOGLE_API_KEY;

const worker = new Worker(
    'file-upload-queue',
    async job => {
        const data = JSON.parse(job.data);
        /*
            path: data.path,
            read the pdf from path
            chunk the pdf
            call the openai embedding model for each chunk
            store the chunk in qdrant db
        */
        // Load the PDF file
        const loader = new PDFLoader(data.path);
        const docs = await loader.load();

        const embeddings = new GoogleGenerativeAIEmbeddings({
            modelName: "embedding-001",
            apiKey: API_KEY
        });


        const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
            url: "http://localhost:6333",
            collectionName: "langchainjs-testing",
        });

        await vectorStore.addDocuments(docs);

        console.log("Added documents to Qdrant DB");

    },
    {
        connection: {
            host: 'localhost',
            port: 6379,
        },
    }

);