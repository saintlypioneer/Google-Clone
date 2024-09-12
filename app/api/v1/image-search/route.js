import { NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { join } from 'path';
import { writeFile, unlink } from 'fs/promises';
import { createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import https from 'https';

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileSize = parseInt(response.headers['content-length'], 10);
        let downloadedSize = 0;

        // Check file size (4MB limit)
        if (fileSize > 4 * 1024 * 1024) {
          reject(new Error('File size exceeds the 4MB limit'));
          return;
        }

        const fileStream = createWriteStream(filepath);
        response.pipe(fileStream);

        response.on('data', (chunk) => {
          downloadedSize += chunk.length;
          if (downloadedSize > 4 * 1024 * 1024) {
            fileStream.close();
            unlink(filepath).catch(console.error); // Clean up the partially downloaded file
            reject(new Error('File size exceeds the 4MB limit'));
          }
        });

        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });

        fileStream.on('error', (error) => {
          unlink(filepath).catch(console.error); // Clean up in case of error
          reject(error);
        });
      } else {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
      }
    }).on('error', (error) => {
      reject(error);
    });
  });
}

export async function POST(request) {
  let tempFilePath;

  try {
    const formData = await request.formData();
    const file = formData.get('image');
    const imageUrl = formData.get('imageUrl');

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Check file size (4MB limit)
      const fileSizeInMB = buffer.length / (1024 * 1024);
      if (fileSizeInMB > 4) {
        return NextResponse.json({ error: 'File size exceeds the 4MB limit' }, { status: 400 });
      }

      // Temporarily save the file
      tempFilePath = join('/tmp', `${uuidv4()}-${file.name}`);
      await writeFile(tempFilePath, buffer);
    } else if (imageUrl) {
      tempFilePath = join('/tmp', `${uuidv4()}-image.jpg`);
      await downloadImage(imageUrl, tempFilePath);
    } else {
      return NextResponse.json({ error: 'No file uploaded or image URL provided' }, { status: 400 });
    }

    // Configure Google Vision API with credentials from environment variables
    const client = new ImageAnnotatorClient({
      credentials: {
        type: process.env.GOOGLE_CRED_TYPE,
        project_id: process.env.GOOGLE_CRED_PROJECT_ID,
        private_key_id: process.env.GOOGLE_CRED_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_CRED_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CRED_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CRED_CLIENT_ID,
        auth_uri: process.env.GOOGLE_CRED_AUTH_URI,
        token_uri: process.env.GOOGLE_CRED_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GOOGLE_CRED_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.GOOGLE_CRED_CLIENT_X509_CERT_URL,
        universe_domain: process.env.GOOGLE_CRED_UNIVERSE_DOMAIN,
      }
    });

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
  } finally {
    // Clean up the temporary file
    if (tempFilePath) {
      unlink(tempFilePath).catch(console.error);
    }
  }
}