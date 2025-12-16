// app/api/convert/route.ts
import { NextResponse } from 'next/server';

// Currency codes from currencies.json - exact match for dropdown validation
// This ensures only currencies shown in the UI are accepted (SSRF protection)
const VALID_CURRENCY_CODES = new Set([
  "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN",
  "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL",
  "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY",
  "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP",
  "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL", "GGP", "GHS",
  "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF",
  "IDR", "ILS", "IMP", "INR", "IQD", "IRR", "ISK", "JEP", "JMD", "JOD",
  "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT",
  "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD",
  "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN",
  "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK",
  "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR",
  "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SOS", "SRD", "SSP",
  "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD",
  "TVD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VES", "VND",
  "VUV", "WST", "XAF", "XCD", "XDR", "XOF", "XPF", "YER", "ZAR", "ZMW", "ZWL"
]);

function isValidCurrencyCode(code: string | null): boolean {
  if (!code) return false;
  return VALID_CURRENCY_CODES.has(code.toUpperCase().trim());
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const amount = searchParams.get('amount');
  const fromCurrency = searchParams.get('from');
  const toCurrency = searchParams.get('to');

  // Validate required parameters
  if (!amount || !fromCurrency || !toCurrency) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  // Validate amount is a positive number
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
  }

  // Validate currency codes against allow-list (SSRF protection)
  const normalizedFrom = fromCurrency.toUpperCase().trim();
  const normalizedTo = toCurrency.toUpperCase().trim();

  if (!isValidCurrencyCode(normalizedFrom)) {
    return NextResponse.json({ error: `Invalid currency code: ${fromCurrency}` }, { status: 400 });
  }

  if (!isValidCurrencyCode(normalizedTo)) {
    return NextResponse.json({ error: `Invalid currency code: ${toCurrency}` }, { status: 400 });
  }

  try {
    // Only validated currency codes are used in the URL
    const requestURL = `https://hexarate.paikama.co/api/rates/latest/${normalizedFrom}?target=${normalizedTo}`;
    const response = await fetch(requestURL);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch exchange rate' }, { status: response.status });
    }

    const data = await response.json();
    const conversionRate = data.data.mid;
    const convertedAmount = conversionRate * parsedAmount;

    return NextResponse.json({ conversionRate, convertedAmount });
  } catch (error) {
    console.error('Currency conversion error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching exchange rate' }, { status: 500 });
  }
}