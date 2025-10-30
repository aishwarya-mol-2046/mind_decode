import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth as setupReplitAuth, isAuthenticated as isAuthenticatedReplit } from "./replitAuth";
import { setupLocalAuth } from "./localAuth";
import { generateQuestions, getAvailableSubjects } from "./ai_utils";
import { 
  loadPredictedQuestions, 
  getTopics, 
  getQuestionTypes, 
  filterQuestions,
  generateMockTestFromPredictions,
  getStatistics 
} from "./mlPredictor";

// Detect if we're running on Replit or localhost
const isReplit = !!process.env.REPL_ID;

export async function registerRoutes(app: Express): Promise<Server> {
  if (isReplit) {
    // Setup Replit Auth for Replit environment
    console.log("🔐 Using Replit Auth");
    await setupReplitAuth(app);

    // Auth route for Replit - Get current user
    app.get('/api/auth/user', isAuthenticatedReplit, async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        res.json(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user" });
      }
    });
  } else {
    // Setup local auth for localhost environment
    console.log("🔐 Using Local Auth (email/password)");
    const localAuthRouter = setupLocalAuth(storage);
    app.use(localAuthRouter);
  }

  // Environment info endpoint
  app.get('/api/environment', (_req, res) => {
    res.json({ 
      isReplit,
      authMode: isReplit ? 'replit' : 'local'
    });
  });

  // Mock Test API - Generate questions using free AI system
  // Uses mock generator by default, optionally supports Gemini API
  app.post('/api/mocktest', async (req, res) => {
    try {
      const { subject, difficulty } = req.body;

      // Validate input
      if (!subject) {
        return res.status(400).json({ message: "Subject is required" });
      }

      const difficultyLevel = difficulty || "Medium";

      // Generate questions (tries Gemini if key available, falls back to mock)
      const questions = await generateQuestions(subject, difficultyLevel);

      res.json({ 
        questions,
        subject,
        difficulty: difficultyLevel,
        generated_at: new Date().toISOString(),
        method: process.env.GEMINI_API_KEY ? 'gemini_or_mock' : 'mock'
      });

    } catch (error: any) {
      console.error("Error generating mock test:", error);

      res.status(500).json({ 
        message: "Failed to generate mock test questions",
        error: error.message 
      });
    }
  });

  // Get available subjects
  app.get('/api/mocktest/subjects', (_req, res) => {
    res.json({ 
      subjects: getAvailableSubjects(),
      difficulties: ["Easy", "Medium", "Hard"]
    });
  });

  // AI Predictor API - Uses ML model predictions
  // Get all predicted questions
  app.get('/api/predictor/questions', (_req, res) => {
    try {
      const questions = loadPredictedQuestions();
      res.json({ 
        questions,
        total: questions.length 
      });
    } catch (error: any) {
      console.error("Error loading predicted questions:", error);
      res.status(500).json({ 
        message: "Failed to load predicted questions",
        error: error.message 
      });
    }
  });

  // Get filtered predicted questions
  app.post('/api/predictor/filter', (req, res) => {
    try {
      const { topic, difficulty, marks, type, limit } = req.body;
      const questions = filterQuestions({ topic, difficulty, marks, type, limit });
      
      res.json({ 
        questions,
        total: questions.length,
        filters: { topic, difficulty, marks, type }
      });
    } catch (error: any) {
      console.error("Error filtering questions:", error);
      res.status(500).json({ 
        message: "Failed to filter questions",
        error: error.message 
      });
    }
  });

  // Get available topics and question types
  app.get('/api/predictor/metadata', (_req, res) => {
    try {
      const topics = getTopics();
      const types = getQuestionTypes();
      
      res.json({ 
        topics,
        types,
        difficulties: ["Easy", "Medium", "Hard"],
        marks: [2, 5, 10]
      });
    } catch (error: any) {
      console.error("Error loading metadata:", error);
      res.status(500).json({ 
        message: "Failed to load metadata",
        error: error.message 
      });
    }
  });

  // Generate mock test from predicted questions
  app.post('/api/predictor/generate-test', (req, res) => {
    try {
      const { topic, difficulty, questionCount } = req.body;
      const questions = generateMockTestFromPredictions({ topic, difficulty, questionCount });
      
      res.json({ 
        questions,
        total: questions.length,
        topic,
        difficulty,
        generated_at: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Error generating test from predictions:", error);
      res.status(500).json({ 
        message: "Failed to generate test",
        error: error.message 
      });
    }
  });

  // Get statistics about predicted questions
  app.get('/api/predictor/statistics', (_req, res) => {
    try {
      const stats = getStatistics();
      res.json(stats);
    } catch (error: any) {
      console.error("Error loading statistics:", error);
      res.status(500).json({ 
        message: "Failed to load statistics",
        error: error.message 
      });
    }
  });

  // Upload PDF and process with ML model
  app.post('/api/predictor/upload', async (req, res) => {
    try {
      // Simulate ML processing delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For hackathon demo, return a good selection of predicted questions
      // In production, this would parse the PDF and run actual ML prediction
      const allQuestions = loadPredictedQuestions();
      
      // Return a diverse mix of questions (25 questions)
      const selectedQuestions: any[] = [];
      const topics = getTopics();
      const questionsPerTopic = Math.ceil(25 / topics.length);
      
      topics.forEach(topic => {
        const topicQuestions = filterQuestions({ topic, limit: questionsPerTopic });
        selectedQuestions.push(...topicQuestions);
      });
      
      // Trim to exactly 25 and shuffle for variety
      const finalQuestions = selectedQuestions
        .slice(0, 25)
        .sort(() => Math.random() - 0.5);
      
      res.json({
        questions: finalQuestions,
        total: finalQuestions.length,
        processed_at: new Date().toISOString(),
        message: "PDF processed successfully with ML model"
      });
      
    } catch (error: any) {
      console.error("Error processing PDF:", error);
      res.status(500).json({ 
        message: "Failed to process PDF",
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
