# Cognify Companion – Research Assistant

Cognify Companion is a full-stack AI-powered research assistant that enables users to upload academic papers (PDFs) and receive:

- Summarized content
- Extracted keywords
- Project ideas
- Suggested research methodology

This project consists of:

- **Backend (FastAPI)** – Located in the `research-summarizer` folder
- **Frontend (Next.js + Tailwind CSS)** – Located in the `cognify-companion` folder

---

## Project Structure

```
Cognify_Companion/
├── research-summarizer/       # FastAPI backend
│   └── app.py
│   └── requirements.txt
├── cognify-companion/         # Next.js frontend
│   └── src/app/
│       └── components/
│       └── upload/
│       └── result/
│   └── package.json
```

---

## Prerequisites

- Python 3.9+
- Node.js + npm
- pip (Python package installer)

---

## 1. Running the Backend (FastAPI)

### Navigate to the backend directory:
```bash
cd research_summarizer
```

### Create a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
```

### Install dependencies:
```bash
pip install -r requirements.txt
```

### Start the server:
```bash
uvicorn app:app --reload
```

The backend will be running at:  
`http://localhost:8000`  
Swagger docs available at: `http://localhost:8000/docs`

---

## 2. Running the Frontend (Next.js)

### Navigate to the frontend directory:
```bash
cd cognify-companion
```

### Install dependencies:
```bash
npm install
npm install framer-motion
```

### Start the development server:
```bash
npm run dev
```

The frontend will be accessible at:  
`http://localhost:3000`

---

## API Endpoint Reference

The frontend sends a POST request to:
```
POST http://localhost:8000/uploadfile/
```

With the uploaded file (as `FormData`).  
The backend returns a JSON response containing:
- `summary`
- `keywords`
- `project_ideas`
- `methodology`

---

## Environment Variables (Frontend)

Create a `.env.local` file in the `cognify-companion` directory:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## License

MIT License © 2025 Sherone Namasivayam