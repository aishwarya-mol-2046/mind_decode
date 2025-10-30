# train_model.py
# STEP 4: Train ML model using TF-IDF + Logistic Regression

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import joblib

# ---------- PATHS ----------
ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data" / "processed"
MODEL_DIR = ROOT / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)
OUTPUTS_DIR = ROOT / "outputs"
OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)

INPUT_CSV = DATA_DIR / "final_dataset.csv"

# ---------- LOAD DATA ----------
df = pd.read_csv(INPUT_CSV)
print(f"🚀 Training pipeline started...\n📘 Loaded {len(df)} rows from {INPUT_CSV}")

X = df["Question_Text"]
y = df["Topic"]

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# TF-IDF
print("🔠 Building TF-IDF features...")
vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1,2))
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# Train model
print("🧠 Training Logistic Regression classifier...")
clf = LogisticRegression(max_iter=300, class_weight='balanced')
clf.fit(X_train_tfidf, y_train)

# Evaluate
y_pred = clf.predict(X_test_tfidf)
acc = accuracy_score(y_test, y_pred)
print(f"\n✅ Model Accuracy: {acc:.2f}\n")
print("📊 Classification Report:")
print(classification_report(y_test, y_pred))

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred, labels=sorted(df["Topic"].unique()))
plt.figure(figsize=(10, 7))
sns.heatmap(cm, annot=True, fmt="d", xticklabels=sorted(df["Topic"].unique()),
            yticklabels=sorted(df["Topic"].unique()))
plt.title("Confusion Matrix - TFIDF + Logistic Regression")
plt.xlabel("Predicted")
plt.ylabel("True")
plt.tight_layout()
plt.savefig(OUTPUTS_DIR / "confusion_matrix_tfidf_lr.png")

# Save model
joblib.dump(clf, MODEL_DIR / "dsa_tfidf_lr_model.pkl")
joblib.dump(vectorizer, MODEL_DIR / "dsa_tfidf_vectorizer.pkl")
print(f"💾 Model and vectorizer saved to {MODEL_DIR}")
