# auto_predict_dataset.py
# Automatically predict topic for all questions and visualize topic distribution

import joblib
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sentence_transformers import SentenceTransformer
from pathlib import Path

# ---------- PATHS ----------
ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data" / "processed"
MODEL_DIR = ROOT / "models"

FINAL_DATA = DATA_DIR / "final_dataset.csv"
MODEL_PATH = MODEL_DIR / "dsa_semantic_model.pkl"
ENCODER_PATH = MODEL_DIR / "dsa_semantic_encoder.pkl"
OUTPUT_FILE = DATA_DIR / "predicted_questions.csv"
GRAPH_PATH = DATA_DIR / "topic_distribution.png"

# ---------- LOAD ----------
print("🚀 Loading model and encoder...")
clf = joblib.load(MODEL_PATH)
encoder = joblib.load(ENCODER_PATH)
df = pd.read_csv(FINAL_DATA)

print(f"✅ Loaded {len(df)} questions from dataset.")

# ---------- PREDICT ----------
print("\n🔠 Encoding questions and predicting topics...")
embeddings = encoder.encode(df["Question_Text"].tolist(), show_progress_bar=True)
preds = clf.predict(embeddings)

# Add predictions as a new column
df["Predicted_Topic"] = preds

# ---------- SAVE RESULTS ----------
df.to_csv(OUTPUT_FILE, index=False)
print(f"\n✅ Predictions completed and saved to: {OUTPUT_FILE}")

# ---------- VISUALIZE TOPIC DISTRIBUTION ----------
print("\n📊 Generating topic distribution graph...")

plt.figure(figsize=(10, 6))
sns.countplot(x="Predicted_Topic", data=df, order=df["Predicted_Topic"].value_counts().index, palette="viridis")
plt.title("Topic Distribution of Predicted DSA Questions", fontsize=14)
plt.xlabel("Topic", fontsize=12)
plt.ylabel("Number of Questions", fontsize=12)
plt.xticks(rotation=30)
plt.tight_layout()

# Save graph
plt.savefig(GRAPH_PATH)
print(f"✅ Topic distribution graph saved at: {GRAPH_PATH}")

print("\n🧩 Sample Predictions:")
print(df[["Question_Text", "Predicted_Topic", "Difficulty_Level"]].head(10))

