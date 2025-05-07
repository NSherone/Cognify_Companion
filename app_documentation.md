
# FastAPI Backend – Cognify Companion

This is the backend service for the Cognify Companion research assistant application. Built using FastAPI, it allows users to upload research PDFs and returns:

- Summarized content  
- Key insights  
- Project ideas  
- Suggested research methodology

## Core File: `app.py`

This file defines the main API application. It handles:

- PDF upload via `POST /uploadfile/`  
- Text extraction and preprocessing  
- Model-based summarization  
- Keyword extraction using embeddings  
- Returns a structured JSON response

## Key Features

- PDF Upload Support via FastAPI's `UploadFile`
- Text Extraction using `PyMuPDF (fitz)`
- Summarization via `facebook/bart-large-cnn`
- Keyword Extraction using `KeyBERT + MiniLM-L6-v2`
- Idea/Methodology Generation via `nousresearch/deephermes-3-llama-3-8b-preview`
- CORS Enabled for frontend communication
- Mounted `/tmp` static folder for temporary file access

## API Endpoints

### `POST /uploadfile/`
Uploads a PDF file and returns:
```json
{
  "summary": "...",
  "keywords": ["AI", "federated learning", "privacy"],
  "project_ideas": [...],
  "methodology": {...}
}
```

**Request**:  
- `multipart/form-data` with key: `file`

**Response**:  
- `application/json` with generated insights

## Directory Structure

```
reserach_summarizer/
├── app.py                   # Main FastAPI application
├── tmp/                     # Temporary PDF storage
└── requirements.txt         # Python dependencies
```

## Models Used

| Task | Model |
|------|-------|
| Summarization | facebook/bart-large-cnn |
| Keyword Extraction | KeyBERT + MiniLM-L6-v2 |
| Project Ideas | nousresearch/deephermes-3-llama-3-8b-preview |
| Methodology | nousresearch/deephermes-3-llama-3-8b-preview |

## Dependencies

```bash
pip install -r requirements.txt
```

## Running the App

### 1. Clone the Repository
```bash
git clone https://github.com/NSherone/Cognify_Companion.git
cd Cognify_Companion
```

### 2. Run FastAPI App
```bash
uvicorn app:app --reload
```

### 3. Open in Browser
Visit: http://127.0.0.1:8000/docs  
To test your endpoints via Swagger UI.

## CORS Configuration

CORS middleware is enabled in `app.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

This allows access from any frontend domain (useful during development).

## Notes

- Automatically downloads NLTK resources (stopwords, punkt)
- Optimized for GPU use if available
- Can be extended to support multi-file upload or streaming PDFs

## Author

Sherone Namasivayam  
GitHub: https://github.com/NSherone

## License

MIT License © 2025 Sherone Namasivayam
