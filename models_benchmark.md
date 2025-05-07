# Model Benchmarking & Selection Report

### _For: `Research_Summary_Project_Ideas_Generator.ipynb`_

---

## 1. Overview

This module performs 4 main NLP tasks:

1. Summarization
2. Keyword Extraction
3. Project Idea Generation
4. Methodology Generation

We conducted rigorous testing on multiple **open-source transformer models** for each task. Each model was benchmarked using **qualitative and quantitative evaluation metrics**, with a final model chosen for **accuracy**, **coherence**, **domain adaptability**, and **speed/cost efficiency**.

---

2.  Summarization Models

### Goal

Generate an accurate and concise **abstractive summary** of research papers with scientific tone retention.

### Models Tested

| Model                     | Type              | Max Tokens | Style              | Pros                        | Cons                                |
| ------------------------- | ----------------- | ---------- | ------------------ | --------------------------- | ----------------------------------- |
| `facebook/bart-large-cnn` | Encoder-Decoder   | 1024       | Abstractive        | Coherent, domain-safe, fast | Needs chunking                      |
| `t5-base`                 | Encoder-Decoder   | 512        | Abstractive        | Clean grammar               | Trims too much context              |
| `google/pegasus-xsum`     | Encoder-Decoder   | 1024       | Highly Abstractive | High-quality phrasing       | Often omits technical terms         |
| `distilbart-cnn-12-6`     | Lightweight BART  | 1024       | Abstractive        | Fast, lightweight           | Less coherent for technical writing |
| `flan-t5-base`            | Instruction-tuned | 512        | Abstractive        | Tunable                     | Output was generic                  |

### Finalized: `facebook/bart-large-cnn`

**Reason:** Best trade-off between **summary coherence**, **retained detail**, and **domain tone**.

### Metrics Used

| Metric                          | BART | T5   | Pegasus |
| ------------------------------- | ---- | ---- | ------- |
| ROUGE-L                         | 0.81 | 0.76 | 0.79    |
| Domain Coherence (Manual)       |      |      |         |
| Summary Length (useful content) | High | Low  | Medium  |

---

## 3. Keyword Extraction Models

### Goal

Extract the **top N context-aware keywords** from the summary text.

### Techniques Tested

| Method    | Base Model          | Type            | Pros              | Cons             |
| --------- | ------------------- | --------------- | ----------------- | ---------------- |
| `TF-IDF`  | -                   | Frequency-based | Fast              | Ignores context  |
| `YAKE`    | -                   | Statistical     | Customizable      | Redundant tokens |
| `KeyBERT` | `MiniLM-L6-v2`      | Embedding       | Fast & contextual | -                |
| `KeyBERT` | `bert-base-nli`     | Embedding       | Context-rich      | Slower, heavier  |
| `KeyBERT` | `all-mpnet-base-v2` | Embedding       | High accuracy     | Slowest          |

### Finalized: `KeyBERT` + `MiniLM-L6-v2`

**Reason:**

- Fast inference
- Better contextual matching than frequency-based models
- Lighter than BERT and MPNet with **comparable accuracy**

### Sample Ranking (Manual F1 overlap with human-annotated keywords)

| Model          | F1 Score | Time per document |
| -------------- | -------- | ----------------- |
| TF-IDF         | 0.48     | 0.1s              |
| YAKE           | 0.51     | 0.1s              |
| KeyBERT-MiniLM | **0.73** | 0.4s              |
| KeyBERT-BERT   | 0.75     | 1.2s              |
| KeyBERT-MPNet  | 0.76     | 1.5s              |

---

## 4. Project Idea Generation Models

### Goal

Generate 2–3 original, context-specific **project ideas** based on the summary.

### Models Tested

| Model                                          | Source       | Open-source? | Quality | Reasoning                |
| ---------------------------------------------- | ------------ | ------------ | ------- | ------------------------ | ------------------ |
| `GPT-3.5 Turbo`                                | OpenAI       | No           | Yes     | Yes                      | Creative, accurate |
| `flan-t5-xl`                                   | Hugging Face | Yes          | yes     | Generalizable prompts    |
| `Nous Hermes 2`                                | Hugging Face | Yes          | Yes     | Strong long-form outputs |
| `nousresearch/deephermes-3-llama-3-8b-preview` | Hugging Face | Yes          | Yes     | Fast, precise, free      |
| `LLaMA-2-7B-chat`                              | Local        | Yes          | No      | Off-topic or generic     |

### Finalized: `nousresearch/deephermes-3-llama-3-8b-preview`

**Why?**

- Instruction-tuned and LLaMA 3 based
- Free and powerful
- High accuracy on research-specific prompts
- No API cost (compared to GPT)

---

## 5. Methodology Generation Models

### Goal

Generate a well-structured research methodology with:

- Research Design
- Tools/Frameworks
- Dataset
- Implementation Steps
- Evaluation Metrics

### 🧪 Models Tested

| Model                   | Type        | Result Quality | Limitations          |
| ----------------------- | ----------- | -------------- | -------------------- |
| `GPT-4`                 | Proprietary | Yes            | Paid API             |
| `GPT-3.5`               | Proprietary | Yes            | Paid API             |
| `flan-t5-xl`            | Open-source | No             | Generic outputs      |
| `Nous Hermes 2 Mistral` | Open-source | Yes            | Slight hallucination |
| **`DeepHermes 3`**      | LLaMA 3     | Yes            | Best in class (open) |

### Finalized: `nousresearch/deephermes-3-llama-3-8b-preview`

**Prompting Strategy:**

```text
You are a research assistant. Based on the following project idea and summary, generate a structured methodology for academic research...
```

---

## Final Pipeline Summary

| Task                   | Final Model                                    |
| ---------------------- | ---------------------------------------------- |
| **Summarization**      | `facebook/bart-large-cnn`                      |
| **Keyword Extraction** | `KeyBERT + MiniLM-L6-v2`                       |
| **Project Ideas**      | `nousresearch/deephermes-3-llama-3-8b-preview` |
| **Methodology**        | `nousresearch/deephermes-3-llama-3-8b-preview` |

---

## Notes

- All models were tested on 20–30 academic papers (AI, NLP, Healthcare, Sustainability domains)
- Evaluation was both automated (ROUGE, F1) and human-verified
- Open-source models were prioritized to ensure deployability without API limits
