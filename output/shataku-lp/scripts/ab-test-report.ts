/**
 * A/B Test Report — GA4 Data API Analysis Script
 *
 * Usage:
 *   npx tsx scripts/ab-test-report.ts
 *
 * ============================================================
 * SETUP INSTRUCTIONS
 * ============================================================
 *
 * 1. Create a GCP Project (skip if you already have one):
 *    - Go to https://console.cloud.google.com/
 *    - Click the project selector at the top, then "New Project"
 *    - Enter a project name (e.g., "shataku-analytics") and click "Create"
 *
 * 2. Enable the GA4 Data API:
 *    - In GCP Console, go to "APIs & Services" > "Library"
 *    - Search for "Google Analytics Data API"
 *    - Click "Google Analytics Data API" (v1beta) and click "Enable"
 *
 * 3. Create a Service Account:
 *    - Go to "APIs & Services" > "Credentials"
 *    - Click "Create Credentials" > "Service account"
 *    - Enter a name (e.g., "ga4-reader") and click "Create and Continue"
 *    - Skip the optional role assignment, click "Done"
 *    - Click on the newly created service account email
 *    - Go to the "Keys" tab > "Add Key" > "Create new key" > JSON > "Create"
 *    - Save the downloaded JSON file as: scripts/ga4-credentials.json
 *
 * 4. Add the Service Account to GA4:
 *    - Copy the service account email (e.g., ga4-reader@your-project.iam.gserviceaccount.com)
 *    - Go to Google Analytics (https://analytics.google.com/)
 *    - Navigate to Admin > Property > Property Access Management
 *    - Click "+" > "Add users"
 *    - Paste the service account email, set role to "Viewer", and click "Add"
 *
 * 5. Find your GA4 Property ID:
 *    - In Google Analytics, go to Admin > Property > Property Details
 *    - Copy the "Property ID" (a numeric string like "123456789")
 *    - Set it as GA4_PROPERTY_ID below
 *
 * 6. Security:
 *    - scripts/ga4-credentials.json is already in .gitignore
 *    - NEVER commit credentials to version control
 *
 * ============================================================
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================
// CONFIGURATION
// ============================================================

const GA4_PROPERTY_ID: string = 'YOUR_GA4_PROPERTY_ID'; // e.g., '123456789'
const CREDENTIALS_PATH = './scripts/ga4-credentials.json';
const TEST_NAME = 'thanks-page'; // which A/B test to analyze
const DATE_RANGE_DAYS = 30; // look back N days

// ============================================================
// Fisher's Exact Test Implementation
// ============================================================

/**
 * Compute log(n!) using Stirling's approximation for large n,
 * or a simple summation for small n, with memoization.
 */
const logFactorialCache: Map<number, number> = new Map();

function logFactorial(n: number): number {
  if (n <= 1) return 0;
  const cached = logFactorialCache.get(n);
  if (cached !== undefined) return cached;

  // For small n, compute directly
  if (n <= 1000) {
    let result = 0;
    for (let i = 2; i <= n; i++) {
      result += Math.log(i);
    }
    logFactorialCache.set(n, result);
    return result;
  }

  // Stirling's approximation for very large n
  const result =
    n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n) + 1 / (12 * n);
  logFactorialCache.set(n, result);
  return result;
}

/**
 * Probability of a specific 2x2 table under Fisher's exact test (hypergeometric).
 *
 * Table layout:
 *            | Converted | Not Converted | Total
 *   control  |     a     |      b        |  a+b
 *   redesign |     c     |      d        |  c+d
 *   Total    |    a+c    |     b+d       |   N
 */
function fisherExactProbability(
  a: number,
  b: number,
  c: number,
  d: number,
): number {
  const n = a + b + c + d;
  const logP =
    logFactorial(a + b) +
    logFactorial(c + d) +
    logFactorial(a + c) +
    logFactorial(b + d) -
    logFactorial(n) -
    logFactorial(a) -
    logFactorial(b) -
    logFactorial(c) -
    logFactorial(d);
  return Math.exp(logP);
}

/**
 * Two-sided Fisher's exact test p-value.
 * Sums probabilities of all tables as extreme or more extreme than observed.
 */
function fisherExactTest(
  a: number,
  b: number,
  c: number,
  d: number,
): number {
  const observedP = fisherExactProbability(a, b, c, d);

  // Fix the marginals: row totals (a+b, c+d) and column totals (a+c, b+d)
  const row1 = a + b;
  const row2 = c + d;
  const col1 = a + c;

  // 'a' can range from max(0, col1 - row2) to min(row1, col1)
  const aMin = Math.max(0, col1 - row2);
  const aMax = Math.min(row1, col1);

  let pValue = 0;
  for (let ai = aMin; ai <= aMax; ai++) {
    const bi = row1 - ai;
    const ci = col1 - ai;
    const di = row2 - ci;
    const p = fisherExactProbability(ai, bi, ci, di);
    // Two-sided: include tables with probability <= observed probability
    if (p <= observedP + 1e-10) {
      pValue += p;
    }
  }

  return Math.min(pValue, 1.0);
}

