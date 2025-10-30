# train_model_semantic.py
# STEP 5: Train model with semantic embeddings (sentence-transformers)

import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import joblib
from pathlib import Path

# ---------- PATHS ----------
ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data" / "processed"
MODEL_DIR = ROOT / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

INPUT_CSV = DATA_DIR / "final_dataset.csv"

# ---------- LOAD DATA ----------
df = pd.read_csv(INPUT_CSV)
print(f"🚀 Semantic training started...\n📘 Loaded {len(df)} rows")

X = df["Question_Text"]
y = df["Topic"]

# ---------- ENCODER ----------
print("🔠 Loading sentence transformer model (MiniLM)...")
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

X_emb = model.encode(X.tolist(), show_progress_bar=True)

# Split
X_train, X_test, y_train, y_test = train_test_split(X_emb, y, test_size=0.25, random_state=42)

# Train classifier
clf = LogisticRegression(max_iter=300, class_weight='balanced')
clf.fit(X_train, y_train)

# Evaluate
y_pred = clf.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"\n✅ Semantic Model Accuracy: {acc:.2f}\n")
print("📊 Classification Report:")
print(classification_report(y_test, y_pred))

# Save
joblib.dump(clf, MODEL_DIR / "dsa_semantic_model.pkl")
joblib.dump(model, MODEL_DIR / "dsa_semantic_encoder.pkl")
print(f"💾 Models saved in {MODEL_DIR}")

# Example prediction
sample_q = "Explain Dijkstra’s algorithm for shortest path with example."
sample_emb = model.encode([sample_q])
pred = clf.predict(sample_emb)[0]
print(f"\n🧩 Example prediction:\nQ: {sample_q}\nPredicted Topic: {pred}")
