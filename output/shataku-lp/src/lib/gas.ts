const GAS_URL = 'https://script.google.com/macros/s/AKfycbz_M32V8aht98xSQAlJ--pNsyLQTbv8JEo1wTZ3Rnz_q8YLK-e3wNtjVUeHXEpBUsi8/exec';

export function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    utm_term: params.get('utm_term') || '',
  };
}

export async function submitToGAS(data: Record<string, string>): Promise<void> {
  await fetch(GAS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(data),
  });
}
