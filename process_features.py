# process_features.py
# STEP 3: Process extracted dataset into feature-enriched final CSV

import pandas as pd
import numpy as np
from pathlib import Path
import re

# ---------- PATHS ----------
ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data" / "processed"
INPUT_CSV = DATA_DIR / "questions_dataset.csv"
OUTPUT_CSV = DATA_DIR / "final_dataset.csv"

# ---------- FUNCTIONS ----------
def detect_topic(question):
    q = question.lower()
    keywords = {
        "array": "Array",
        "stack": "Stack/Queue",
        "queue": "Stack/Queue",
        "tree": "Tree",
        "graph": "Graph",
        "linked list": "Linked List",
        "sort": "Sorting",
        "search": "Searching",
        "hash": "Hashing",
        "recursion": "Recursion",
        "pointer": "Pointer",
        "heap": "Heap",
        "algorithm": "Algorithm",
    }
    for key, topic in keywords.items():
        if key in q:
            return topic
    return "Misc"

def cognitive_level(question):
    q = question.lower()
    if any(k in q for k in ["define", "what is", "list"]):
        return "Remember"
    if any(k in q for k in ["explain", "describe", "why"]):
        return "Understand"
    if any(k in q for k in ["solve", "apply", "use"]):
        return "Apply"
    if any(k in q for k in ["analyze", "differentiate"]):
        return "Analyze"
    if any(k in q for k in ["design", "develop", "build"]):
        return "Create"
    return "Understand"

# ---------- MAIN PIPELINE ----------
print("🚀 Processing feature pipeline started...")

df = pd.read_csv(INPUT_CSV)
print(f"📘 Loaded {len(df)} rows from {INPUT_CSV}")

# Detect topic and cognitive level
df["Topic"] = df["Question_Text"].apply(detect_topic)
df["Cognitive_Level"] = df["Question_Text"].apply(cognitive_level)
df["Text_Length"] = df["Question_Text"].apply(lambda x: len(x.split()))
df["Keyword_Count"] = df["Question_Text"].apply(lambda x: len(re.findall(r'\b[a-zA-Z]{4,}\b', str(x))))

# Save final dataset
df.to_csv(OUTPUT_CSV, index=False)
print(f"✅ Final dataset saved at: {OUTPUT_CSV}")
print(df.head())

# ---------- Optional Chart ----------
try:
    import matplotlib.pyplot as plt
    plt.figure(figsize=(10,5))
    df["Topic"].value_counts().plot(kind="bar", color="lightblue")
    plt.title("📊 Topic Distribution in Dataset")
    plt.xlabel("Topic")
    plt.ylabel("Number of Questions")
    plt.tight_layout()
    plt.savefig(DATA_DIR / "topic_distribution.png")
    print(f"📈 Topic distribution chart saved at: {DATA_DIR / 'topic_distribution.png'}")
except Exception as e:
    print("⚠️ Chart generation failed:", e)
