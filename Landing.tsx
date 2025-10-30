import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Brain, Heart, Target, LogIn } from "lucide-react";
import backgroundImage from "@assets/image_1761732861903.png";
import { useEnvironment } from "@/hooks/useEnvironment";
import { useLocation } from "wouter";

export default function Landing() {
  const { isReplit } = useEnvironment();
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    if (isReplit) {
      // On Replit, use Replit Auth
      window.location.href = "/api/login";
    } else {
      // On localhost, go to login page
      setLocation("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/15 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-600/15 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/15 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-5xl mx-auto px-6 py-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 text-white"
            animate={{
              textShadow: [
                "0 0 20px rgba(255,255,255,0.5)",
                "0 0 40px rgba(255,255,255,0.7)",
                "0 0 20px rgba(255,255,255,0.5)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            MindDecode
          </motion.h1>
          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto font-medium">
            AI that predicts what to study and protects how you feel while
            studying.
          </p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12">
            Harness the power of AI to optimize your exam preparation while
            maintaining your mental wellness throughout your study journey.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              data-testid="button-login"
              size="lg"
              onClick={handleLogin}
              className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-xl shadow-lg transition-all font-semibold"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Log In to Get Started
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            {
              icon: Brain,
              title: "AI Predictions",
              description: "Advanced algorithms analyze your materials to predict likely exam questions",
            },
            {
              icon: Heart,
              title: "Mental Wellness",
              description: "Track your mood and emotions during study sessions for better mental health",
            },
            {
              icon: Target,
              title: "Smart Focus",
              description: "Pomodoro timer with mood tracking helps you study efficiently and mindfully",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              className="backdrop-blur-md bg-white/10 dark:bg-white/5 p-6 rounded-2xl border border-white/20 hover:bg-white/15 dark:hover:bg-white/10 transition-all"
            >
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-bold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-white/80 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
