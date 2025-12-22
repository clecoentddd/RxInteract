"use client";

import { useState, useEffect, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppContext } from '@/context/app-context';
import type { Interaction } from '@/lib/types';
import { AlertTriangle, Shield, ShieldAlert, ShieldCheck, Info, Pill } from 'lucide-react';

const SeverityIndicator = ({ severity }: { severity: Interaction['severity'] }) => {
    switch (severity) {
        case 'Severe':
            return <ShieldAlert className="h-10 w-10 text-destructive" />;
        case 'Moderate':
            return <AlertTriangle className="h-10 w-10 text-yellow-500" />;
        case 'Mild':
            return <ShieldCheck className="h-10 w-10 text-green-500" />;
        default:
            return <Shield className="h-10 w-10 text-muted-foreground" />;
    }
};

export function InteractionChecker() {
  const { drugs, interactions } = useAppContext();
  const [drug1Id, setDrug1Id] = useState<string | null>(null);
  const [drug2Id, setDrug2Id] = useState<string | null>(null);
  const [foundInteraction, setFoundInteraction] = useState<Interaction | null>(null);

  const sortedDrugs = useMemo(() => [...drugs].sort((a, b) => a.name.localeCompare(b.name)), [drugs]);

  const interactingDrugs = useMemo(() => {
    if (!drug1Id) return [];
    
    const interactingDrugIds = new Set<string>();
    interactions.forEach(interaction => {
      if (interaction.drug1Id === drug1Id) {
        interactingDrugIds.add(interaction.drug2Id);
      }
      if (interaction.drug2Id === drug1Id) {
        interactingDrugIds.add(interaction.drug1Id);
      }
    });

    return sortedDrugs.filter(drug => interactingDrugIds.has(drug.id));
  }, [drug1Id, interactions, sortedDrugs]);

  useEffect(() => {
    if (drug1Id && drug2Id) {
      if (drug1Id === drug2Id) {
        setFoundInteraction(null);
        return;
      }
      const interaction = interactions.find(
        (i) =>
          (i.drug1Id === drug1Id && i.drug2Id === drug2Id) ||
          (i.drug1Id === drug2Id && i.drug2Id === drug1Id)
      );
      setFoundInteraction(interaction || null);
    } else {
        setFoundInteraction(null);
    }
  }, [drug1Id, drug2Id, interactions]);

  const handleDrug1Change = (value: string) => {
    setDrug1Id(value);
    setDrug2Id(null);
    setFoundInteraction(null);
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg animate-in fade-in-50 duration-500">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Drug Interaction Checker</CardTitle>
          <CardDescription>
            Select two drugs to check for potential interactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <Select onValueChange={handleDrug1Change} value={drug1Id || ''}>
              <SelectTrigger id="drug1">
                <SelectValue placeholder="Select first drug" />
              </SelectTrigger>
              <SelectContent>
                {sortedDrugs.map((drug) => (
                  <SelectItem key={drug.id} value={drug.id}>
                    {drug.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setDrug2Id} value={drug2Id || ''} disabled={!drug1Id}>
              <SelectTrigger id="drug2">
                <SelectValue placeholder="Select second drug" />
              </SelectTrigger>
              <SelectContent>
                {interactingDrugs.length > 0 ? interactingDrugs.map((drug) => (
                  <SelectItem key={drug.id} value={drug.id}>
                    {drug.name}
                  </SelectItem>
                )) : <p className="p-4 text-sm text-muted-foreground">No interactions found for the first drug.</p>}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="min-h-[200px] transition-all duration-300">
        {drug1Id && drug2Id && drug1Id !== drug2Id ? (
          <div className="animate-in fade-in-50 duration-500">
          {foundInteraction ? (
            <Card className={`border-l-4 ${
                foundInteraction.severity === 'Severe' ? 'border-destructive' :
                foundInteraction.severity === 'Moderate' ? 'border-yellow-500' :
                'border-green-500'
            }`}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <SeverityIndicator severity={foundInteraction.severity} />
                  <div>
                    <CardTitle className="text-xl">{foundInteraction.severity} Interaction</CardTitle>
                    <CardDescription>
                      Interaction between {drugs.find(d => d.id === drug1Id)?.name} and {drugs.find(d => d.id === drug2Id)?.name}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{foundInteraction.description}</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-l-4 border-gray-400">
                 <CardHeader>
                    <div className="flex items-start gap-4">
                        <Info className="h-10 w-10 text-muted-foreground" />
                        <div>
                            <CardTitle className="text-xl">No Interaction Found</CardTitle>
                             <CardDescription>
                                No significant interaction is on record for this combination.
                            </CardDescription>
                        </div>
                    </div>
                 </CardHeader>
                 <CardContent>
                    <p className="text-muted-foreground">This does not mean no interactions exist. Always consult with a healthcare professional.</p>
                 </CardContent>
            </Card>
          )}
          </div>
        ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-card rounded-lg border-dashed border-2 h-full">
                <Pill size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">Select two different drugs to see interaction details.</h3>
            </div>
        )}
      </div>
    </div>
  );
}
