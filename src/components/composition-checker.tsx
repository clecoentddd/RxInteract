"use client";

import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Beaker, Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';

export function CompositionChecker() {
  const { drugs, checkComposition, compositionResults } = useAppContext();
  const [selectedDrugId, setSelectedDrugId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sortedDrugs = useMemo(() => [...drugs].sort((a, b) => a.name.localeCompare(b.name)), [drugs]);
  const result = selectedDrugId ? compositionResults.get(selectedDrugId) : null;
  const selectedDrug = selectedDrugId ? drugs.find(d => d.id === selectedDrugId) : null;

  const handleCheckComposition = async () => {
    if (!selectedDrug) return;
    
    setIsLoading(true);
    await checkComposition({ drugId: selectedDrug.id, drugName: selectedDrug.name });
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Drug Composition Checker</CardTitle>
        <CardDescription>Select a drug to find how many active ingredients it has, based on the initial data.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <Select onValueChange={setSelectedDrugId} value={selectedDrugId || ''}>
              <SelectTrigger id="drug-composition">
                <SelectValue placeholder="Select a drug" />
              </SelectTrigger>
              <SelectContent>
                {sortedDrugs.map((drug) => (
                  <SelectItem key={drug.id} value={drug.id}>
                    {drug.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleCheckComposition} disabled={!selectedDrugId || isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Beaker className="mr-2 h-4 w-4" />
              )}
              Check Active Ingredients
            </Button>
        </div>
        
        {result && (
          <div className="mt-6 animate-in fade-in-50 duration-500">
            <Separator className="my-4" />
            {result.error ? (
              <Alert variant="destructive">
                <AlertTitle>Error During Check</AlertTitle>
                <AlertDescription>{result.error}</AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <AlertTitle>Composition Result for {selectedDrug?.name}</AlertTitle>
                <AlertDescription>Found {result.count} active ingredients in the local database.</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
