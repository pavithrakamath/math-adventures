import React, { useState } from 'react';

interface EstimationGameProps {
  question?: string;
  correctAnswer?: number;
  unit?: string;
}

const EstimationGame: React.FC<EstimationGameProps> = () => {
  const [userEstimate, setUserEstimate] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState('');

  const checkEstimate = () => {
    const estimate = parseInt(userEstimate);
    const difference = Math.abs(estimate - currentQ.correctAnswer);
    const percentage = (difference / currentQ.correctAnswer) * 100;

    let feedbackText = '';
    if (percentage <= 10) {
      feedbackText = '🎉 Excellent estimate! You\'re very close!';
    } else if (percentage <= 25) {
      feedbackText = '👍 Good estimate! Pretty close!';
    } else if (percentage <= 50) {
      feedbackText = '🤔 Not bad, but you can do better!';
    } else {
      feedbackText = '😅 That\'s quite far off. Try thinking about it differently!';
    }

    setFeedback(feedbackText);
    setShowResult(true);
  };

  const questions = [
    {
      question: "How many times do you blink in one hour?",
      correctAnswer: 1080,
      unit: "blinks",
      hint: "Most people blink about 15-20 times per minute"
    },
    {
      question: "How many breaths do you take in one day?",
      correctAnswer: 23040,
      unit: "breaths",
      hint: "Average person breathes about 16 times per minute"
    },
    {
      question: "How many steps to walk across a football field?",
      correctAnswer: 120,
      unit: "steps",
      hint: "A football field is about 100 yards long"
    },
    {
      question: "How many words in a typical book page?",
      correctAnswer: 250,
      unit: "words",
      hint: "Most books have about 250 words per page"
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQ = questions[currentQuestionIndex];

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    setUserEstimate('');
    setShowResult(false);
    setFeedback('');
  };

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">📏 Estimation Challenge</h3>
        <p className="text-gray-600">Test your estimation skills with real-world questions!</p>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-lg mb-2">{currentQ.question}</h4>
          <p className="text-sm text-gray-600">💡 Hint: {currentQ.hint}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Your estimate:</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={userEstimate}
              onChange={(e) => setUserEstimate(e.target.value)}
              className="flex-1 p-3 border rounded-lg text-center text-lg"
              placeholder="Enter your guess"
            />
            <span className="flex items-center text-gray-500 font-medium">
              {currentQ.unit}
            </span>
          </div>
        </div>

        <button
          onClick={checkEstimate}
          disabled={!userEstimate || showResult}
          className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50 font-semibold"
        >
          Check My Estimate
        </button>
      </div>

      {showResult && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3 text-center">Result</h4>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white p-3 rounded border">
                <div className="text-sm text-gray-600">Your Estimate</div>
                <div className="text-xl font-bold text-blue-600">{userEstimate}</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="text-sm text-gray-600">Correct Answer</div>
                <div className="text-xl font-bold text-green-600">{currentQ.correctAnswer.toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="text-lg font-semibold text-gray-800">{feedback}</div>
            </div>
          </div>

          <button
            onClick={nextQuestion}
            className="w-full px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold"
          >
            Try Another Question
          </button>
        </div>
      )}

      <div className="text-center text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
        <p>💡 <strong>Estimation Tips:</strong> Think about what you know, make reasonable guesses, and don't worry about being exact!</p>
      </div>
    </div>
  );
};

export default EstimationGame;
