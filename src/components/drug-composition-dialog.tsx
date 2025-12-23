"use client";

import { useState, useEffect } from 'react';
import type { Drug } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Beaker, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function DrugCompositionDialog({ drug }: { drug: Drug }) {
  const { checkComposition, compositionResults } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const result = compositionResults.get(drug.id);

  const handleCheckComposition = async () => {
    setIsOpen(true);
    if (!result || (Date.now() / 1000) - result.timestamp > 300) { // Don't re-fetch if we have a recent result
      setIsLoading(true);
      await checkComposition({ drugId: drug.id, drugName: drug.name });
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
            {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <p>Loading...</p>
                </div>
            ) : result ? (
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
            ) : (
                <div className="text-center text-muted-foreground">Click "Check Composition" to start.</div>
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
