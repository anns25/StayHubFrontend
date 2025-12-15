'use client';

interface SuggestedQuestionsProps {
  questions: string[];
  onQuestionClick?: (question: string) => void;
}

export default function SuggestedQuestions({ questions, onQuestionClick }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 justify-center">
      {questions.map((question, index) => (
        <button
          key={index}
          onClick={() => onQuestionClick?.(question)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors"
        >
          {question}
        </button>
      ))}
    </div>
  );
}

