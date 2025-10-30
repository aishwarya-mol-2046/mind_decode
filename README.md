# 🚀 PrepNOVA – MindDecode

**Live Demo:** 🎯 [https://prep-nova-minddecode.replit.app/](https://prep-nova-minddecode.replit.app/)

> *Bridging Academic Intelligence and Emotional Resilience through AI.*

---

## 🧩 Project Overview

**PrepNOVA – MindDecode** is an **AI-powered academic wellness and mock test platform** that empowers students to achieve balance between **academic performance** and **mental well-being**.

Developed for a hackathon, it fuses **AI**, **Machine Learning (ML)**, and **EdTech innovation** to deliver:
- Personalized study recommendations  
- Cognitive wellness insights  
- Adaptive mock testing  
- Emotion-aware learning analytics  

---

## 🌟 Key Features

### 🤖 AI Chat Guidance  
GPT-integrated chatbot for **academic** and **emotional support**, providing tailored study help and motivational nudges.

### 📈 ML-Based Performance Predictor  
A **custom ML model** built with *scikit-learn* to analyze:
- Past test scores  
- Difficulty levels of subjects  
- Cognitive load and stress trends  
It then predicts **focus areas** for improvement.

### 🧠 Dynamic Mock Test Platform  
Generate **AI-curated mock tests** with **instant feedback**, adaptive question difficulty, and progress tracking.

### 📊 Performance Dashboard  
Interactive visual dashboard that displays:
- Topic-wise accuracy and performance  
- Progress over time  
- Personalized improvement suggestions  

### 🔐 Secure Authentication  
Powered by **Clerk**, ensuring:
- Encrypted sign-in / sign-up  
- JWT-based user sessions  
- Data privacy and protection  

### ☁️ Cloud & Replit Deployment  
Deployed entirely on **Replit**, ensuring seamless accessibility and zero-setup execution.

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + TypeScript (Vite) |
| **Backend** | Node.js + Express + TypeScript |
| **AI/ML** | OpenAI GPT API + Custom ML Predictor (Python) |
| **Database** | PostgreSQL / SQLite |
| **Authentication** | Clerk |
| **Deployment** | Replit Cloud |

---

## 🏗️ Project Structure

- PrepNOVA/
  
├── server/

│ ├── index.ts

│ ├── routes/

│ ├── ml/

│ └── middleware/

├── frontend/

│ ├── src/

│ │ ├── pages/

│ │ ├── components/

│ │ └── App.tsx

├── data/

│ └── db.sqlite

├── .env

└── README.md
---

## 🔒 Security Implementation

- 🔑 **Clerk Authentication** for secure user access  
- 🌐 **HTTPS & Secure CORS policies**  
- 🧩 **Encrypted environment variables** for API keys  
- 🧼 **Database sanitization** to prevent injection attacks  

---

## ⚙️ Workflow

- 1. 🧍 User logs in securely via **Replit Authentication**  
- 2. 🧭 Chooses between **Mock Test** or **MindDecode (Predictor)** mode  
- 3. 🧮 Backend processes test or prediction requests  
- 4. 🧠 ML module generates insights and improvement focus areas  
- 5. 📊 Dashboard visualizes performance metrics and recommendations  

---

## 🧪 Machine Learning Model

The **MindDecode Predictor** model evaluates:
- 🧾 Past academic scores and metrics  
- 🧠 Difficulty correlation between topics  
- 💭 Cognitive load and stress patterns  

**Built With:**  
- Python  
- scikit-learn  
- pandas / numpy  
- Flask (REST API integration)

---

## ⚡ Installation & Setup

- # Using bash implement the following commands to run the web.
- 1️⃣ Clone the Repository
- git clone https://github.com/aishwarya-mol-2046/mind_decode.git
- cd mind_decode

- 2️⃣ Install Dependencies
- npm install

- 3️⃣ Configure Environment Variables
- Create a .env file and add:
- MODEL=auto
- OPENAI_API_KEY=your_openai_key_here
- GEMINI_API_KEY=optional_google_api_key
- DATABASE_URL=postgresql://postgres:password@localhost:5432/prepnova


- # 4️⃣ Run the App
- npm run dev
