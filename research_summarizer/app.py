import os
import json
import nltk
import torch
import fitz
import requests
from tqdm import tqdm
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from keybert import KeyBERT
from nltk.corpus import stopwords
from sentence_transformers import SentenceTransformer
from pathlib import Path

# Load environment variables
dotenv_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path)

nltk.download("punkt")
nltk.download("stopwords")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/tmp", StaticFiles(directory="/tmp"), name="tmp")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[INFO] Using device: {device}")

transformer_model_name = "facebook/bart-large-cnn"
transformer_tokenizer = AutoTokenizer.from_pretrained(transformer_model_name)
transformer_model = AutoModelForSeq2SeqLM.from_pretrained(transformer_model_name).to(device)
print("[INFO] Summarizer loaded.")

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
kw_model = KeyBERT(model=embedding_model)

stop_words = set(stopwords.words("english"))

def extract_text_from_pdf(pdf_path):
    try:
        text = ""
        with fitz.open(pdf_path) as doc:
            if doc.is_encrypted:
                print("[ERROR] PDF is encrypted.")
                return ""
            for page in doc:
                text += page.get_text("text")
        return text
    except Exception as e:
        print(f"[ERROR] PDF extraction: {e}")
        return ""

def split_text_into_chunks(text, chunk_size=1000):
    sentences = nltk.sent_tokenize(text)
    chunks, current_chunk, chunk_len = [], [], 0
    for sentence in sentences:
        words = sentence.split()
        if chunk_len + len(words) <= chunk_size:
            current_chunk.append(sentence)
            chunk_len += len(words)
        else:
            chunks.append(" ".join(current_chunk))
            current_chunk, chunk_len = [sentence], len(words)
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    return chunks or [text]

def summarize_text(text, max_length=200, min_length=50):
    try:
        inputs = transformer_tokenizer.encode("summarize: " + text, return_tensors="pt", truncation=True, max_length=1024).to(device)
        summary_ids = transformer_model.generate(inputs, max_length=max_length, min_length=min_length, num_beams=3)
        return transformer_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    except Exception as e:
        print(f"[ERROR] Summarization: {e}")
        return "Summarization error."

def generate_summary_points(text, max_length=100):
    try:
        inputs = transformer_tokenizer.encode("summarize: " + text, return_tensors="pt", truncation=True, max_length=512).to(device)
        summary_ids = transformer_model.generate(inputs, max_length=max_length, num_beams=2)
        summary = transformer_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        key_points = summary.split(". ")
        bullet_points = "\n- ".join([point.strip() for point in key_points if point.strip()])
        return f"- {bullet_points}" if bullet_points else "No key points found."
    except Exception as e:
        print(f"[ERROR] Key points: {e}")
        return "Key point generation error."

def extract_relevant_keywords(text, num_keywords=5):
    try:
        if not text.strip():
            return []
        keywords = kw_model.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words="english", top_n=num_keywords)
        return [kw[0] for kw in keywords]
    except Exception as e:
        print(f"[ERROR] Keyword extraction: {e}")
        return []

def preprocess_text(text):
    return " ".join([word for word in text.split() if word.lower() not in stop_words])

def highlight_sentences_in_pdf(pdf_path, key_points, threshold=1):
    try:
        with fitz.open(pdf_path) as doc:
            if doc.is_encrypted:
                print("[ERROR] PDF is encrypted.")
                return None
            for page in doc:
                sentences = page.get_text("text").split("\n")
                for key_point in key_points:
                    key_clean = preprocess_text(key_point)
                    for sentence in sentences:
                        sentence_clean = preprocess_text(sentence)
                        if len(set(sentence_clean.split()) & set(key_clean.split())) >= threshold:
                            insts = page.search_for(sentence)
                            for inst in insts:
                                page.add_highlight_annot(inst)
            highlighted_path = f"/tmp/{os.path.splitext(os.path.basename(pdf_path))[0]}_highlighted.pdf"
            doc.save(highlighted_path)
            return highlighted_path
    except Exception as e:
        print(f"[ERROR] PDF highlighting: {e}")
        return None

