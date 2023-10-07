'use client';

import { useTheme } from 'next-themes';

import Icons from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ThemeToggle = () => {
  const { setTheme } = useTheme();

  const theme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='px-0 w-9'>
          <Icons.Sun className='w-6 h-6 transition-all scale-100 rotate-0 stroke-primary dark:-rotate-90 dark:scale-0' />
          <Icons.Moon className='absolute w-6 h-6 transition-all scale-0 rotate-90 fill-primary dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={`${theme === 'light' ? 'bg-accent my-0.5' : ''}`}
        >
          <Icons.Sun className='w-5 h-5 mr-2 stroke-primary' />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={`${theme === 'dark' ? 'bg-accent my-0.5' : ''}`}
        >
          <Icons.Moon className='w-5 h-5 mr-2 fill-primary' />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={`${theme === 'system' || theme === null ? 'bg-accent my-0.5' : ''}`}
        >
          <Icons.System className='w-5 h-5 mr-2 stroke-primary' />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
