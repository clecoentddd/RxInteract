"use client";

import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Search, Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

export function DrugLookup() {
  const { drugs, lookupDrug, drugLookupResults } = useAppContext();
  const [selectedDrugName, setSelectedDrugName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sortedDrugs = useMemo(() => [...drugs].sort((a, b) => a.name.localeCompare(b.name)), [drugs]);
  const result = selectedDrugName ? drugLookupResults.get(selectedDrugName) : null;
  const selectedDrug = selectedDrugName ? drugs.find(d => d.name === selectedDrugName) : null;

  const handleLookup = async () => {
    if (!selectedDrug) return;
    
    setIsLoading(true);
    await lookupDrug({ drugName: selectedDrug.name });
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Drug Data Lookup</CardTitle>
        <CardDescription>Select a drug to fetch its full data from the API.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <Select onValueChange={setSelectedDrugName} value={selectedDrugName || ''}>
              <SelectTrigger id="drug-lookup">
                <SelectValue placeholder="Select a drug" />
              </SelectTrigger>
              <SelectContent>
                {sortedDrugs.map((drug) => (
                  <SelectItem key={drug.id} value={drug.name}>
                    {drug.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleLookup} disabled={!selectedDrugName || isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Lookup Drug
            </Button>
        </div>
        
        {result && (
          <div className="mt-6 animate-in fade-in-50 duration-500">
            <Separator className="my-4" />
            <Alert variant={result.error ? 'destructive' : 'default'}>
                <AlertTitle>{result.error ? 'Error' : 'Médicament trouvé'}</AlertTitle>
                <AlertDescription>
                    <ScrollArea className="h-64 w-full mt-2">
                        <pre className="text-xs p-2 bg-muted rounded-md font-code whitespace-pre-wrap">
                            {JSON.stringify(result.data, null, 2)}
                        </pre>
                    </ScrollArea>
                </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
