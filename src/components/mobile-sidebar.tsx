import { Menu } from 'lucide-react';

import { Sidebar } from '@/components/sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const MobileSidebar = () => (
  <Sheet>
    <SheetTrigger className='md:hidden pr-4'>
      <Menu />
    </SheetTrigger>
    <SheetContent side='left' className='p-0 w-36'>
      <Sidebar />
    </SheetContent>
  </Sheet>
);
