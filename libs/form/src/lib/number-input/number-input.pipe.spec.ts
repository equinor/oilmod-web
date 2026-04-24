import { NumberInputPipe } from './number-input.pipe';

describe('NumberInputPipe', () => {
  let pipe: NumberInputPipe;

  beforeEach(() => {
    pipe = new NumberInputPipe();
  });

  describe('transform', () => {
    it('formats a positive number', () => {
      expect(pipe.transform(1234.56, 2)).toBe('1 234,56');
    });

    it('preserves the negative sign for negative integers', () => {
      // Regression: previously '-21' was rendered as '21' because the pipe
      // multiplied parseInt by -1, which flips an already-negative number.
      expect(pipe.transform(-21, 2)).toBe('-21,00');
      expect(pipe.transform(-21.34, 2)).toBe('-21,34');
      expect(pipe.transform('-21.34', 2)).toBe('-21,34');
    });

    it('preserves the negative sign for -0.x values', () => {
      expect(pipe.transform(-0.123, 3)).toBe('-0,123');
      expect(pipe.transform('-0.5', 2)).toBe('-0,50');
    });

    it('formats negative thousands', () => {
      expect(pipe.transform(-1234.5, 2)).toBe('-1 234,50');
    });
  });

  describe('parse', () => {
    it('parses a positive value', () => {
      expect(pipe.parse('1 234,56', 2)).toBe('1234.56');
    });

    it('parses a negative value without flipping the sign', () => {
      expect(pipe.parse('-21,34', 2)).toBe('-21.34');
      expect(pipe.parse('-1 234,5', 2)).toBe('-1234.50');
    });
  });
});
