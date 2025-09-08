import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Lightbulb, RotateCcw, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import Feedback from '../ui/Feedback';
import TallyMarks from '../visualizations/TallyMarks';
import SymmetryVisualizer from '../visualizations/SymmetryVisualizer';
import type { Question } from '../../types/lesson.types';

export interface QuestionBoxProps {
  question: Question;
  onAnswer: (answer: string | number | string[] | boolean, isCorrect: boolean) => void;
  onNext?: () => void;
  showHint?: boolean;
  disabled?: boolean;
  className?: string;
  isLastQuestion?: boolean;
}

const QuestionBox: React.FC<QuestionBoxProps> = ({
  question,
  onAnswer,
  onNext,
  showHint = false,
  disabled = false,
  className = '',
  isLastQuestion = false,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | string[] | boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [timerSkipped, setTimerSkipped] = useState(false);

  // Timer effect - check every second
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - questionStartTime) / 1000);
      setTimeElapsed(elapsed);
      
      // Allow proceeding after 30 seconds
      if (elapsed >= 30) {
        setCanProceed(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [questionStartTime]);

  // Reset timer when question changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
    setTimeElapsed(0);
    setCanProceed(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setAttempts(0);
    setShowExplanation(false);
  }, [question.id]);

  const handleAnswerSelect = (answer: string | number | string[] | boolean) => {
    if (disabled || showFeedback) return;
    
    setSelectedAnswer(answer);
    setAttempts(prev => prev + 1);
    
    const correct = checkAnswer(answer);
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setShowExplanation(true);
    }
    
    onAnswer(answer, correct);
    
    // If answered correctly, ensure they have time to read the explanation
    // by extending the timer if needed
    if (correct && timeElapsed < 30) {
      // Don't allow proceeding until 30 seconds total have passed
      setCanProceed(false);
    }
  };

  const checkAnswer = (answer: string | number | string[] | boolean): boolean => {
    if (Array.isArray(question.answer)) {
      return Array.isArray(answer) &&
             answer.length === question.answer.length &&
             answer.every(a => (question.answer as string[]).includes(a));
    }
    return answer === question.answer;
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
    // Reset question state after calling onNext
    resetQuestion();
  };

  const handleSkipTimer = () => {
    // Mark timer as skipped and allow proceeding
    setTimerSkipped(true);
    setCanProceed(true);
    // Then proceed to next question
    if (onNext) {
      onNext();
    }
    // Reset question state after calling onNext
    resetQuestion();
  };

  const resetQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setShowExplanation(false);
    setQuestionStartTime(Date.now());
    setTimeElapsed(0);
    setCanProceed(false);
    setTimerSkipped(false);
  };

  const renderMultipleChoice = () => (
    <div className="space-y-3">
      {question.type === 'multiple-choice' && question.options?.map((option: string, index: number) => (
        <motion.button
          key={index}
          onClick={() => handleAnswerSelect(option)}
          disabled={disabled || showFeedback}
          className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
            showFeedback
              ? option === question.answer
                ? 'border-success-500 bg-success-50 text-success-800'
                : selectedAnswer === option
                ? 'border-error-500 bg-error-50 text-error-800'
                : 'border-gray-200 bg-gray-50 text-gray-600'
              : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          whileHover={disabled || showFeedback ? {} : { scale: 1.02 }}
          whileTap={disabled || showFeedback ? {} : { scale: 0.98 }}
        >
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
              showFeedback
                ? option === question.answer
                  ? 'border-success-500 bg-success-500'
                  : selectedAnswer === option
                  ? 'border-error-500 bg-error-500'
                  : 'border-gray-300'
                : 'border-gray-300'
            }`}>
              {showFeedback && option === question.correctAnswer && (
                <CheckCircle className="w-4 h-4 text-white" />
              )}
              {showFeedback && selectedAnswer === option && option !== question.correctAnswer && (
                <XCircle className="w-4 h-4 text-white" />
              )}
            </div>
            {question.id === 'tally-1' && option.includes('tally marks') ? (
              <div className="flex items-center space-x-3">
                <TallyMarks 
                  count={parseInt(option.split(' ')[0])} 
                  animated={false}
                  size="md"
                  color="#3b82f6"
                />
                <span className="font-medium text-sm text-gray-600">({option})</span>
              </div>
            ) : (
              <span className="font-medium">{option}</span>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );

  const renderTrueFalse = () => (
    <div className="grid grid-cols-2 gap-4">
      {['True', 'False'].map((option) => (
        <motion.button
          key={option}
          onClick={() => handleAnswerSelect(option === 'True')}
          disabled={disabled || showFeedback}
          className={`p-6 text-center rounded-lg border-2 font-medium transition-all duration-200 ${
            showFeedback
              ? option === (question.correctAnswer ? 'True' : 'False')
                ? 'border-success-500 bg-success-50 text-success-800'
                : selectedAnswer === (option === 'True')
                ? 'border-error-500 bg-error-50 text-error-800'
                : 'border-gray-200 bg-gray-50 text-gray-600'
              : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          whileHover={disabled || showFeedback ? {} : { scale: 1.02 }}
          whileTap={disabled || showFeedback ? {} : { scale: 0.98 }}
        >
          {option}
        </motion.button>
      ))}
    </div>
  );

  const renderInput = () => (
    <div className="space-y-4">
      <input
        type="text"
        value={selectedAnswer as string || ''}
        onChange={(e) => setSelectedAnswer(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && selectedAnswer) {
            handleAnswerSelect(selectedAnswer as string);
          }
        }}
        disabled={disabled || showFeedback}
        placeholder="Type your answer here..."
        className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <Button
        onClick={() => selectedAnswer && handleAnswerSelect(selectedAnswer as string)}
        disabled={!selectedAnswer || disabled || showFeedback}
        className="w-full"
      >
        Submit Answer
      </Button>
    </div>
  );

  const renderVisualSelect = () => {
    const handleVisualizerComplete = (_isCorrect: boolean, linesFound: number) => {
      handleAnswerSelect(linesFound);
    };

    // Determine the shape based on the question
    let shape: 'square' | 'rectangle' | 'triangle' | 'circle' | 'butterfly' | 'heart' | 'star' | 'pentagon' | 'hexagon' | undefined;
    
    if (question.question?.toLowerCase().includes('square')) {
      shape = 'square';
    } else if (question.question?.toLowerCase().includes('rectangle')) {
      shape = 'rectangle';
    } else if (question.question?.toLowerCase().includes('triangle')) {
      shape = 'triangle';
    } else if (question.question?.toLowerCase().includes('pentagon')) {
      shape = 'pentagon';
    } else if (question.question?.toLowerCase().includes('hexagon')) {
      shape = 'hexagon';
    } else if (question.question?.toLowerCase().includes('circle')) {
      shape = 'circle';
    }

    return (
      <div className="space-y-4">
        <SymmetryVisualizer
          shape={shape === 'square' ? 'square' : 'letter-r'}
          onComplete={handleVisualizerComplete}
          showHint={showHint}
        />
      </div>
    );
  };

  const renderQuestionType = () => {
    switch (question.type) {
      case 'multiple-choice':
        return renderMultipleChoice();
      case 'true-false':
        return renderTrueFalse();
      case 'input':
        return renderInput();
      case 'visual-select':
        return renderVisualSelect();
      default:
        return renderMultipleChoice();
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Question {question.points} points
          </h3>
          <div className="flex items-center space-x-2">
            {/* Timer Display */}
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              timerSkipped 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              <Clock className="w-3 h-3" />
              <span>{timerSkipped ? 'Skipped' : `${timeElapsed}s`}</span>
            </div>
            
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              question.difficulty === 'easy' ? 'bg-success-100 text-success-800' :
              question.difficulty === 'medium' ? 'bg-warning-100 text-warning-800' :
              'bg-error-100 text-error-800'
            }`}>
              {question.difficulty}
            </span>
            {showHint && question.hint && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExplanation(!showExplanation)}
                className="p-2"
              >
                <Lightbulb className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        <p className="text-gray-700 text-lg leading-relaxed">
          {question.question}
        </p>
        
        {/* Gentle reminder for students to take their time */}
        {!showFeedback && timeElapsed < 10 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-center space-x-2 text-blue-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Take your time to read and understand the question! 🤔
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Visualization */}
      {question.visualization && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <question.visualization />
        </div>
      )}

      {/* Question Content */}
      <div className="mb-6">
        {renderQuestionType()}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Feedback
              type={isCorrect ? 'success' : 'error'}
              message={isCorrect ? 'Correct! Well done!' : 'Not quite right. Try again!'}
              className="mb-4"
            />
            
            {/* Special message for correct answers to encourage reading explanation */}
            {isCorrect && !canProceed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-2 text-green-700">
                  <span className="text-lg">📚</span>
                  <span className="text-sm font-medium">
                    Great job! Take time to read the explanation below - it will help you understand better!
                  </span>
                </div>
              </motion.div>
            )}
            
            {showExplanation && question.explanation && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
                <p className="text-blue-800">{question.explanation}</p>
              </div>
            )}
            
            {!isCorrect && attempts < 3 && (
              <div className="flex justify-center">
                <Button
                  onClick={resetQuestion}
                  variant="secondary"
                  size="sm"
                  className="mr-2"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            )}
            
            {onNext && (
              <div className="flex justify-center mt-4">
                {canProceed ? (
                  <Button onClick={handleNext}>
                    {isCorrect 
                      ? (isLastQuestion ? 'Complete Lesson' : 'Next Question')
                      : 'Continue'
                    }
                  </Button>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {showFeedback && isCorrect 
                          ? `Please read the explanation carefully... (${30 - timeElapsed}s remaining)`
                          : `Please take your time to read and think... (${30 - timeElapsed}s remaining)`
                        }
                      </span>
                    </div>
                    
                    {/* Explicit Next button for speedy learners */}
                    <Button 
                      onClick={handleSkipTimer}
                      variant="secondary"
                      size="sm"
                      className="text-gray-600 border border-gray-300 hover:border-gray-400"
                    >
                      Skip Timer & Continue
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      {showExplanation && question.hint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Feedback
            type="hint"
            message={question.hint}
            title="Hint"
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuestionBox;
