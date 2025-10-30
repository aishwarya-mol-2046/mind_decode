# predict_question.py
# STEP 6: Predict topic, difficulty, and cognitive level for new DSA question

import joblib
import pandas as pd
from sentence_transformers import SentenceTransformer
from pathlib import Path
from sklearn.metrics.pairwise import cosine_similarity

# ---------- PATHS ----------
ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data" / "processed"
MODEL_DIR = ROOT / "models"

FINAL_DATA = DATA_DIR / "final_dataset.csv"
MODEL_PATH = MODEL_DIR / "dsa_semantic_model.pkl"
ENCODER_PATH = MODEL_DIR / "dsa_semantic_encoder.pkl"

# ---------- LOAD MODELS ----------
print("🚀 Loading trained model and encoder...")
clf = joblib.load(MODEL_PATH)
encoder = joblib.load(ENCODER_PATH)
df = pd.read_csv(FINAL_DATA)

print("✅ Models and dataset loaded successfully!")

# ---------- PREDICTION FUNCTION ----------
def predict_question(question_text):
    q_vec = encoder.encode([question_text])
    topic_pred = clf.predict(q_vec)[0]

    # Get top similar question
    all_emb = encoder.encode(df["Question_Text"].tolist())
    sim_scores = cosine_similarity(q_vec, all_emb)[0]
    top_idx = sim_scores.argmax()
    similar_q = df.iloc[top_idx]["Question_Text"]
    similarity = sim_scores[top_idx]

    # Get extra info
    diff = df.iloc[top_idx]["Difficulty_Level"]
    cog = df.iloc[top_idx]["Cognitive_Level"]

    print("\n🧩 PREDICTION RESULT:")
    print(f"🧠 Question: {question_text}")
    print(f"📘 Predicted Topic: {topic_pred}")
    print(f"🎯 Difficulty Level: {diff}")
    print(f"🪜 Cognitive Level: {cog}")
    print(f"🔁 Most Similar Question: {similar_q[:120]}...")
    print(f"🔍 Similarity Score: {similarity:.2f}")

# ---------- MAIN ----------
if __name__ == "__main__":
    while True:
        q = input("\n💬 Enter a DSA question (or type 'exit' to quit): ")
        if q.lower() == "exit":
            break
        predict_question(q)
