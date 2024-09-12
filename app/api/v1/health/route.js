// app/api/health/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  // You can add more checks here if needed, e.g., database connectivity
  return NextResponse.json(
    { status: 'OK', message: 'Service is healthy' },
    { status: 200 }
  );
}