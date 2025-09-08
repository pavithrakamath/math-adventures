import { lessons } from '../lessons';

describe('lessons data', () => {
  it('should have lessons array', () => {
    expect(Array.isArray(lessons)).toBe(true);
    expect(lessons.length).toBeGreaterThan(0);
  });

  it('should have valid lesson structure', () => {
    lessons.forEach((lesson) => {
      expect(lesson).toHaveProperty('id');
      expect(lesson).toHaveProperty('title');
      expect(lesson).toHaveProperty('description');
      expect(lesson).toHaveProperty('difficulty');
      expect(lesson).toHaveProperty('estimatedTime');
      expect(lesson).toHaveProperty('emoji');
      expect(lesson).toHaveProperty('sections');
      expect(lesson).toHaveProperty('learningObjectives');
      
      expect(typeof lesson.id).toBe('string');
      expect(typeof lesson.title).toBe('string');
      expect(typeof lesson.description).toBe('string');
      expect(['Beginner', 'Intermediate', 'Advanced']).toContain(lesson.difficulty);
      expect(typeof lesson.estimatedTime).toBe('string');
      expect(typeof lesson.emoji).toBe('string');
      expect(Array.isArray(lesson.sections)).toBe(true);
      expect(Array.isArray(lesson.learningObjectives)).toBe(true);
    });
  });

  it('should have unique lesson IDs', () => {
    const ids = lessons.map(lesson => lesson.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have valid sections', () => {
    lessons.forEach(lesson => {
      lesson.sections.forEach((section) => {
        expect(section).toHaveProperty('id');
        expect(section).toHaveProperty('type');
        expect(section).toHaveProperty('title');
        expect(section).toHaveProperty('content');
        expect(section).toHaveProperty('order');
        
        expect(typeof section.id).toBe('string');
        expect(['intro', 'interactive', 'practice', 'assessment', 'quiz']).toContain(section.type);
        expect(typeof section.title).toBe('string');
        expect(typeof section.order).toBe('number');
      });
    });
  });

  it('should have sections in correct order', () => {
    lessons.forEach(lesson => {
      const orders = lesson.sections.map(section => section.order);
      const sortedOrders = [...orders].sort((a, b) => a - b);
      expect(orders).toEqual(sortedOrders);
    });
  });

  it('should have learning objectives', () => {
    lessons.forEach(lesson => {
      expect(lesson.learningObjectives.length).toBeGreaterThan(0);
      lesson.learningObjectives.forEach(objective => {
        expect(typeof objective).toBe('string');
        expect(objective.length).toBeGreaterThan(0);
      });
    });
  });
});
