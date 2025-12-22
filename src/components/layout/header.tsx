"use client";

import Link from 'next/link';
import { LogIn, LogOut, Wrench } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Header() {
  const { isAuthenticated, login, logout } = useAppContext();
  const { toast } = useToast();
  const logoImage = PlaceHolderImages.find(img => img.id === 'logo');

  const handleLogin = () => {
    login();
    toast({
      title: 'Logged In',
      description: 'You now have admin privileges.',
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You no longer have admin privileges.',
    });
  };

  return (
    <header className="bg-card border-b sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
            {logoImage && <Image src={logoImage.imageUrl} alt={logoImage.description} width={32} height={32} data-ai-hint={logoImage.imageHint} className="rounded-md"/>}
            <span className="font-bold text-lg text-primary font-headline">RxInteract</span>
        </Link>
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Link href="/admin" passHref>
              <Button variant="ghost" size="sm">
                <Wrench className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </Link>
          )}
          {isAuthenticated ? (
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Button onClick={handleLogin} size="sm">
              <LogIn className="mr-2 h-4 w-4" />
              Admin Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