def extract_methodology_with_openrouter(summary_text):
    prompt = f"""
   Given the following summary of a research paper, please extract the specific research methodology used in the study. The methodology should include the research design, data collection methods, data analysis techniques, and any tools or frameworks used. Additionally, provide a brief description or explanation of the methodology.

    Summary: {summary_text}

    Methodology:
    """
    
    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json",
    }
    data = json.dumps({
        "model": "deepseek/deepseek-r1:free",
        "messages": [{"role": "user", "content": prompt}]
    })
    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, data=data)
    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"].strip()
    else:
        print(f"[ERROR] OpenRouter API: {response.status_code}, {response.text}")
        return "Methodology extraction failed."

def extract_key_sections(summary_text):
    prompt = f"""
    Please extract the key sections from the following research paper summary. Focus on the abstract, conclusion, and future work sections.

    Summary: {summary_text}

    Key Sections::
    """
    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json",
    }
    data = json.dumps({
        "model": "nousresearch/deephermes-3-llama-3-8b-preview:free",
        "messages": [{"role": "user", "content": prompt}]
    })
    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, data=data)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"[ERROR] Key section extraction failed: {e}")
        return None

def generate_project_ideas(key_sections):
    if not key_sections:
        return "Project idea generation skipped due to missing key sections."

    prompt = f"""
       Please generate creative and feasible **project ideas** based on the following research paper summary.
        Use the context from the abstract, conclusion, and future work to suggest:
        - Real-world implementation ideas
        - Academic or industry research projects
        - Prototype or product development ideas
        - Applications of the findings

        Research Summary Key Sections:
        {key_sections}

        Project Ideas:
    """
    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json",
    }
    data = json.dumps({
        "model": "nousresearch/deephermes-3-llama-3-8b-preview:free",
        "messages": [{"role": "user", "content": prompt}]
    })
    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, data=data)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"[ERROR] Project idea generation failed: {e}")
        return "Project idea generation failed."

@app.post("/summarize-pdf/")
async def summarize_pdf(file: UploadFile = File(...)):
    try:
        upload_dir = "/tmp"
        os.makedirs(upload_dir, exist_ok=True)
        pdf_path = os.path.join(upload_dir, file.filename)

        with open(pdf_path, "wb") as f:
            f.write(await file.read())

        text = extract_text_from_pdf(pdf_path)
        if not text.strip():
            return JSONResponse(status_code=400, content={"error": "PDF has no extractable text."})

        chunks = split_text_into_chunks(text)
        summaries, keywords_set, key_points_all = [], set(), []

        for chunk in tqdm(chunks, desc="Processing chunks"):
            summary = summarize_text(chunk)
            summaries.append(summary)
            keywords_set.update(extract_relevant_keywords(chunk))
            key_points_all.extend(generate_summary_points(chunk).split("\n"))

        merged_summary = " ".join(summaries)
        key_sections = extract_key_sections(merged_summary)
        idea_generated = generate_project_ideas(key_sections) if key_sections else "Project idea generation skipped."
        methodology = extract_methodology_with_openrouter(merged_summary)
        highlighted_pdf = highlight_sentences_in_pdf(pdf_path, key_points_all)
        highlighted_pdf_url = f"/tmp/{os.path.basename(highlighted_pdf)}" if highlighted_pdf else None

        return {
            "summary": "\n\n".join(summaries),
            "keywords": list(keywords_set),
            "key_points": key_points_all,
            "highlighted_pdf_url": highlighted_pdf_url,
            "methodology": methodology,
            "key_sections": key_sections,
            "project_ideas": idea_generated
        }

    except Exception as e:
        print(f"[ERROR] API /summarize-pdf: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})
