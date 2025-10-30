# extract_to_csv.py
# STEP 2: Extract text questions from PDFs and build a structured CSV dataset

import fitz       # PyMuPDF
import re
import pandas as pd
from pathlib import Path
import numpy as np

# ---------- PATHS ----------
ROOT = Path(__file__).resolve().parent
RAW_DIR = ROOT / "data" / "raw"
PROCESSED_DIR = ROOT / "data" / "processed"
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_CSV = PROCESSED_DIR / "questions_dataset.csv"

# ---------- FUNCTIONS ----------
def extract_text_from_pdf(pdf_path):
    """Extract all text from a text-based PDF"""
    doc = fitz.open(pdf_path)
    pages = [doc[p].get_text("text") for p in range(len(doc))]
    return "\n".join(pages)

def split_into_questions(text):
    """
    Split text into separate questions.
    Detect patterns like 1., Q1., (a), etc.
    """
    parts = re.split(r'\n(?=\s*(?:Q? ?\d+[\.\)]))', text)
    if len(parts) <= 1:
        parts = [p.strip() for p in text.split("\n\n") if len(p.strip()) > 30]
    else:
        parts = [p.strip() for p in parts if len(p.strip()) > 30]
    return parts

def extract_marks(q):
    m = re.search(r'(\d+)\s*(?:marks|Marks)|\((\d+)\)', q)
    if m:
        for g in m.groups():
            if g:
                return int(g)
    return np.nan

def detect_question_type(q):
    ql = q.lower()
    if any(w in ql for w in ["define", "what is", "explain", "describe", "given a"]):
        return "Theory"
    if any(w in ql for w in ["derive", "prove", "show that", "discuss"]):
        return "Derivation"
    if any(w in ql for w in ["design", "implement", "develop"]):
        return "Design"
    return "Problem"

def clean_text(s):
    s = re.sub(r'\s+', ' ', s)
    s = re.sub(r'Page \d+ of \d+', '', s)
    return s.strip()

# ---------- MAIN PIPELINE ----------
def build_dataset():
    pdfs = list(RAW_DIR.glob("*.pdf"))
    if not pdfs:
        print("❌ No PDFs found in data/raw/")
        return None
    
    rows = []
    pdf_summary = {}  # to track counts per file

    for pdf in pdfs:
        subj = "DSA"  # all PDFs are DSA subject
        print(f"\n📖 Extracting from: {pdf.name} ({subj})")

        text = extract_text_from_pdf(pdf)
        questions = split_into_questions(text)
        print(f"   ➜ Found {len(questions)} possible questions")

        pdf_summary[pdf.name] = len(questions)

        for q in questions:
            q_clean = clean_text(q)
            marks = extract_marks(q)
            qtype = detect_question_type(q)

            rows.append({
                "Subject": subj,
                "Question_Text": q_clean,
                "Marks": marks if not np.isnan(marks) else np.random.choice([2, 5, 10], p=[0.5, 0.3, 0.2]),
                "Question_Type": qtype
            })

    df = pd.DataFrame(rows)

    # Assign difficulty heuristically
    def mark_to_diff(m):
        if m <= 2:
            return "Easy"
        elif m <= 5:
            return "Medium"
        return "Hard"
    df["Difficulty_Level"] = df["Marks"].apply(mark_to_diff)

    # Save CSV
    df.to_csv(OUTPUT_CSV, index=False)
    print(f"\n✅ Dataset saved to: {OUTPUT_CSV}")
    print(f"📊 Total questions extracted: {len(df)}")

    # Per-file summary
    print("\n📚 Question count per PDF:")
    for pdf_name, count in pdf_summary.items():
        print(f"   {pdf_name}: {count} questions")

    print("\n✅ Extraction complete!\n")
    print(df.head())

# ---------- RUN ----------
if __name__ == "__main__":
    build_dataset()
