import { describe, it, expect } from 'vitest';
import { classNames } from '../../utils/classNames';

describe('classNames', () => {
  it('should combine multiple class names', () => {
    expect(classNames('class1', 'class2', 'class3')).toBe('class1 class2 class3');
  });

  it('should filter out falsy values', () => {
    expect(classNames('class1', null, 'class2', undefined, false, 'class3')).toBe('class1 class2 class3');
  });

  it('should handle empty strings', () => {
    expect(classNames('class1', '', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    const condition = true;
    expect(classNames('base', condition && 'conditional')).toBe('base conditional');
  });

  it('should handle no arguments', () => {
    expect(classNames()).toBe('');
  });

  it('should handle arrays', () => {
    expect(classNames(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
  });
});

