'use client';

import { useCallback } from 'react';

import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  const onLightClick = useCallback(() => {
    setTheme('light');
  }, [setTheme]);

  const onDarkClick = useCallback(() => {
    setTheme('dark');
  }, [setTheme]);

  const onSystemClick = useCallback(() => {
    setTheme('system');
  }, [setTheme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          Theme
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onLightClick}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={onDarkClick}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={onSystemClick}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
