"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DrugManagement } from './drug-management';
import { InteractionManagement } from './interaction-management';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

export function AdminPage() {
  const { isAuthenticated } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
        <Card className="max-w-md mx-auto mt-10 animate-in fade-in-50 duration-500">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>You must be logged in to view this page.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center text-sm text-muted-foreground">Redirecting to homepage...</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage drugs and their interactions in the system.</p>
      </div>
      <Tabs defaultValue="drugs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="drugs">Drug Management</TabsTrigger>
          <TabsTrigger value="interactions">Interaction Management</TabsTrigger>
        </TabsList>
        <TabsContent value="drugs">
          <DrugManagement />
        </TabsContent>
        <TabsContent value="interactions">
          <InteractionManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
