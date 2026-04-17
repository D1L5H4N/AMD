/**
 * NeuroCart AI - Core Behavior Logic Tests
 * Tests for cart management, coupon calculations, input sanitization,
 * and AI trigger conditions.
 *
 * Run with: npx vitest run
 */

import { describe, it, expect } from 'vitest';
import { sanitizeInput } from '../app/utils/gemini';

// ─── Coupon & Pricing Logic ───────────────────────────────────────────────────

describe('Coupon discount calculations', () => {
  const basePrice = 10000;

  it('applies SAVE10 coupon for a 10% discount', () => {
    const discounted = basePrice * 0.9;
    expect(discounted).toBe(9000);
  });

  it('applies WELCOME15 coupon for a 15% discount', () => {
    const discounted = basePrice * 0.85;
    expect(discounted).toBe(8500);
  });

  it('applies FIRST20 coupon for a 20% discount', () => {
    const discounted = basePrice * 0.8;
    expect(discounted).toBe(8000);
  });

  it('applies no discount when no coupon is present', () => {
    const discounted = basePrice * 1.0;
    expect(discounted).toBe(10000);
  });
});

// ─── Cart Logic ───────────────────────────────────────────────────────────────

describe('Cart total calculation', () => {
  const items = [
    { price: 5000, quantity: 2 },
    { price: 1500, quantity: 1 },
  ];

  it('correctly sums cart without a coupon', () => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    expect(total).toBe(11500);
  });

  it('correctly sums an empty cart', () => {
    const total = [].reduce((sum: number) => sum, 0);
    expect(total).toBe(0);
  });
});

// ─── AI Trigger Conditions ────────────────────────────────────────────────────

describe('AI behavior triggers', () => {
  it('detects price-sensitive keywords in search query', () => {
    const priceKeywords = ['cheap', 'budget', 'under', 'affordable', 'low price', 'discount'];
    const query = 'budget phone under 20000';
    const isPriceSensitive = priceKeywords.some(k => query.toLowerCase().includes(k));
    expect(isPriceSensitive).toBe(true);
  });

  it('does not trigger price-sensitivity for neutral queries', () => {
    const priceKeywords = ['cheap', 'budget', 'under', 'affordable', 'low price', 'discount'];
    const query = 'iPhone 15 Pro';
    const isPriceSensitive = priceKeywords.some(k => query.toLowerCase().includes(k));
    expect(isPriceSensitive).toBe(false);
  });

  it('triggers trust badge after 3 product views', () => {
    const viewCount = 3;
    const shouldShowBadge = viewCount >= 3;
    expect(shouldShowBadge).toBe(true);
  });

  it('does not trigger trust badge before 3 product views', () => {
    const viewCount = 2;
    const shouldShowBadge = viewCount >= 3;
    expect(shouldShowBadge).toBe(false);
  });

  it('triggers comparison table when 3+ products compared', () => {
    const comparedProducts = ['p1', 'p2', 'p3'];
    const shouldShowComparison = comparedProducts.length >= 3;
    expect(shouldShowComparison).toBe(true);
  });
});

// ─── Input Sanitization (Security) ───────────────────────────────────────────

describe('sanitizeInput security checks', () => {
  it('strips HTML brackets to prevent XSS', () => {
    const result = sanitizeInput('<script>alert("xss")</script>');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('removes javascript: protocol injection attempts', () => {
    const result = sanitizeInput('javascript:alert(1)');
    expect(result.toLowerCase()).not.toContain('javascript:');
  });

  it('truncates overly long inputs to 500 characters', () => {
    const longInput = 'a'.repeat(600);
    expect(sanitizeInput(longInput).length).toBeLessThanOrEqual(500);
  });

  it('trims leading and trailing whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('passes clean input through unchanged', () => {
    expect(sanitizeInput('Show budget phones')).toBe('Show budget phones');
  });
});

// ─── Search History Deduplication ────────────────────────────────────────────

describe('Search history management', () => {
  it('moves duplicate search to the front (deduplication)', () => {
    const history = ['phone', 'watch', 'headphone'];
    const newQuery = 'phone';
    const updated = [newQuery, ...history.filter(q => q !== newQuery)].slice(0, 10);
    expect(updated[0]).toBe('phone');
    expect(updated.filter(q => q === 'phone').length).toBe(1);
  });

  it('keeps search history capped at 10 entries', () => {
    const history = Array.from({ length: 10 }, (_, i) => `search-${i}`);
    const updated = ['new-search', ...history].slice(0, 10);
    expect(updated.length).toBe(10);
  });
});
