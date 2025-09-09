import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { resolveComponent, isComponentReference } from '../../utils/componentResolver';
import { QuestionRenderer } from './QuestionRenderer';
import { getQuestionsForLesson } from '../../data/questions';
import { useProgress } from '../../context/AppStateHooks';
import type { Lesson } from '../../types/lesson.types';

interface LessonViewProps {
  lesson: Lesson;
  currentSection: number;
  onSectionChange: (section: number) => void;
  onComplete?: (score: number, timeSpent: number) => void;
}

type AnswerStatus = 'correct' | 'incorrect' | 'unanswered';

const LessonView = ({ lesson, currentSection, onSectionChange, onComplete }: LessonViewProps) => {
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('unanswered');
  const [hasMadeMistake, setHasMadeMistake] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const { addMistake, updateScore, markAsCompleted } = useProgress();
  const questions = getQuestionsForLesson(lesson.id);

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
        <Button onClick={() => window.location.href = '/'} variant="secondary" size="lg">
          Back to Home
        </Button>
      </motion.div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const isLessonFinished = currentQuestion >= questions.length;

  const handleCheckAnswer = () => {
    const isCorrect = Array.isArray(currentQuestionData.answer)
      ? currentQuestionData.answer.map(a => a.toLowerCase()).includes(userAnswer.trim().toLowerCase())
      : userAnswer.trim().toLowerCase() === currentQuestionData.answer.toString().toLowerCase();

    setShowExplanation(true);
    if (isCorrect) {
      setAnswerStatus('correct');
      if (!hasMadeMistake) {
        updateScore(lesson.id, 10);
      }
    } else {
      setAnswerStatus('incorrect');
      if (!hasMadeMistake) {
        addMistake(lesson.id, currentQuestionData.text, currentQuestionData.errorDescription);
        setHasMadeMistake(true);
      }
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestion + 1;
    if (nextIndex >= questions.length) {
      markAsCompleted(lesson.id);
      onComplete?.(questions.length * 10, 0); // You could track time here
    }
    setCurrentQuestion(nextIndex);
    setUserAnswer('');
    setAnswerStatus('unanswered');
    setHasMadeMistake(false);
    setShowExplanation(false);
  };

  const handleTryAgain = () => {
    setUserAnswer('');
    setAnswerStatus('unanswered');
    setShowExplanation(false);
  };

  const handleNext = () => {
    if (currentSection < lesson.sections.length - 1) {
      onSectionChange(currentSection + 1);
    } else {
      setShowQuestions(true);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      onSectionChange(currentSection - 1);
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  const renderQuestions = () => {
    if (isLessonFinished) {
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
              <strong>Questions:</strong> {questions.length} completed
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleBackToHome} variant="primary" size="lg">
              Back to Home
            </Button>
            <Button onClick={() => window.location.reload()} variant="secondary" size="lg">
              Try Again
            </Button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={currentQuestionData.text}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            Question {currentQuestion + 1} of {questions.length}
          </h3>
          <div className="text-sm text-gray-500">
            {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
          </div>
        </div>
        
        <QuestionRenderer
          question={currentQuestionData}
          userAnswer={userAnswer}
          onAnswerChange={setUserAnswer}
          isCorrect={answerStatus === 'correct'}
          showExplanation={showExplanation}
          onCheckAnswer={handleCheckAnswer}
          onNextQuestion={handleNextQuestion}
          onTryAgain={handleTryAgain}
        />
      </motion.div>
    );
  };

  const renderSection = () => {
    const section = lesson.sections[currentSection];

    if (typeof section.content === 'string') {
      if (isComponentReference(section.content)) {
        const Component = resolveComponent(section.content);
        if (Component) {
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
                <Suspense fallback={
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <span className="ml-2 text-gray-600">Loading interactive content...</span>
                  </div>
                }>
                  <Component {...(section.props || {})} />
                </Suspense>
              </div>
            </motion.div>
          );
        }
      }

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
        </motion.div>
      );
    } else {
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
            <Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-gray-600">Loading interactive content...</span>
              </div>
            }>
              <Component {...(section.props || {})} />
            </Suspense>
          </div>
        </motion.div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!showQuestions ? renderSection() : renderQuestions()}
      </AnimatePresence>

      {!showQuestions && (
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            variant="secondary"
            disabled={currentSection === 0}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-gray-600">
            Section {currentSection + 1} of {lesson.sections.length}
          </div>

          <Button
            onClick={handleNext}
            variant="primary"
            className="flex items-center"
          >
            {currentSection === lesson.sections.length - 1 ? 'Start Practice' : 'Next'}
            {currentSection < lesson.sections.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LessonView;