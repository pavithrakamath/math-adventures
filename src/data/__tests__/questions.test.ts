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
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('question');
        expect(question).toHaveProperty('type');
        expect(question).toHaveProperty('correctAnswer');
        expect(question).toHaveProperty('explanation');
        expect(question).toHaveProperty('hint');
        expect(question).toHaveProperty('points');
        expect(question).toHaveProperty('difficulty');
        
        expect(typeof question.id).toBe('string');
        expect(typeof question.question).toBe('string');
        expect(['multiple-choice', 'drag-drop', 'input', 'visual-select', 'true-false']).toContain(question.type);
        expect(typeof question.explanation).toBe('string');
        expect(typeof question.hint).toBe('string');
        expect(typeof question.points).toBe('number');
        expect(['easy', 'medium', 'hard']).toContain(question.difficulty);
      });
    });
  });

  it('should have unique question IDs', () => {
    const allQuestions = Object.values(questions).flat();
    const ids = allQuestions.map(question => question.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
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

  it('should have valid correct answers', () => {
    const allQuestions = Object.values(questions).flat();
    allQuestions.forEach(question => {
      expect(question.correctAnswer).toBeDefined();
      expect(question.correctAnswer).not.toBeNull();
    });
  });

  it('should have positive points', () => {
    const allQuestions = Object.values(questions).flat();
    allQuestions.forEach(question => {
      expect(question.points).toBeGreaterThan(0);
    });
  });

  it('should have non-empty explanations and hints', () => {
    const allQuestions = Object.values(questions).flat();
    allQuestions.forEach(question => {
      expect(question.explanation.trim().length).toBeGreaterThan(0);
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
      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('type');
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
