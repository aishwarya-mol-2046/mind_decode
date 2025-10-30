import { readFileSync } from 'fs';
import { join } from 'path';

export interface PredictedQuestion {
  id: number;
  subject: string;
  question: string;
  marks: number;
  type: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  cognitiveLevel: string;
  predictedTopic: string;
}

let questionsCache: PredictedQuestion[] | null = null;

export function loadPredictedQuestions(): PredictedQuestion[] {
  if (questionsCache) {
    return questionsCache;
  }

  try {
    const csvPath = join(process.cwd(), 'attached_assets', 'mlDemo', 'data', 'processed', 'predicted_questions.csv');
    const csvContent = readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    // Skip header
    const dataLines = lines.slice(1);
    
    questionsCache = dataLines.map((line, index) => {
      const parts = parseCSVLine(line);
      
      return {
        id: index + 1,
        subject: parts[0] || 'DSA',
        question: parts[1] || '',
        marks: parseInt(parts[2]) || 2,
        type: parts[3] || 'Theory',
        difficulty: (parts[4] as 'Easy' | 'Medium' | 'Hard') || 'Medium',
        topic: parts[5] || 'Misc',
        cognitiveLevel: parts[6] || 'Understand',
        predictedTopic: parts[9] || parts[5] || 'Misc'
      };
    }).filter(q => q.question.trim().length > 0);
    
    return questionsCache;
  } catch (error) {
    console.error('Error loading predicted questions:', error);
    return [];
  }
}

// Parse CSV line handling quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

export function getTopics(): string[] {
  const questions = loadPredictedQuestions();
  const topics = new Set(questions.map(q => q.predictedTopic));
  return Array.from(topics).sort();
}

export function getQuestionTypes(): string[] {
  const questions = loadPredictedQuestions();
  const types = new Set(questions.map(q => q.type));
  return Array.from(types).sort();
}

export function filterQuestions(filters: {
  topic?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  marks?: number;
  type?: string;
  limit?: number;
}): PredictedQuestion[] {
  let questions = loadPredictedQuestions();
  
  if (filters.topic && filters.topic !== 'All') {
    questions = questions.filter(q => q.predictedTopic === filters.topic);
  }
  
  if (filters.difficulty) {
    questions = questions.filter(q => q.difficulty === filters.difficulty);
  }
  
  if (filters.marks) {
    questions = questions.filter(q => q.marks === filters.marks);
  }
  
  if (filters.type) {
    questions = questions.filter(q => q.type === filters.type);
  }
  
  if (filters.limit) {
    questions = questions.slice(0, filters.limit);
  }
  
  return questions;
}

export function generateMockTestFromPredictions(filters: {
  topic?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  questionCount?: number;
}): PredictedQuestion[] {
  const questionCount = filters.questionCount || 10;
  let questions = filterQuestions({
    topic: filters.topic,
    difficulty: filters.difficulty
  });
  
  // Shuffle questions
  questions = questions.sort(() => Math.random() - 0.5);
  
  // Return requested number
  return questions.slice(0, questionCount);
}

export function getStatistics() {
  const questions = loadPredictedQuestions();
  
  const topicDistribution: Record<string, number> = {};
  const difficultyDistribution: Record<string, number> = {};
  const marksDistribution: Record<number, number> = {};
  
  questions.forEach(q => {
    topicDistribution[q.predictedTopic] = (topicDistribution[q.predictedTopic] || 0) + 1;
    difficultyDistribution[q.difficulty] = (difficultyDistribution[q.difficulty] || 0) + 1;
    marksDistribution[q.marks] = (marksDistribution[q.marks] || 0) + 1;
  });
  
  return {
    total: questions.length,
    topics: topicDistribution,
    difficulties: difficultyDistribution,
    marks: marksDistribution
  };
}
