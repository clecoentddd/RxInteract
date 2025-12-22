"use client";

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Interaction } from '@/lib/types';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '../ui/input';

const interactionSchema = z.object({
  drug1Id: z.string().min(1, 'Please select the first drug.'),
  drug2Id: z.string().min(1, 'Please select the second drug.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  reco: z.string().min(1, 'Recommendation is required.'),
  reco_details: z.string().min(1, 'Recommendation details are required.').transform(val => [val]),
});


type InteractionFormValues = z.infer<typeof interactionSchema>;

export function InteractionManagement() {
    const { drugs, interactions, getDrugById, addInteraction, updateInteraction, deleteInteraction } = useAppContext();
    const { toast } = useToast();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);

    const sortedDrugs = useMemo(() => [...drugs].sort((a, b) => a.name.localeCompare(b.name)), [drugs]);

    const form = useForm<InteractionFormValues>({
        resolver: zodResolver(interactionSchema.refine(data => data.drug1Id !== data.drug2Id, {
            message: "The two drugs must be different.",
            path: ["drug2Id"],
        }).refine(data => {
            if (editingInteraction) return true;
            
            const drug1Name = getDrugById(data.drug1Id)?.name.toLowerCase();
            const drug2Name = getDrugById(data.drug2Id)?.name.toLowerCase();

            const exists = interactions.some(i => {
                const existingDrug1 = getDrugById(i.drug1Id)?.name.toLowerCase();
                const existingDrug2 = getDrugById(i.drug2Id)?.name.toLowerCase();
                return (existingDrug1 === drug1Name && existingDrug2 === drug2Name) ||
                       (existingDrug1 === drug2Name && existingDrug2 === drug1Name)
            });
            return !exists;
        }, {
            message: "An interaction between these two drugs already exists.",
            path: ["drug2Id"],
        })),
        defaultValues: {
            drug1Id: '',
            drug2Id: '',
            description: '',
            reco: '',
            reco_details: [],
        }
    });

    useEffect(() => {
        if (isDialogOpen) {
            form.reset(editingInteraction ? {
                ...editingInteraction,
                reco_details: editingInteraction.reco_details.join(' '),
            } : { drug1Id: '', drug2Id: '', description: '', reco: '', reco_details: [] });
        }
    }, [isDialogOpen, editingInteraction, form]);


    const handleOpenDialog = (interaction: Interaction | null) => {
        setEditingInteraction(interaction);
        setDialogOpen(true);
    };

    function onSubmit(values: InteractionFormValues) {
        if (editingInteraction) {
            updateInteraction(editingInteraction.id, values);
            toast({ title: 'Success', description: 'Interaction updated.' });
        } else {
            addInteraction(values);
            toast({ title: 'Success', description: 'Interaction added.' });
        }
        setDialogOpen(false);
    }
    
    function handleDelete(id: string) {
        deleteInteraction(id);
        toast({ title: 'Success', description: `Interaction deleted.` });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Interactions</CardTitle>
                <CardDescription>Add, edit, or delete drug interactions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-end">
                    <Button onClick={() => handleOpenDialog(null)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Interaction
                    </Button>
                </div>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Drug 1</TableHead>
                                <TableHead>Drug 2</TableHead>
                                <TableHead>Recommendation</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {interactions.length > 0 ? interactions.map((interaction) => (
                                <TableRow key={interaction.id}>
                                    <TableCell>{getDrugById(interaction.drug1Id)?.name || 'N/A'}</TableCell>
                                    <TableCell>{getDrugById(interaction.drug2Id)?.name || 'N/A'}</TableCell>
                                     <TableCell>{interaction.reco}</TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(interaction)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                              <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                This will permanently delete this interaction. This action cannot be undone.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction onClick={() => handleDelete(interaction.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                Delete
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">No interactions found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                            <DialogTitle>{editingInteraction ? 'Edit' : 'Add'} Interaction</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="drug1Id" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Drug 1</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={!!editingInteraction}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a drug" /></SelectTrigger></FormControl>
                                            <SelectContent>{sortedDrugs.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={form.control} name="drug2Id" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Drug 2</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={!!editingInteraction}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a drug" /></SelectTrigger></FormControl>
                                            <SelectContent>{sortedDrugs.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                </div>
                                 <FormField control={form.control} name="reco" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Recommendation</FormLabel>
                                        <FormControl><Input placeholder="e.g., Association DECONSEILLEE" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="description" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl><Textarea placeholder="Describe the interaction..." {...field} rows={3} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="reco_details" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Recommendation Details</FormLabel>
                                        <FormControl><Textarea placeholder="Provide details for the recommendation..." {...field} rows={3} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <DialogFooter>
                                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
