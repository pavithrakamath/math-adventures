import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import QuestionBox from './QuestionBox';
import ProgressBar from '../layout/ProgressBar';
import { getQuestionsForLesson } from '../../data/questions';
import { useLessonState } from '../../hooks/useLessonState';
import type { Lesson } from '../../types/lesson.types';

interface LessonViewProps {
  lesson: Lesson;
  onComplete: (score: number, timeSpent: number) => void;
}

const LessonView: React.FC<LessonViewProps> = ({ lesson, onComplete }) => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  
  const { state, addAnswer, completeLesson, getAccuracy, getProgress } = useLessonState(lesson.id);
  const questions = getQuestionsForLesson(lesson.id);

  const handleAnswer = (answer: any, isCorrect: boolean) => {
    if (questions[currentQuestion]) {
      addAnswer(questions[currentQuestion].id, answer, isCorrect);
      // Let QuestionBox handle the progression with timer
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions completed
      setLessonCompleted(true);
      completeLesson();
      onComplete(state.score, state.timeSpent);
    }
  };

  const handleNextSection = () => {
    if (currentSection < lesson.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      // All sections completed, show questions
      setShowQuestions(true);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const renderSection = () => {
    const section = lesson.sections[currentSection];
    
    if (typeof section.content === 'string') {
      return (
        <motion.div
          key={section.id}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {section.title}
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {section.content}
          </p>
          <Button onClick={handleNextSection} size="lg">
            {currentSection === lesson.sections.length - 1 ? 'Start Practice' : 'Next Section'}
          </Button>
        </motion.div>
      );
    } else {
      // Interactive component
      const Component = section.content;
      return (
        <motion.div
          key={section.id}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              {section.title}
            </h3>
            <Component />
          </div>
          <div className="text-center">
            <Button onClick={handleNextSection} size="lg">
              {currentSection === lesson.sections.length - 1 ? 'Start Practice' : 'Next Section'}
            </Button>
          </div>
        </motion.div>
      );
    }
  };

  const renderQuestions = () => {
    if (questions.length === 0) {
      return (
        <motion.div
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">
            No Questions Available
          </h2>
          <p className="text-yellow-700 mb-6">
            This lesson doesn't have practice questions yet. You can still explore the interactive content!
          </p>
          <Button onClick={handleBackToHome} variant="warning" size="lg">
            Back to Home
          </Button>
        </motion.div>
      );
    }
    
    if (currentQuestion >= questions.length || lessonCompleted) {
      return (
        <motion.div
          className="bg-success-50 border border-success-200 rounded-xl p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle className="w-16 h-16 text-success-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-success-800 mb-4">
            Lesson Complete! 🎉
          </h2>
          <div className="space-y-2 mb-6">
            <p className="text-lg text-success-700">
              <strong>Score:</strong> {state.score} points
            </p>
            <p className="text-lg text-success-700">
              <strong>Accuracy:</strong> {getAccuracy().toFixed(1)}%
            </p>
            <p className="text-lg text-success-700">
              <strong>Time Spent:</strong> {Math.floor(state.timeSpent / 60)} minutes
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleBackToHome} variant="success" size="lg">
              Back to Home
            </Button>
            <Button onClick={() => window.location.reload()} variant="secondary" size="lg">
              Try Again
            </Button>
          </div>
        </motion.div>
      );
    }

    const question = questions[currentQuestion];
    return (
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <QuestionBox
          question={question}
          onAnswer={handleAnswer}
          onNext={handleNextQuestion}
          showHint={true}
          isLastQuestion={currentQuestion === questions.length - 1}
        />
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToHome}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {lesson.title}
                </h1>
                <p className="text-sm text-gray-600">
                  {lesson.estimatedTime} • {lesson.difficulty}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Section {currentSection + 1} of {lesson.sections.length}
              </div>
              {showQuestions && (
                <div className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ProgressBar
            progress={showQuestions ? getProgress(questions.length) : ((currentSection + 1) / lesson.sections.length) * 100}
            label={showQuestions ? "Practice Progress" : "Lesson Progress"}
            size="lg"
            color="primary"
          />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {!showQuestions ? renderSection() : renderQuestions()}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default LessonView;
