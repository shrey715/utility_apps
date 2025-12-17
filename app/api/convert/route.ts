// app/api/convert/route.ts
import { NextResponse } from 'next/server';

// Currency lookup table - maps user input to safe, predefined values
// This approach ensures static analysis tools can verify no user input reaches the URL
const CURRENCY_LOOKUP: Record<string, string> = {
  "AED": "AED", "AFN": "AFN", "ALL": "ALL", "AMD": "AMD", "ANG": "ANG",
  "AOA": "AOA", "ARS": "ARS", "AUD": "AUD", "AWG": "AWG", "AZN": "AZN",
  "BAM": "BAM", "BBD": "BBD", "BDT": "BDT", "BGN": "BGN", "BHD": "BHD",
  "BIF": "BIF", "BMD": "BMD", "BND": "BND", "BOB": "BOB", "BRL": "BRL",
  "BSD": "BSD", "BTN": "BTN", "BWP": "BWP", "BYN": "BYN", "BZD": "BZD",
  "CAD": "CAD", "CDF": "CDF", "CHF": "CHF", "CLP": "CLP", "CNY": "CNY",
  "COP": "COP", "CRC": "CRC", "CUP": "CUP", "CVE": "CVE", "CZK": "CZK",
  "DJF": "DJF", "DKK": "DKK", "DOP": "DOP", "DZD": "DZD", "EGP": "EGP",
  "ERN": "ERN", "ETB": "ETB", "EUR": "EUR", "FJD": "FJD", "FKP": "FKP",
  "FOK": "FOK", "GBP": "GBP", "GEL": "GEL", "GGP": "GGP", "GHS": "GHS",
  "GIP": "GIP", "GMD": "GMD", "GNF": "GNF", "GTQ": "GTQ", "GYD": "GYD",
  "HKD": "HKD", "HNL": "HNL", "HRK": "HRK", "HTG": "HTG", "HUF": "HUF",
  "IDR": "IDR", "ILS": "ILS", "IMP": "IMP", "INR": "INR", "IQD": "IQD",
  "IRR": "IRR", "ISK": "ISK", "JEP": "JEP", "JMD": "JMD", "JOD": "JOD",
  "JPY": "JPY", "KES": "KES", "KGS": "KGS", "KHR": "KHR", "KID": "KID",
  "KMF": "KMF", "KRW": "KRW", "KWD": "KWD", "KYD": "KYD", "KZT": "KZT",
  "LAK": "LAK", "LBP": "LBP", "LKR": "LKR", "LRD": "LRD", "LSL": "LSL",
  "LYD": "LYD", "MAD": "MAD", "MDL": "MDL", "MGA": "MGA", "MKD": "MKD",
  "MMK": "MMK", "MNT": "MNT", "MOP": "MOP", "MRU": "MRU", "MUR": "MUR",
  "MVR": "MVR", "MWK": "MWK", "MXN": "MXN", "MYR": "MYR", "MZN": "MZN",
  "NAD": "NAD", "NGN": "NGN", "NIO": "NIO", "NOK": "NOK", "NPR": "NPR",
  "NZD": "NZD", "OMR": "OMR", "PAB": "PAB", "PEN": "PEN", "PGK": "PGK",
  "PHP": "PHP", "PKR": "PKR", "PLN": "PLN", "PYG": "PYG", "QAR": "QAR",
  "RON": "RON", "RSD": "RSD", "RUB": "RUB", "RWF": "RWF", "SAR": "SAR",
  "SBD": "SBD", "SCR": "SCR", "SDG": "SDG", "SEK": "SEK", "SGD": "SGD",
  "SHP": "SHP", "SLE": "SLE", "SOS": "SOS", "SRD": "SRD", "SSP": "SSP",
  "STN": "STN", "SYP": "SYP", "SZL": "SZL", "THB": "THB", "TJS": "TJS",
  "TMT": "TMT", "TND": "TND", "TOP": "TOP", "TRY": "TRY", "TTD": "TTD",
  "TVD": "TVD", "TWD": "TWD", "TZS": "TZS", "UAH": "UAH", "UGX": "UGX",
  "USD": "USD", "UYU": "UYU", "UZS": "UZS", "VES": "VES", "VND": "VND",
  "VUV": "VUV", "WST": "WST", "XAF": "XAF", "XCD": "XCD", "XDR": "XDR",
  "XOF": "XOF", "XPF": "XPF", "YER": "YER", "ZAR": "ZAR", "ZMW": "ZMW",
  "ZWL": "ZWL"
};

// Get safe currency code from lookup table
function getSafeCurrencyCode(userInput: string | null): string | undefined {
  if (!userInput) return undefined;
  const normalized = userInput.toUpperCase().trim();
  return CURRENCY_LOOKUP[normalized];
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

  // Get safe currency codes from lookup table (SSRF protection)
  const safeFromCurrency = getSafeCurrencyCode(fromCurrency);
  const safeToCurrency = getSafeCurrencyCode(toCurrency);

  if (!safeFromCurrency) {
    return NextResponse.json({ error: `Invalid currency code: ${fromCurrency}` }, { status: 400 });
  }

  if (!safeToCurrency) {
    return NextResponse.json({ error: `Invalid currency code: ${toCurrency}` }, { status: 400 });
  }

  try {
    // Using ExchangeRate-API (free tier, 1500 requests/month)
    // Alternative: Open Exchange Rates or Fixer.io
    const requestURL = `https://api.exchangerate-api.com/v4/latest/${safeFromCurrency}`;
    const response = await fetch(requestURL, {
      headers: {
        'User-Agent': 'UtilityApps/1.0',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('Exchange rate API error:', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch exchange rate' }, { status: response.status });
    }

    const data = await response.json();

    // Get the conversion rate for target currency
    const conversionRate = data.rates[safeToCurrency];

    if (!conversionRate) {
      return NextResponse.json({ error: `Exchange rate not available for ${safeToCurrency}` }, { status: 404 });
    }

    const convertedAmount = conversionRate * parsedAmount;

    return NextResponse.json({ conversionRate, convertedAmount });
  } catch (error) {
    console.error('Currency conversion error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching exchange rate' }, { status: 500 });
  }
}