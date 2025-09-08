import { questions, getQuestionsForLesson } from '../questions';

describe('questions data', () => {
  it('should have questions object', () => {
    expect(typeof questions).toBe('object');
    expect(questions).not.toBeNull();
    expect(Object.keys(questions).length).toBeGreaterThan(0);
  });

  it('should have valid question structure', () => {
    Object.values(questions).forEach(lessonQuestions => {
      lessonQuestions.forEach((question) => {
        expect(question).toHaveProperty('type');
        expect(question).toHaveProperty('text');
        expect(question).toHaveProperty('answer');
        expect(question).toHaveProperty('errorDescription');
        expect(question).toHaveProperty('hint');
        
        expect(['multiple-choice', 'drag-drop', 'input', 'visual-select', 'true-false', 'text', 'number', 'pictograph', 'chart']).toContain(question.type);
        expect(typeof question.text).toBe('string');
        expect(typeof question.answer === 'string' || Array.isArray(question.answer)).toBe(true);
        expect(typeof question.errorDescription).toBe('string');
        expect(typeof question.hint).toBe('string');
      });
    });
  });

  it('should have unique question texts', () => {
    const allQuestions = Object.values(questions).flat();
    const texts = allQuestions.map(question => question.text);
    const uniqueTexts = new Set(texts);
    expect(uniqueTexts.size).toBe(texts.length);
  });

  it('should have valid options for multiple choice questions', () => {
    const allQuestions = Object.values(questions).flat();
    const multipleChoiceQuestions = allQuestions.filter(q => q.type === 'multiple-choice');
    
    multipleChoiceQuestions.forEach(question => {
      expect(question.options).toBeDefined();
      expect(Array.isArray(question.options)).toBe(true);
      expect(question.options!.length).toBeGreaterThan(1);
    });
  });

  it('should have valid answers', () => {
    const allQuestions = Object.values(questions).flat();
    allQuestions.forEach(question => {
      expect(question.answer).toBeDefined();
      expect(question.answer).not.toBeNull();
    });
  });

  it('should have non-empty error descriptions and hints', () => {
    const allQuestions = Object.values(questions).flat();
    allQuestions.forEach(question => {
      expect(question.errorDescription.trim().length).toBeGreaterThan(0);
      expect(question.hint.trim().length).toBeGreaterThan(0);
    });
  });
});

describe('getQuestionsForLesson', () => {
  it('should return questions for a valid lesson ID', () => {
    const lessonId = 'patterns-mathematics';
    const lessonQuestions = getQuestionsForLesson(lessonId);
    
    expect(Array.isArray(lessonQuestions)).toBe(true);
    expect(lessonQuestions.length).toBeGreaterThan(0);
    
    // All returned questions should be valid Question objects
    lessonQuestions.forEach(question => {
      expect(question).toHaveProperty('type');
      expect(question).toHaveProperty('text');
      expect(question).toHaveProperty('answer');
    });
  });

  it('should return empty array for invalid lesson ID', () => {
    const lessonId = 'non-existent-lesson';
    const lessonQuestions = getQuestionsForLesson(lessonId);
    
    expect(Array.isArray(lessonQuestions)).toBe(true);
    expect(lessonQuestions.length).toBe(0);
  });

  it('should return questions with valid structure', () => {
    const lessonId = 'counting-basics';
    const lessonQuestions = getQuestionsForLesson(lessonId);
    
    lessonQuestions.forEach(question => {
      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('type');
      expect(question).toHaveProperty('correctAnswer');
      expect(question).toHaveProperty('lessonId');
    });
  });
});
