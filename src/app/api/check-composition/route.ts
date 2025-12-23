
// src/app/api/check-composition/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic' // defaults to auto
export async function POST(request: Request) {
  try {
    const { drugName } = await request.json();
    if (!drugName) {
      return NextResponse.json({ error: 'Drug name is required' }, { status: 400 });
    }

    const apiResponse = await fetch(`https://medicaments-api.giygas.dev/medicament/${drugName.toLowerCase()}`);
    
    if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error(`External API Error: ${errorText}`);
        return NextResponse.json({ error: `External API failed with status: ${apiResponse.status}` }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    
    return NextResponse.json({ count: data.length });
  } catch (error: any) {
    console.error("Failed to fetch drug composition:", error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}

// Increase the body size limit for this specific route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // Set to a value higher than the expected response size
    },
  },
};
