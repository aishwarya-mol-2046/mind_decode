import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Clock, FileText, TrendingUp, Award, Brain, CheckCircle2 } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function Dashboard() {
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  // Load predictor statistics
  const { data: predictorStats } = useQuery({
    queryKey: ['/api/predictor/statistics'],
  });

  const topicTrendsData = {
    labels: ["Data Structures", "OOP", "Databases", "Algorithms", "Networking"],
    datasets: [
      {
        label: "Study Hours",
        data: [12, 8, 10, 15, 6],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(6, 182, 212, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(251, 191, 36, 0.8)",
        ],
        borderColor: [
          "rgb(99, 102, 241)",
          "rgb(6, 182, 212)",
          "rgb(139, 92, 246)",
          "rgb(236, 72, 153)",
          "rgb(251, 191, 36)",
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const moodStatsData = {
    labels: ["Happy", "Focused", "Tired", "Stressed", "Motivated"],
    datasets: [
      {
        data: [25, 35, 15, 10, 15],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(99, 102, 241, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(6, 182, 212, 0.8)",
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(99, 102, 241)",
          "rgb(251, 191, 36)",
          "rgb(239, 68, 68)",
          "rgb(6, 182, 212)",
        ],
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  };

  const weeklyProgressData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Study Hours",
        data: [6, 8, 5, 9, 7, 10, 6],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "rgb(99, 102, 241)",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold" as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y} hours`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart" as const,
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(99, 102, 241, 0.9)",
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold" as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y} hours studied`;
          },
          afterLabel: function(context: any) {
            const day = context.label;
            const tips = {
              Mon: "Great start to the week!",
              Tue: "Keep up the momentum!",
              Wed: "Midweek focus 💪",
              Thu: "Almost there!",
              Fri: "Strong finish!",
              Sat: "Weekend warrior 🎯",
              Sun: "Rest and review day",
            };
            return tips[day as keyof typeof tips] || "";
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
          },
          callback: function(value: any) {
            return value + "h";
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
    animation: {
      duration: 1500,
      easing: "easeInOutQuart" as const,
    },
    onHover: (event: any, activeElements: any) => {
      if (activeElements.length > 0) {
        const index = activeElements[0].index;
        const day = weeklyProgressData.labels[index];
        setHoveredDay(day);
      } else {
        setHoveredDay(null);
      }
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold" as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${percentage}% (${context.parsed} sessions)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1500,
      easing: "easeInOutQuart" as const,
    },
  };

  const statsData = [
    { label: "Total Study Time", value: "51h", change: "+12% this week", icon: Clock, color: "from-indigo-500 to-cyan-500" },
    { label: "Questions Practiced", value: "247", change: "+34 today", icon: FileText, color: "from-purple-500 to-pink-500" },
    { label: "Average Score", value: "78%", change: "+5% improvement", icon: Award, color: "from-emerald-500 to-teal-500" },
    { label: "Study Streak", value: "7 days", change: "Keep it up!", icon: TrendingUp, color: "from-orange-500 to-amber-500" },
  ];

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6"
      >
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
            Your Study Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your progress and analyze your study patterns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="p-6 border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold" data-testid={`text-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {predictorStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Card className="p-6 border-violet-200/50 dark:border-violet-800/50 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Brain className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                AI Exam Predictor Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{(predictorStats as any).total}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Questions</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{(predictorStats as any).difficulties?.Easy || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">Easy</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{(predictorStats as any).difficulties?.Medium || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">Medium</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{(predictorStats as any).difficulties?.Hard || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">Hard</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{Object.keys((predictorStats as any).topics || {}).length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Topics</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">DSA</p>
                  <p className="text-xs text-muted-foreground mt-1">Subject</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground text-center">
                ML-powered predictions from your uploaded model covering {Object.keys((predictorStats as any).topics || {}).length} DSA topics
              </div>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Weekly Study Progress
                </h2>
                {hoveredDay && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-sm font-medium text-primary"
                  >
                    {hoveredDay}
                  </motion.span>
                )}
              </div>
              <div className="h-80">
                <Line data={weeklyProgressData} options={lineOptions} />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 border-blue-200/50 dark:border-blue-800/50">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Recent Achievements
              </h2>
              <div className="space-y-4">
                {[
                  { title: "7 Day Streak", desc: "Studied every day this week" },
                  { title: "Algorithm Master", desc: "15 hours on algorithms" },
                  { title: "Perfect Score", desc: "100% on recent mock test" },
                  { title: "Quiz Champion", desc: "Completed 50+ questions" },
                ].map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover-elevate"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 border-blue-200/50 dark:border-blue-800/50">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Topic Distribution
              </h2>
              <div className="h-80">
                <Bar data={topicTrendsData} options={barOptions} />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6 border-blue-200/50 dark:border-blue-800/50">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Mood Analytics
              </h2>
              <div className="h-80 flex items-center justify-center">
                <Pie data={moodStatsData} options={pieOptions} />
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
