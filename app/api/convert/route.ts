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

  const apiKey = process.env.CURRENCY_API_KEY;
  if (!apiKey) {
    console.error('API key not found');
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }

  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`);

    if (!response.ok) {
      console.error('Failed to fetch exchange rate:', response.statusText);
      return NextResponse.json({ error: 'Failed to fetch exchange rate' }, { status: response.status });
    }

    const data = await response.json();
    console.log('API response data:', data);

    const rate = data.conversion_rates;
    const convertedAmount = data.conversion_result;

    console.log('Exchange rate:', rate);
    console.log('Converted amount:', convertedAmount);  

    return NextResponse.json({ rate, convertedAmount });
  } catch (error) {
    console.error('An error occurred while fetching exchange rate:', error);
    return NextResponse.json({ error: 'An error occurred while fetching exchange rate' }, { status: 500 });
  }
}