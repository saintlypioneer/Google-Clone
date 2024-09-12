import { NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Check file size (4MB limit)
    const fileSizeInMB = buffer.length / (1024 * 1024);
    if (fileSizeInMB > 4) {
      return NextResponse.json({ error: 'File size exceeds the 4MB limit' }, { status: 400 });
    }

    // Temporarily save the file
    const tempFilePath = join('/tmp', `${uuidv4()}-${file.name}`);
    await writeFile(tempFilePath, buffer);

    const client = new ImageAnnotatorClient();
    const [result] = await client.webDetection(tempFilePath);
    const webDetection = result.webDetection;

    // Process visually similar images
    const visuallySimilarImages = (webDetection.visuallySimilarImages || []).map(img => ({
      thumbnail: img.url,
      original: img.url,
      title: 'Visually Similar Image',
      link: img.url,
      source: new URL(img.url).hostname,
      is_product: false,
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(img.url).hostname}&sz=64`,
      source_name: new URL(img.url).hostname
    }));

    // Process pages with matching images
    const pagesWithMatchingImages = (webDetection.pagesWithMatchingImages || []).map(page => ({
      thumbnail: page.fullMatchingImages?.[0]?.url || page.partialMatchingImages?.[0]?.url,
      original: page.url,
      title: page.pageTitle || 'Page with Matching Image',
      link: page.url,
      source: new URL(page.url).hostname,
      is_product: false,
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(page.url).hostname}&sz=64`,
      source_name: new URL(page.url).hostname
    }));

    // Combine and filter results
    const combinedResults = [...visuallySimilarImages, ...pagesWithMatchingImages]
      .filter(item => item.thumbnail)
      .map(item => ({
        ...item,
        is_product: item.is_product || false,
      }));

    return NextResponse.json({
      results: combinedResults
    });

  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'An error occurred while processing the image' }, { status: 500 });
  }
}