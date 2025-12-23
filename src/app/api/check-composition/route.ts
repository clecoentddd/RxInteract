// src/app/api/check-composition/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic' // defaults to auto
export async function POST(request: Request) {
  try {
    const { drugName } = await request.json();
    if (!drugName) {
      return NextResponse.json({ error: 'Drug name is required' }, { status: 400 });
    }

    // Fetch only the composition to reduce payload size
    const apiResponse = await fetch(`https://medicaments-api.giygas.dev/medicament/${drugName.toLowerCase()}/composition`);
    
    if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error(`External API Error: ${errorText}`);
        // Try to parse the error for a more specific message
        try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.message === "Not Found") {
                 return NextResponse.json({ count: 0 });
            }
             return NextResponse.json({ error: errorJson.message || `External API failed with status: ${apiResponse.status}` }, { status: apiResponse.status });
        } catch (e) {
            return NextResponse.json({ error: `External API failed with status: ${apiResponse.status}` }, { status: apiResponse.status });
        }
    }

    const data = await apiResponse.json();
    
    // The API returns the composition array directly
    return NextResponse.json({ count: Array.isArray(data) ? data.length : 0 });
  } catch (error: any) {
    console.error("Failed to fetch drug composition:", error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