// ============================================================
// Date Helpers
// ============================================================

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getDateRange(days: number): { startDate: string; endDate: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
}

// ============================================================
// GA4 Data Fetching
// ============================================================

interface VariantData {
  impressions: number;
  conversions: number;
}

async function fetchEventCounts(
  client: BetaAnalyticsDataClient,
  propertyId: string,
  eventName: string,
  testName: string,
  startDate: string,
  endDate: string,
): Promise<Map<string, number>> {
  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'customEvent:ab_test_variant' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      andGroup: {
        expressions: [
          {
            filter: {
              fieldName: 'eventName',
              stringFilter: {
                value: eventName,
                matchType: 'EXACT',
              },
            },
          },
          {
            filter: {
              fieldName: 'customEvent:ab_test_name',
              stringFilter: {
                value: testName,
                matchType: 'EXACT',
              },
            },
          },
        ],
      },
    },
  });

  const counts = new Map<string, number>();
  if (response.rows) {
    for (const row of response.rows) {
      const variant = row.dimensionValues?.[0]?.value ?? '(unknown)';
      const count = parseInt(row.metricValues?.[0]?.value ?? '0', 10);
      counts.set(variant, count);
    }
  }
  return counts;
}

// ============================================================
// Report Display
// ============================================================

function displayReport(
  testName: string,
  startDate: string,
  endDate: string,
  variants: Map<string, VariantData>,
): void {
  // Gather data for control and redesign
  const control = variants.get('control') ?? { impressions: 0, conversions: 0 };
  const redesign = variants.get('redesign') ?? {
    impressions: 0,
    conversions: 0,
  };

  const controlCVR =
    control.impressions > 0 ? control.conversions / control.impressions : 0;
  const redesignCVR =
    redesign.impressions > 0
      ? redesign.conversions / redesign.impressions
      : 0;

  const relativeImprovement =
    controlCVR > 0 ? (redesignCVR - controlCVR) / controlCVR : 0;

  // Fisher's exact test
  const a = control.conversions;
  const b = control.impressions - control.conversions;
  const c = redesign.conversions;
  const d = redesign.impressions - redesign.conversions;
  const pValue = fisherExactTest(a, b, c, d);
  const isSignificant = pValue < 0.05;

  // Recommendation
  let recommendation: string;
  if (isSignificant && relativeImprovement > 0) {
    recommendation = 'Winner: redesign — consider deploying';
  } else if (isSignificant && relativeImprovement < 0) {
    recommendation = 'Winner: control — revert redesign';
  } else {
    recommendation = 'Continue collecting data (need more traffic)';
  }

  // Format numbers
  const fmtPct = (n: number) => (n * 100).toFixed(2) + '%';
  const fmtRel = (n: number) =>
    (n >= 0 ? '+' : '') + (n * 100).toFixed(1) + '%';
  const fmtNum = (n: number) => n.toLocaleString().padStart(12);

  // Build table
  const W = 59; // inner width
  const line = (s: string) => console.log(s);
  const pad = (s: string, w: number) => s.padEnd(w);
  const rpad = (s: string, w: number) => s.padStart(w);

  line(`\u250C${'─'.repeat(W)}\u2510`);
  line(`\u2502  A/B Test Report: ${pad(testName, W - 21)}\u2502`);
  line(
    `\u2502  Period: ${startDate} ~ ${pad(endDate, W - 12 - startDate.length - endDate.length + endDate.length)}${' '.repeat(Math.max(0, W - 12 - startDate.length - endDate.length))}\u2502`,
  );
  line(
    `\u251C${'─'.repeat(11)}\u252C${'─'.repeat(14)}\u252C${'─'.repeat(13)}\u252C${'─'.repeat(W - 11 - 14 - 13 - 3)}\u2524`,
  );
  line(
    `\u2502 ${pad('Variant', 9)}\u2502 ${pad('Impressions', 12)}\u2502 ${pad('Conversions', 11)}\u2502 ${pad('CVR', W - 11 - 14 - 13 - 5)}\u2502`,
  );
  line(
    `\u251C${'─'.repeat(11)}\u253C${'─'.repeat(14)}\u253C${'─'.repeat(13)}\u253C${'─'.repeat(W - 11 - 14 - 13 - 3)}\u2524`,
  );

  for (const [name, data] of [
    ['control', control],
    ['redesign', redesign],
  ] as [string, VariantData][]) {
    const cvr =
      data.impressions > 0
        ? fmtPct(data.conversions / data.impressions)
        : 'N/A';
    line(
      `\u2502 ${pad(name, 9)}\u2502 ${fmtNum(data.impressions)} \u2502 ${fmtNum(data.conversions)}\u2502 ${pad(cvr, W - 11 - 14 - 13 - 5)}\u2502`,
    );
  }

  line(
    `\u251C${'─'.repeat(11)}\u2534${'─'.repeat(14)}\u2534${'─'.repeat(13)}\u2534${'─'.repeat(W - 11 - 14 - 13 - 3)}\u2524`,
  );
  line(`\u2502 ${pad(`Relative improvement: ${fmtRel(relativeImprovement)}`, W - 2)} \u2502`);
  line(`\u2502 ${pad(`p-value: ${pValue.toFixed(4)}`, W - 2)} \u2502`);
  line(
    `\u2502 ${pad(`Significant (p < 0.05): ${isSignificant ? 'Yes' : 'No'}`, W - 2)} \u2502`,
  );
  line(`\u2502 ${pad(`Recommendation: ${recommendation}`, W - 2)} \u2502`);
  line(`\u2514${'─'.repeat(W)}\u2518`);

  // Also log any other variants found
  for (const [name] of variants) {
    if (name !== 'control' && name !== 'redesign') {
      console.log(`\nNote: unexpected variant found: "${name}"`);
    }
  }
}

