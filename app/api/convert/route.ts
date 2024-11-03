// app/api/convert/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const amount = searchParams.get('amount');
  const fromCurrency = searchParams.get('from');
  const toCurrency = searchParams.get('to');

  if (!amount || !fromCurrency || !toCurrency) {
    console.error('Invalid request parameters:', { amount, fromCurrency, toCurrency });
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const requestURL = "https://hexarate.paikama.co/api/rates/latest/" + fromCurrency + "?target=" + toCurrency;
    console.log('Fetching exchange rate:', requestURL);
    const response = await fetch(requestURL);

    if (!response.ok) {
      console.error('Failed to fetch exchange rate:', response.statusText);
      return NextResponse.json({ error: 'Failed to fetch exchange rate' }, { status: response.status });
    }

    const data = await response.json();
    console.log('API response data:', data);

    const conversionRate = data.data.mid;
    const convertedAmount = conversionRate*parseFloat(amount);

    console.log('Exchange rate:', conversionRate);
    console.log('Converted amount:', convertedAmount);  

    return NextResponse.json({ conversionRate, convertedAmount });
  } catch (error) {
    console.error('An error occurred while fetching exchange rate:', error);
    return NextResponse.json({ error: 'An error occurred while fetching exchange rate' }, { status: 500 });
  }
}