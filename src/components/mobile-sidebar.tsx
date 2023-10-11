import { Menu } from 'lucide-react';

import { Sidebar } from '@/components/sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const MobileSidebar = ({ isPro }: { isPro: boolean }) => (
  <Sheet>
    <SheetTrigger className='md:hidden pr-4'>
      <Menu />
    </SheetTrigger>
    <SheetContent side='left' className='p-0 bg-secondary pt-10 w-32'>
      <Sidebar isPro={isPro} />
    </SheetContent>
  </Sheet>
);
