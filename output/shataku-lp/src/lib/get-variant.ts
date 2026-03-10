import { cookies } from 'next/headers';
import { getCookieName } from './ab-tests';

export async function getVariant(testId: string): Promise<string> {
  const cookieStore = await cookies();
  const cookieName = getCookieName(testId);
  const value = cookieStore.get(cookieName)?.value;
  return value || 'redesign';
}
