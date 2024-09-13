// app/api/v1/autocomplete/route.js
import { NextResponse } from 'next/server';
import { getJson } from 'serpapi';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const response = await getJson({
      engine: "google_autocomplete",
      q,
      google_domain: "google.com",
      gl: "us",
      hl: "en",
      api_key: process.env.SERPAPI_API_KEY
    });

    const suggestions = (response.suggestions || []).slice(0, 8);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    return NextResponse.json({ error: 'An error occurred while fetching autocomplete suggestions' }, { status: 500 });
  }
}