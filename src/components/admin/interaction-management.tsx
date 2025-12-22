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
import type { Interaction } from '@/lib/types';
import { interactionFormSchema } from '@/lib/types';
import type { AddInteractionCommand } from '@/app/actions/add-interaction/command';
import type { UpdateInteractionCommand } from '@/app/actions/update-interaction/command';
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

export function InteractionManagement() {
    const { drugs, interactions, getDrugById, addInteraction, updateInteraction, deleteInteraction } = useAppContext();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);

    const sortedDrugs = useMemo(() => [...drugs].sort((a, b) => a.name.localeCompare(b.name)), [drugs]);
    const sortedInteractions = useMemo(() => [...interactions].sort((a,b) => {
        const drug1Name = getDrugById(a.drug1Id)?.name || '';
        const drug2Name = getDrugById(b.drug1Id)?.name || '';
        return drug1Name.localeCompare(drug2Name);
    }), [interactions, getDrugById]);

    const form = useForm<z.infer<typeof interactionFormSchema>>({
        resolver: zodResolver(interactionFormSchema),
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
                // The form expects reco_details as a flat array, but our component uses a string.
                // This is a mismatch we need to handle. For simplicity, we'll join and let the user edit.
                reco_details: Array.isArray(editingInteraction.reco_details) ? editingInteraction.reco_details.join('\n') : editingInteraction.reco_details,
            } : { drug1Id: '', drug2Id: '', description: '', reco: '', reco_details: [] });
        }
    }, [isDialogOpen, editingInteraction, form]);


    const handleOpenDialog = (interaction: Interaction | null) => {
        setEditingInteraction(interaction);
        setDialogOpen(true);
    };

    function onSubmit(values: z.infer<typeof interactionFormSchema>) {
        if (editingInteraction) {
            const command: UpdateInteractionCommand = { id: editingInteraction.id, ...values };
            updateInteraction(command);
        } else {
            const command: AddInteractionCommand = values;
            addInteraction(command);
        }
        setDialogOpen(false);
    }
    
    function handleDelete(id: string) {
        deleteInteraction({ interactionId: id });
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1.5">
                    <CardTitle>Manage Interactions</CardTitle>
                    <CardDescription>Add, edit, or delete drug interactions.</CardDescription>
                </div>
                 <Button onClick={() => handleOpenDialog(null)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Interaction
                </Button>
            </CardHeader>
            <CardContent>
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
                            {sortedInteractions.length > 0 ? sortedInteractions.map((interaction) => (
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!editingInteraction}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a drug" /></SelectTrigger></FormControl>
                                            <SelectContent>{sortedDrugs.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={form.control} name="drug2Id" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Drug 2</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!editingInteraction}>
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
                                        <FormControl>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                              <SelectTrigger>
                                                  <SelectValue placeholder="Select a recommendation level" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                  <SelectItem value="CONTRE-INDICATION">CONTRE-INDICATION</SelectItem>
                                                  <SelectItem value="Association DECONSEILLEE">Association DECONSEILLEE</SelectItem>
                                                  <SelectItem value="Précaution d'emploi">Précaution d'emploi</SelectItem>
                                                  <SelectItem value="A prendre en compte">A prendre en compte</SelectItem>
                                              </SelectContent>
                                          </Select>
                                        </FormControl>
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
                                        <FormControl><Textarea placeholder="Provide details for the recommendation, one per line..." {...field} value={Array.isArray(field.value) ? field.value.join('\n') : field.value} rows={3} /></FormControl>
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
