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

const severities = ['Mild', 'Moderate', 'Severe'] as const;

const interactionSchema = z.object({
  drug1Id: z.string().min(1, 'Please select the first drug.'),
  drug2Id: z.string().min(1, 'Please select the second drug.'),
  severity: z.enum(severities),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
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
            // This validation is only for new interactions
            if (editingInteraction) return true;
            
            const exists = interactions.some(i => 
                (i.drug1Id === data.drug1Id && i.drug2Id === data.drug2Id) ||
                (i.drug1Id === data.drug2Id && i.drug2Id === data.drug1Id)
            );
            return !exists;
        }, {
            message: "An interaction between these two drugs already exists.",
            path: ["drug2Id"],
        })),
        defaultValues: {
            drug1Id: '',
            drug2Id: '',
            description: '',
        }
    });

    useEffect(() => {
        if (isDialogOpen) {
            form.reset(editingInteraction ? {
                drug1Id: editingInteraction.drug1Id,
                drug2Id: editingInteraction.drug2Id,
                severity: editingInteraction.severity,
                description: editingInteraction.description,
            } : { drug1Id: '', drug2Id: '', description: '' });
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
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manage Interactions</CardTitle>
                    <CardDescription>Add, edit, or delete drug interactions.</CardDescription>
                </div>
                <Button onClick={() => handleOpenDialog(null)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Interaction
                </Button>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Drug 1</TableHead>
                                <TableHead>Drug 2</TableHead>
                                <TableHead>Severity</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {interactions.length > 0 ? interactions.map((interaction) => (
                                <TableRow key={interaction.id}>
                                    <TableCell>{getDrugById(interaction.drug1Id)?.name || 'N/A'}</TableCell>
                                    <TableCell>{getDrugById(interaction.drug2Id)?.name || 'N/A'}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            interaction.severity === 'Severe' ? 'bg-destructive/20 text-destructive' :
                                            interaction.severity === 'Moderate' ? 'bg-yellow-500/20 text-yellow-600' :
                                            'bg-green-500/20 text-green-600'
                                        }`}>{interaction.severity}</span>
                                    </TableCell>
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
                                <FormField control={form.control} name="severity" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Severity</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select severity" /></SelectTrigger></FormControl>
                                            <SelectContent>{severities.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="description" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl><Textarea placeholder="Describe the interaction..." {...field} rows={5} /></FormControl>
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
