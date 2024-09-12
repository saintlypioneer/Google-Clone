// app/api/search/route.js
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
      engine: "google_images",
      q,
      google_domain: "google.com",
      gl: "us",
      hl: "en",
      api_key: process.env.SERPAPI_API_KEY
    });

    const imageResults = response.images_results || [];

    const processedResults = imageResults.map(img => {
      const domain = new URL(img.original).hostname;
      return {
        thumbnail: img.thumbnail,
        original: img.original,
        title: img.title,
        link: img.link,
        source: img.source,
        is_product: img.is_product,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        source_name: img.source_name
      };
    });

    return NextResponse.json({ results: processedResults });
  } catch (error) {
    console.error('Error fetching image results:', error);
    return NextResponse.json({ error: 'An error occurred while fetching image results' }, { status: 500 });
  }
}