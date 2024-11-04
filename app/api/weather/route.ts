// app/api/weather/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const base = "https://api.openweathermap.org/data/2.5/weather?";

    const city = searchParams.get('city');

    if (!city) {
        console.error('Invalid request parameters:', { city });
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    try {
        const country_code = 'IN';
        const requestURL = `${base}q=${city},${country_code}&appid=${apiKey}&units=metric`;

        console.log('Fetching weather data:', requestURL);
        const response = await fetch(requestURL);

        if (!response.ok) {
            console.error('Failed to fetch weather data:', response.statusText);
            return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: response.status });
        }

        const data = await response.json();
        console.log('API response data:', data);

        return NextResponse.json(data);
    } catch (error) {
        console.error('An error occurred while fetching weather data:', error);
        return NextResponse.json({ error: 'An error occurred while fetching weather data' }, { status: 500 });
    }
}