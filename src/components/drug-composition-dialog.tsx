"use client";

import { useState } from 'react';
import type { Drug } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Beaker, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type CompositionResult = {
    count: number;
    error?: string;
}

export function DrugCompositionDialog({ drug }: { drug: Drug }) {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<CompositionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckComposition = async () => {
    setIsOpen(true);
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`https://medicaments-api.giygas.dev/medicament/${drug.name.toLowerCase()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResult({ count: data.length });
    } catch (error: any) {
      setResult({ count: 0, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleCheckComposition}>
        <Beaker className="mr-2 h-4 w-4" />
        Check Composition
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Composition for {drug.name}</DialogTitle>
            <DialogDescription>
              Checking the composition from an external API.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isLoading && (
                <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <p>Loading...</p>
                </div>
            )}
            {result && !isLoading && (
                <div>
                    {result.error ? (
                         <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{result.error}</AlertDescription>
                        </Alert>
                    ) : (
                        <Alert>
                            <AlertTitle>API Result</AlertTitle>
                            <AlertDescription>Found {result.count} medicaments.</AlertDescription>
                        </Alert>
                    )}
                </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
