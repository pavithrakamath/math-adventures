import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import QuestionBox from './QuestionBox';
import type { Question } from '../../types/lesson.types';

interface QuizProps {
  questions: Question[];
  onComplete: (score: number, totalQuestions: number, correctAnswers: number) => void;
  onBack?: () => void;
}

interface QuizState {
  currentQuestionIndex: number;
  answers: Array<{
    questionId: string;
    answer: string | number | boolean | string[];
    isCorrect: boolean;
    attempts: number;
  }>;
  score: number;
  isCompleted: boolean;
}

const Quiz = ({ questions, onComplete, onBack }: QuizProps) => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    isCompleted: false,
  });

  const currentQuestion = questions[quizState.currentQuestionIndex];
  const isLastQuestion = quizState.currentQuestionIndex === questions.length - 1;

  const handleAnswer = (answer: string | number | boolean | string[], isCorrect: boolean) => {
    const newAnswer = {
      questionId: currentQuestion.id,
      answer,
      isCorrect,
      attempts: 1, // This could be tracked more precisely
    };

    setQuizState(prev => ({
      ...prev,
      answers: [...prev.answers.filter(a => a.questionId !== currentQuestion.id), newAnswer],
      score: prev.score + (isCorrect ? ((currentQuestion as { points?: number }).points || 1) : 0),
    }));
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setQuizState(prev => ({ ...prev, isCompleted: true }));
      const correctAnswers = quizState.answers.filter(a => a.isCorrect).length;
      onComplete(quizState.score, questions.length, correctAnswers);
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  };

  const handleRestart = () => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      isCompleted: false,
    });
  };

  const getScorePercentage = () => {
    const totalPoints = questions.reduce((sum, q) => sum + ((q as { points?: number }).points || 1), 0);
    return totalPoints > 0 ? Math.round((quizState.score / totalPoints) * 100) : 0;
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Excellent! You've mastered this topic! 🌟";
    if (percentage >= 80) return "Great job! You understand this well! 👏";
    if (percentage >= 70) return "Good work! You're getting the hang of it! 👍";
    if (percentage >= 60) return "Not bad! Keep practicing to improve! 💪";
    return "Don't give up! Review the lesson and try again! 📚";
  };

  if (quizState.isCompleted) {
    const percentage = getScorePercentage();
    const correctAnswers = quizState.answers.filter(a => a.isCorrect).length;
    
    return (
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-6xl mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          {percentage >= 80 ? '🏆' : percentage >= 60 ? '🎉' : '📚'}
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Quiz Complete!
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
            <div className="text-sm text-blue-800">Score</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{correctAnswers}/{questions.length}</div>
            <div className="text-sm text-green-800">Correct</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{quizState.score}</div>
            <div className="text-sm text-purple-800">Points</div>
          </div>
        </div>
        
        <p className="text-lg text-gray-700 mb-8">
          {getScoreMessage(percentage)}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRestart}
            variant="secondary"
            size="lg"
            className="flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          {onBack && (
            <Button
              onClick={onBack}
              variant="primary"
              size="lg"
              className="flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Continue Lesson
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Progress */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Question {quizState.currentQuestionIndex + 1} of {questions.length}
          </h3>
          <div className="text-sm text-gray-600">
            Score: {quizState.score} points
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-primary-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((quizState.currentQuestionIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Current Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <QuestionBox
            question={currentQuestion}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            isLastQuestion={isLastQuestion}
            showHint={true}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Quiz;

