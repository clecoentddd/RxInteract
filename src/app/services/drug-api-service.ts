// src/app/services/drug-api-service.ts
"use server";

type CompositionApiResponse = {
    count: number;
    error?: string;
}

export async function fetchDrugComposition(drugName: string): Promise<CompositionApiResponse> {
    try {
      const response = await fetch(`https://medicaments-api.giygas.dev/medicament/${drugName.toLowerCase()}`);
      if (!response.ok) {
        // Try to get a more detailed error from the API response if possible
        const errorText = await response.text();
        console.error(`API Error Response: ${errorText}`);
        throw new Error(`External API failed with status: ${response.status}`);
      }
      const data = await response.json();
      return { count: data.length };
    } catch (error: any) {
      console.error("Failed to fetch drug composition:", error);
      return { count: 0, error: error.message || 'An unknown error occurred' };
    }
}
