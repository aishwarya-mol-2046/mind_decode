import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, Upload, Printer, FileText, CheckCircle2, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PredictedQuestion {
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

export default function Predictor() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<PredictedQuestion[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Upload and process PDF mutation
  const processPdfMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('pdf', file);
      
      const response = await apiRequest('POST', '/api/predictor/upload', formData);
      
      // Check if response is OK before parsing
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to process PDF');
      }
      
      return await response.json();
    },
    onSuccess: (data: any) => {
      // Validate that questions array exists
      if (!data.questions || !Array.isArray(data.questions)) {
        toast({
          title: "Processing Failed",
          description: "Invalid response from server. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      setPredictions(data.questions);
      toast({
        title: "PDF Processed Successfully!",
        description: `Generated ${data.questions.length} predicted exam questions.`,
      });
    },
    onError: (error: any) => {
      console.error("PDF processing error:", error);
      toast({
        title: "Processing Failed",
        description: error?.message || "Failed to process PDF. Please check your connection and try again.",
        variant: "destructive",
      });
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setPredictions(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleProcessPdf = () => {
    if (uploadedFile) {
      processPdfMutation.mutate(uploadedFile);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case "Hard":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default:
        return "";
    }
  };

  const getMarksColor = (marks: number) => {
    if (marks === 2) return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    if (marks === 5) return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
    return "bg-pink-500/10 text-pink-600 dark:text-pink-400";
  };

  return (
    <>
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            background: white !important;
          }
          .print-container {
            background: white !important;
            padding: 20px !important;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

      <div className="pt-24 pb-12 min-h-screen bg-gradient-to-br from-violet-50 via-purple-100 to-fuchsia-100 dark:from-gray-900 dark:via-purple-900 dark:to-fuchsia-900 print-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-6"
        >
          {/* Header */}
          <div className="mb-12 text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              AI Exam Predictor
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your study materials and let our ML model predict likely exam questions
            </p>
          </div>

          {/* Upload Section - Hidden when printing */}
          {!predictions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="no-print"
            >
              <Card className="max-w-2xl mx-auto border-violet-200/50 dark:border-violet-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Upload className="w-6 h-6 text-violet-600" />
                    Upload Study Material
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    data-testid="input-pdf-upload"
                  />

                  {!uploadedFile ? (
                    <div
                      onClick={handleUploadClick}
                      className="border-2 border-dashed border-violet-300 dark:border-violet-700 rounded-lg p-12 text-center hover-elevate cursor-pointer transition-all"
                      data-testid="button-upload-area"
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-violet-500" />
                      <p className="text-lg font-medium mb-2">Click to upload PDF</p>
                      <p className="text-sm text-muted-foreground">
                        Upload your lecture notes, textbook chapters, or study materials
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-violet-50 dark:bg-violet-950/30 rounded-lg">
                        <FileText className="w-8 h-8 text-violet-600" />
                        <div className="flex-1">
                          <p className="font-medium" data-testid="text-uploaded-filename">{uploadedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={handleUploadClick}
                          variant="outline"
                          className="flex-1"
                          data-testid="button-change-file"
                        >
                          Change File
                        </Button>
                        <Button
                          onClick={handleProcessPdf}
                          disabled={processPdfMutation.isPending}
                          className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                          data-testid="button-process-pdf"
                        >
                          {processPdfMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Process with AI
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Predictions Section - Printable */}
          {predictions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Print Header - Only visible when printing */}
              <div className="print-only text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">AI-Predicted Exam Questions</h1>
                <p className="text-gray-600">PrepNOVA / MindDecode</p>
                <p className="text-sm text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
              </div>

              {/* Action Bar - Hidden when printing */}
              <div className="no-print flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Predicted Questions</h2>
                  <p className="text-muted-foreground">{predictions.length} questions generated</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setUploadedFile(null);
                      setPredictions(null);
                    }}
                    variant="outline"
                    data-testid="button-upload-new"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New PDF
                  </Button>
                  <Button
                    onClick={handlePrint}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                    data-testid="button-print"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Predictions
                  </Button>
                </div>
              </div>

              {/* Questions Grid */}
              <div className="grid gap-6">
                {predictions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className="border-violet-200/50 dark:border-violet-800/50 hover-elevate no-print-effects"
                      data-testid={`card-prediction-${question.id}`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline" className="text-xs">
                                Q{index + 1}
                              </Badge>
                              <Badge className={getDifficultyColor(question.difficulty)}>
                                {question.difficulty}
                              </Badge>
                              <Badge className={getMarksColor(question.marks)}>
                                {question.marks} marks
                              </Badge>
                              <Badge variant="outline" className="bg-violet-50 dark:bg-violet-950/30">
                                {question.topic}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg leading-relaxed">
                              {question.question}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <p className="font-medium">{question.type}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Cognitive Level:</span>
                            <p className="font-medium">{question.cognitiveLevel}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Subject:</span>
                            <p className="font-medium">{question.subject}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Predicted Topic:</span>
                            <p className="font-medium">{question.predictedTopic}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Print Footer - Only visible when printing */}
              <div className="print-only text-center mt-12 pt-8 border-t">
                <p className="text-sm text-gray-600">
                  Generated by PrepNOVA AI Exam Predictor | ML-Powered Question Prediction
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}
