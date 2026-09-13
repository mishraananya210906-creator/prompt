import { QuizPayload, QuizResult, WeakTopic } from '../types/quiz';

export function calculateQuizResults(
  quiz: QuizPayload,
  answers: Record<number, number>
): QuizResult {
  let correctCount = 0;

  const questionReviews = quiz.questions.map((question) => {
    const selectedAnswer = answers[question.id] !== undefined ? answers[question.id] : null;
    const isCorrect = selectedAnswer === question.correctAnswer;
    if (isCorrect) {
      correctCount++;
    }
    return {
      question,
      selectedAnswer,
      isCorrect
    };
  });

  const totalQuestions = quiz.questions.length;
  const incorrectCount = totalQuestions - correctCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Exact feedback specification
  let feedbackMessage = "Good start. Review the weak topics and try again.";
  if (correctCount === 5) {
    feedbackMessage = "Excellent! You really know this material.";
  } else if (correctCount >= 3) {
    feedbackMessage = "Nice work! A little revision and you're there.";
  }

  // Derive weak topics exclusively from the student's incorrect answers
  const topicMap = new Map<string, { count: number; explanations: string[]; questions: number[] }>();

  for (const review of questionReviews) {
    if (!review.isCorrect) {
      const topic = review.question.topic?.trim() || 'Core Concept';
      const existing = topicMap.get(topic) || { count: 0, explanations: [], questions: [] };
      existing.count += 1;
      existing.explanations.push(review.question.explanation);
      existing.questions.push(review.question.id);
      topicMap.set(topic, existing);
    }
  }

  const weakTopics: WeakTopic[] = Array.from(topicMap.entries()).map(([topic, data]) => ({
    topic,
    count: data.count,
    explanationSummary: data.explanations[0] || `Review key lecture notes for ${topic}.`,
    relatedQuestions: data.questions
  }));

  return {
    totalQuestions,
    score: correctCount,
    percentage,
    correctCount,
    incorrectCount,
    feedbackMessage,
    weakTopics,
    questionReviews
  };
}