// ============================================================
// Main
// ============================================================

async function main(): Promise<void> {
  // --- Validate configuration ---
  if (
    GA4_PROPERTY_ID === 'YOUR_GA4_PROPERTY_ID' ||
    GA4_PROPERTY_ID.trim() === ''
  ) {
    console.error(
      'ERROR: GA4_PROPERTY_ID is not set.\n' +
        'Open scripts/ab-test-report.ts and replace YOUR_GA4_PROPERTY_ID\n' +
        'with your numeric GA4 property ID (e.g., "123456789").\n' +
        'You can find it in Google Analytics > Admin > Property Details.',
    );
    process.exit(1);
  }

  // --- Validate credentials file ---
  const credentialsAbsPath = path.resolve(CREDENTIALS_PATH);
  if (!fs.existsSync(credentialsAbsPath)) {
    console.error(
      `ERROR: Credentials file not found at ${credentialsAbsPath}\n\n` +
        'Please follow the setup instructions at the top of this file:\n' +
        '  1. Create a GCP service account\n' +
        '  2. Download the JSON key file\n' +
        '  3. Save it as: scripts/ga4-credentials.json\n',
    );
    process.exit(1);
  }

  // --- Initialize GA4 client ---
  console.log('Connecting to GA4 Data API...\n');
  const client = new BetaAnalyticsDataClient({
    keyFilename: credentialsAbsPath,
  });

  const { startDate, endDate } = getDateRange(DATE_RANGE_DAYS);

  try {
    // --- Fetch data ---
    console.log(
      `Fetching A/B test data for "${TEST_NAME}" (${startDate} ~ ${endDate})...\n`,
    );

    const [impressionCounts, conversionCounts] = await Promise.all([
      fetchEventCounts(
        client,
        GA4_PROPERTY_ID,
        'ab_test_impression',
        TEST_NAME,
        startDate,
        endDate,
      ),
      fetchEventCounts(
        client,
        GA4_PROPERTY_ID,
        'ab_test_conversion',
        TEST_NAME,
        startDate,
        endDate,
      ),
    ]);

    // --- Merge into variant data ---
    const allVariants = new Set([
      ...impressionCounts.keys(),
      ...conversionCounts.keys(),
    ]);

    if (allVariants.size === 0) {
      console.error(
        `No data found for A/B test "${TEST_NAME}" in the last ${DATE_RANGE_DAYS} days.\n` +
          'Possible causes:\n' +
          '  - The A/B test events have not been fired yet\n' +
          '  - The test name does not match (check TEST_NAME config)\n' +
          '  - The custom event parameter names differ from expected\n' +
          '  - GA4 data may take 24-48 hours to appear in the Data API\n',
      );
      process.exit(1);
    }

    const variants = new Map<string, VariantData>();
    for (const variant of allVariants) {
      variants.set(variant, {
        impressions: impressionCounts.get(variant) ?? 0,
        conversions: conversionCounts.get(variant) ?? 0,
      });
    }

    // --- Display report ---
    displayReport(TEST_NAME, startDate, endDate, variants);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('PERMISSION_DENIED')) {
        console.error(
          'ERROR: Permission denied.\n' +
            'Make sure the service account email has been added as a Viewer\n' +
            'in GA4: Admin > Property Access Management > Add users\n\n' +
            `Details: ${error.message}`,
        );
      } else if (error.message.includes('NOT_FOUND')) {
        console.error(
          'ERROR: GA4 property not found.\n' +
            `Check that GA4_PROPERTY_ID "${GA4_PROPERTY_ID}" is correct.\n\n` +
            `Details: ${error.message}`,
        );
      } else {
        console.error(`ERROR: ${error.message}`);
      }
    } else {
      console.error('An unexpected error occurred:', error);
    }
    process.exit(1);
  }
}

main();
