import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, StopCircle, Brain, Coffee, Sparkles } from "lucide-react";

type SessionType = "work" | "shortBreak" | "longBreak";
type Mood = "Happy" | "Tired" | "Stressed" | "";

interface SessionData {
  duration: number;
  mood: Mood;
  focus: number;
  timestamp: string;
  subject: string;
}

interface TimerSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
};

const SUBJECTS = ["Math", "Physics", "CS", "Revision", "Biology", "Chemistry", "History"];

export default function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>("work");
  const [sessionCount, setSessionCount] = useState(0);
  const [showMoodInput, setShowMoodInput] = useState(false);
  const [mood, setMood] = useState<Mood>("");
  const [focus, setFocus] = useState(70);
  const [currentSubject, setCurrentSubject] = useState(SUBJECTS[0]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [recommendation, setRecommendation] = useState("");
  const [consecutiveStressCount, setConsecutiveStressCount] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const totalTime = sessionType === "work" 
    ? settings.workDuration 
    : sessionType === "shortBreak" 
    ? settings.shortBreakDuration 
    : settings.longBreakDuration;
  
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem("studySessions");
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("studySessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleSessionComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    if (sessionType === "work") {
      setShowMoodInput(true);
    } else {
      // After break, start next work session
      startNextSession();
    }
  };

  const handleMoodSubmit = () => {
    if (!mood) return;

    // Save session data
    const sessionData: SessionData = {
      duration: totalTime,
      mood,
      focus,
      timestamp: new Date().toISOString(),
      subject: currentSubject,
    };

    const newSessions = [sessionData, ...sessions].slice(0, 10);
    setSessions(newSessions);

    // Calculate new stress count
    const newStressCount = (mood === "Stressed" || focus < 40) 
      ? consecutiveStressCount + 1 
      : 0;
    setConsecutiveStressCount(newStressCount);

    // Apply adaptive logic and get new settings
    const { newSettings, message } = applyAdaptiveLogic(mood, focus, newStressCount);

    setShowMoodInput(false);
    setMood("");
    
    // Increment session count and determine next session type
    const newSessionCount = sessionCount + 1;
    setSessionCount(newSessionCount);
    
    // Use the newly computed settings for break duration
    if (newSessionCount % 4 === 0) {
      setSessionType("longBreak");
      setTimeLeft(newSettings.longBreakDuration);
    } else {
      setSessionType("shortBreak");
      setTimeLeft(newSettings.shortBreakDuration);
    }
  };

  const applyAdaptiveLogic = (mood: Mood, focus: number, stressCount: number) => {
    let newSettings = { ...DEFAULT_SETTINGS };
    let message = "";

    if (mood === "Stressed") {
      newSettings.workDuration = 15 * 60;
      newSettings.shortBreakDuration = 10 * 60;
      message = "You seem stressed 😟 — take a longer break or listen to some calming music.";
    } else if (mood === "Tired") {
      newSettings.workDuration = 20 * 60;
      newSettings.shortBreakDuration = 8 * 60;
      message = "You're feeling tired 😴 — maybe switch to a lighter subject or take a quick walk.";
    } else if (mood === "Happy" || focus > 70) {
      newSettings = { ...DEFAULT_SETTINGS };
      message = "You're doing great! Keep going 🎉";
    }

    if (focus < 40) {
      message += " Your focus is low — consider changing subject or doing revision instead.";
    }

    // Check if subject switch is needed (after 2 consecutive stress sessions)
    if (stressCount >= 2) {
      const randomSubject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
      if (randomSubject !== currentSubject) {
        message += ` Consider switching to ${randomSubject} for a fresh perspective.`;
      }
    }

    setSettings(newSettings);
    setRecommendation(message);

    return { newSettings, message };
  };

  const startNextSession = () => {
    setSessionType("work");
    setTimeLeft(settings.workDuration);
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(sessionType === "work" ? settings.workDuration : settings.shortBreakDuration);
    setShowMoodInput(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (sessionType === "work") {
      // End the work session early and show mood input
      setShowMoodInput(true);
    } else {
      // If during break, just reset the break timer
      setTimeLeft(sessionType === "shortBreak" ? settings.shortBreakDuration : settings.longBreakDuration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getSessionLabel = () => {
    if (sessionType === "work") return "Focus Session";
    if (sessionType === "shortBreak") return "Short Break";
    return "Long Break";
  };

  const getSessionIcon = () => {
    if (sessionType === "work") return <Brain className="w-5 h-5" />;
    if (sessionType === "shortBreak") return <Coffee className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  return (
    <div className="pt-24 pb-12 min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 dark:from-gray-800 dark:via-gray-900 dark:to-teal-900">
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-green-400/30 dark:bg-green-600/20 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/30 dark:bg-emerald-600/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-400/20 dark:bg-teal-600/15 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-6 relative z-10"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Adaptive Pomodoro Timer
          </h1>
          <p className="text-muted-foreground">
            Smart focus sessions that adapt to your mood and energy levels
          </p>
        </div>

        <Card className="p-8 md:p-12 backdrop-blur-md bg-background/70 shadow-lg border-emerald-200/50 dark:border-emerald-800/50">
          <div className="flex flex-col items-center">
            {/* Session Type Badge */}
            <div className="flex items-center gap-3 mb-6">
              <Badge 
                variant="secondary" 
                className="text-sm px-4 py-2"
                data-testid="badge-session-type"
              >
                <span className="mr-2">{getSessionIcon()}</span>
                {getSessionLabel()}
              </Badge>
              <Badge variant="outline" data-testid="badge-session-count">
                Session {sessionCount + 1}
              </Badge>
            </div>

            {/* Timer Display */}
            <div className="relative w-64 h-64 mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/20"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="url(#greenGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                  className="transition-all duration-1000"
                  animate={isRunning ? {
                    filter: [
                      "drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))",
                      "drop-shadow(0 0 16px rgba(16, 185, 129, 0.8))",
                      "drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))",
                    ],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <defs>
                  <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span 
                  className="text-5xl font-mono font-bold" 
                  data-testid="text-timer"
                  animate={isRunning ? {
                    scale: [1, 1.05, 1],
                  } : {}}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {formatTime(timeLeft)}
                </motion.span>
              </div>
              
              {isRunning && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(16, 185, 129, 0.3)",
                      "0 0 40px rgba(16, 185, 129, 0.5)",
                      "0 0 20px rgba(16, 185, 129, 0.3)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  onClick={handleStartPause}
                  data-testid="button-start-pause"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md"
                  disabled={showMoodInput}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
              </motion.div>
              
              {/* Stop button - only show if there's time left on the timer */}
              {timeLeft < totalTime && !showMoodInput && (
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={handleStop}
                    data-testid="button-stop"
                  >
                    <StopCircle className="w-4 h-4 mr-2" />
                    Stop Session
                  </Button>
                </motion.div>
              )}
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleReset}
                  data-testid="button-reset"
                  disabled={showMoodInput}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </motion.div>
            </div>

            {/* Subject Selection */}
            <div className="w-full max-w-xs mb-6">
              <label className="block text-sm font-medium mb-2">
                Current Subject
              </label>
              <Select value={currentSubject} onValueChange={setCurrentSubject}>
                <SelectTrigger data-testid="select-subject">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mood Input Section */}
            <AnimatePresence>
              {showMoodInput && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full max-w-md space-y-6 p-6 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50"
                >
                  <h3 className="text-lg font-semibold text-center">
                    How was this session?
                  </h3>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Mood
                    </label>
                    <Select value={mood} onValueChange={(value) => setMood(value as Mood)}>
                      <SelectTrigger data-testid="select-mood">
                        <SelectValue placeholder="Select your mood" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Happy">😊 Happy</SelectItem>
                        <SelectItem value="Tired">😴 Tired</SelectItem>
                        <SelectItem value="Stressed">😟 Stressed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Focus Level: {focus}%
                    </label>
                    <Slider
                      value={[focus]}
                      onValueChange={(values) => setFocus(values[0])}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                      data-testid="slider-focus"
                    />
                  </div>

                  <Button
                    onClick={handleMoodSubmit}
                    disabled={!mood}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    data-testid="button-submit-mood"
                  >
                    Submit & Continue
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* Recommendation Card */}
        <AnimatePresence>
          {recommendation && !showMoodInput && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6"
            >
              <Card className="p-6 bg-gradient-to-r from-indigo-100 via-cyan-100 to-teal-50 dark:from-gray-800 dark:to-gray-900 shadow-lg border-indigo-200/50 dark:border-indigo-700/50">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1 text-indigo-900 dark:text-indigo-100">
                      Recommendation
                    </h3>
                    <p className="text-sm text-indigo-800 dark:text-indigo-200" data-testid="text-recommendation">
                      {recommendation}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8"
          >
            <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
            <div className="space-y-3">
              {sessions.slice(0, 3).map((session, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 backdrop-blur-sm bg-background/50">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{session.subject}</Badge>
                        <span className="text-sm font-medium">
                          {session.mood === "Happy" && "😊"}
                          {session.mood === "Tired" && "😴"}
                          {session.mood === "Stressed" && "😟"}
                          {" "}
                          {session.mood}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Focus: {session.focus}%</span>
                        <span>{Math.floor(session.duration / 60)} min</span>
                        <span className="hidden sm:inline">
                          {new Date(session.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
