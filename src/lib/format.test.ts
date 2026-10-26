import { describe, expect, it } from 'vitest';
import {
  cn,
  formatDate,
  formatDecimal,
  formatRupiah,
  parseDigits,
  parsePastedAmount,
} from './format';

describe('formatRupiah', () => {
  it('formats with Indonesian grouping and no decimals', () => {
    expect(formatRupiah(1_234_567.6)).toBe('Rp 1.234.568');
  });
});

describe('formatDecimal', () => {
  it('keeps decimals with an Indonesian comma', () => {
    expect(formatDecimal(2.5)).toBe('2,5');
    expect(formatDecimal(10)).toBe('10');
  });
});

describe('formatDate', () => {
  it('formats ISO dates in Indonesian', () => {
    expect(formatDate('2026-10-25')).toBe('25 Oktober 2026');
  });

  it('returns the input when it is not a date', () => {
    expect(formatDate('kemarin')).toBe('kemarin');
  });
});

describe('parseDigits', () => {
  it.each([
    ['Rp 1.500.000', 1_500_000],
    ['007', 7],
    ['', 0],
    ['abc', 0],
    ['-250', 250],
  ])('parses %j as %d', (input, expected) => {
    expect(parseDigits(input)).toBe(expected);
  });
});

describe('parsePastedAmount', () => {
  it.each([
    ['Rp1.500.000,00', 1_500_000],
    ['1,500,000.00', 1_500_000],
    ['Rp 25.000.000,50', 25_000_000],
    ['IDR 2.500.000,5', 2_500_000],
    ['Rp 1.500.000', 1_500_000],
    ['1,500,000', 1_500_000],
    ['  750000  ', 750_000],
  ])('parses %j as %d', (input, expected) => {
    expect(parsePastedAmount(input)).toBe(expected);
  });
});

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', false, null, 'b', undefined)).toBe('a b');
  });
});
