export type Variant = string;

export interface ABTest {
  id: string;
  variants: Variant[];
  weights: number[];
  paths: string[];
  cookieMaxAge?: number;
  enabled: boolean;
}

export const AB_TESTS: ABTest[] = [
  {
    id: 'thanks-page',
    variants: ['control', 'redesign'],
    weights: [0.5, 0.5],
    paths: ['/thanks-contact', '/thanks-download'],
    cookieMaxAge: 60 * 60 * 24 * 30, // 30 days
    enabled: true,
  },
];

export function getCookieName(testId: string): string {
  return `ab_${testId}`;
}

export function selectVariant(test: ABTest): Variant {
  const rand = Math.random();
  let cumulative = 0;
  for (let i = 0; i < test.weights.length; i++) {
    cumulative += test.weights[i];
    if (rand < cumulative) return test.variants[i];
  }
  return test.variants[test.variants.length - 1];
}

export function getTestsForPath(pathname: string): ABTest[] {
  return AB_TESTS.filter(test =>
    test.enabled && test.paths.some(p => pathname.startsWith(p))
  );
}

export const DEFAULT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
