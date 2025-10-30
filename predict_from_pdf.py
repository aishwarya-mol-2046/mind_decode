import fitz
import re
import pandas as pd
import joblib
from sentence_transformers import SentenceTransformer
from pathlib import Path
from sklearn.metrics.pairwise import cosine_similarity
import matplotlib.pyplot as plt
import seaborn as sns

# ---------- PATHS ----------
ROOT = Path(__file__).resolve().parent
MODEL_DIR = ROOT / "models"
DATA_DIR = ROOT / "data" / "processed"

MODEL_PATH = MODEL_DIR / "dsa_semantic_model.pkl"
ENCODER_PATH = MODEL_DIR / "dsa_semantic_encoder.pkl"

# ---------- LOAD TRAINED MODELS ----------
print("🚀 Loading model and encoder...")
clf = joblib.load(MODEL_PATH)
encoder = joblib.load(ENCODER_PATH)
print("✅ Model and encoder loaded successfully.")

# ---------- HELPER FUNCTIONS ----------
def extract_text_from_pdf(pdf_path):
    """Extract all text from a text-based PDF"""
    doc = fitz.open(pdf_path)
    pages = [doc[p].get_text("text") for p in range(len(doc))]
    return "\n".join(pages)

def split_into_questions(text):
    """Split PDF text into individual questions"""
    parts = re.split(r'\n(?=\s*(?:Q? ?\d+[\.\)]))', text)
    if len(parts) <= 1:
        parts = [p.strip() for p in text.split("\n\n") if len(p.strip()) > 30]
    else:
        parts = [p.strip() for p in parts if len(p.strip()) > 30]
    return parts

def clean_text(s):
    s = re.sub(r'\s+', ' ', s)
    return s.strip()

# ---------- MAIN PIPELINE ----------
def predict_from_pdf(pdf_path):
    print(f"\n📘 Reading: {pdf_path}")
    text = extract_text_from_pdf(pdf_path)
    questions = split_into_questions(text)
    print(f"   ➜ Found {len(questions)} questions.")

    cleaned_qs = [clean_text(q) for q in questions]
    embeddings = encoder.encode(cleaned_qs, show_progress_bar=True)
    preds = clf.predict(embeddings)

    df = pd.DataFrame({
        "Question_Text": cleaned_qs,
        "Predicted_Topic": preds
    })

    # Compare to existing dataset for similarity
    base_data = pd.read_csv(DATA_DIR / "final_dataset.csv")
    base_emb = encoder.encode(base_data["Question_Text"].tolist())

    for i, q in enumerate(cleaned_qs[:5]):  # top 5 samples
        sim_scores = cosine_similarity([embeddings[i]], base_emb)[0]
        idx = sim_scores.argmax()
        df.loc[i, "Most_Similar_Question"] = base_data.iloc[idx]["Question_Text"]
        df.loc[i, "Similarity_Score"] = sim_scores[idx]

    # Save predictions
    output_path = DATA_DIR / "new_pdf_predictions.csv"
    df.to_csv(output_path, index=False)
    print(f"✅ Predictions saved to: {output_path}")

    # Topic distribution chart
    plt.figure(figsize=(10,6))
    sns.countplot(x="Predicted_Topic", data=df, order=df["Predicted_Topic"].value_counts().index, palette="mako")
    plt.title("Topic Distribution - Uploaded Question Paper", fontsize=14)
    plt.xticks(rotation=30)
    plt.tight_layout()
    plt.savefig(DATA_DIR / "uploaded_pdf_topic_distribution.png")
    print("📊 Graph saved at:", DATA_DIR / "uploaded_pdf_topic_distribution.png")

    print("\n🧩 Sample Predictions:")
    print(df.head(10))

    return df

# ---------- RUN THIS ----------
if __name__ == "__main__":
    # 👇 Change the path here to your uploaded PDF
    predict_from_pdf("uploads/5_years_questions.pdf")
