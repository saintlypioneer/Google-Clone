import { NextResponse } from 'next/server';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

async function downloadImage(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download image: ${response.statusCode}`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function parseGoogleLensHTML(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const resultCards = document.querySelectorAll('.G19kAf.ENn9pd');
  return Array.from(resultCards).map(card => {
    const link = card.querySelector('a');
    const imgContainer = card.querySelector('.ksQYvb');
    const title = card.querySelector('.UAiK1e');
    const sourceName = card.querySelector('.fjbPGe');

    const thumbnailUrl = imgContainer ? imgContainer.getAttribute('data-thumbnail-url') : '';
    const originalUrl = link ? link.href : '';
    const sourceHostname = originalUrl ? new URL(originalUrl).hostname : '';

    return {
      thumbnail: thumbnailUrl || '',
      original: originalUrl,
      title: title ? title.textContent.trim() : '',
      link: originalUrl,
      source: sourceHostname,
      is_product: sourceHostname.includes('amazon') || sourceHostname.includes('shop') || originalUrl.includes('product'),
      favicon: `https://www.google.com/s2/favicons?domain=${sourceHostname}&sz=64`,
      source_name: sourceName ? sourceName.textContent.trim() : sourceHostname
    };
  }).filter(result => result.thumbnail && result.original);
}

export async function POST(request) {
  let imageBuffer;

  try {
    const formData = await request.formData();
    const file = formData.get('image');
    const imageUrl = formData.get('imageUrl');

    if (file) {
      const bytes = await file.arrayBuffer();
      imageBuffer = Buffer.from(bytes);
    } else if (imageUrl) {
      imageBuffer = await downloadImage(imageUrl);
    } else {
      return NextResponse.json({ error: 'No file uploaded or image URL provided' }, { status: 400 });
    }

    // Check file size (4MB limit)
    const fileSizeInMB = imageBuffer.length / (1024 * 1024);
    if (fileSizeInMB > 4) {
      return NextResponse.json({ error: 'File size exceeds the 4MB limit' }, { status: 400 });
    }

    // Prepare the request to Google Lens
    const googleFormData = new FormData();
    googleFormData.append('encoded_image', imageBuffer, {
      filename: 'image.jpg',
      contentType: 'image/jpeg',
    });
    googleFormData.append('processed_image_dimensions', '654,1000');

    const timestamp = Date.now();
    const url = `https://lens.google.com/v3/upload?hl=en-IN&re=df&st=${timestamp}&vpw=890&vph=812&ep=gsbubb`;

    const response = await fetch(url, {
      method: 'POST',
      body: googleFormData,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Origin': 'https://www.google.com',
        'Referer': 'https://www.google.com/',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const parsedResults = parseGoogleLensHTML(html);

    return NextResponse.json({
      results: parsedResults
    });

  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'An error occurred while processing the image' }, { status: 500 });
  }
}