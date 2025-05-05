# PDF Chat RAG Application

A modern web application that allows users to upload PDF documents and chat with them using AI. The application uses Retrieval-Augmented Generation (RAG) to provide accurate answers based on the content of the uploaded PDFs.

![PDF Chat App](https://img.shields.io/badge/PDF%20Chat-RAG-red)

## Features

- **PDF Upload**: Easily upload PDF documents through a drag-and-drop interface
- **Document Processing**: Automatic processing of PDFs to extract and index content
- **Intelligent Chat**: Ask questions about your documents and get accurate answers
- **Source References**: See exactly which parts of your documents the answers come from
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS

## Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest version of React
- **Tailwind CSS**: Utility-first CSS framework
- **Clerk**: Authentication provider

### Backend
- **Express.js**: Node.js web application framework
- **LangChain**: Framework for building applications with LLMs
- **Google Generative AI (Gemini)**: AI model for generating responses
- **Qdrant**: Vector database for storing document embeddings
- **BullMQ**: Queue system for processing PDF uploads
- **Redis**: In-memory data store for queue management

## Architecture

The application follows a RAG (Retrieval-Augmented Generation) architecture:

1. **Upload**: PDFs are uploaded to the server
2. **Processing**: Documents are processed by a worker, split into chunks, and embedded
3. **Storage**: Embeddings are stored in Qdrant vector database
4. **Retrieval**: When a user asks a question, relevant document chunks are retrieved
5. **Generation**: The AI model generates a response based on the retrieved content

## Setup

### Prerequisites

- Node.js (v18 or higher)
- Redis server
- Qdrant server
- Google Generative AI API key

### Environment Variables

Create `.env` files in both the client and server directories:

#### Client `.env`
```
# Add your Clerk API keys and other frontend env variables here
```

#### Server `.env`
```
GOOGLE_API_KEY=your_google_api_key_here
```

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/pdf-chat-rag.git
   cd pdf-chat-rag
   ```

2. Install dependencies for both client and server
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. Start Redis and Qdrant services
   ```bash
   # Using Docker Compose
   docker-compose up -d
   ```

4. Start the server
   ```bash
   # In the server directory
   npm run dev
   
   # Start the worker in a separate terminal
   npm run dev:worker
   ```

5. Start the client
   ```bash
   # In the client directory
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Upload a PDF document using the upload interface
2. Wait for the document to be processed (this happens in the background)
3. Start asking questions about your document in the chat interface
4. View the AI-generated responses along with source references

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
