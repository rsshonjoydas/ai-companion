'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { ChangeEventHandler, useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryId = searchParams.get('categoryId');
  const name = searchParams.get('name');

  const [value, setValue] = useState(name || '');
  const debouncedValue = useDebounce<string>(value, 500);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const query = {
      name: debouncedValue,
      categoryId,
    };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [categoryId, debouncedValue, router]);

  const clearInput = () => {
    setValue('');
  };

  return (
    <div className='relative'>
      <Search className='absolute h-4 w-4 top-3 left-4 text-muted-foreground ' />
      <Input
        onChange={onChange}
        value={value}
        placeholder='Search...'
        className='pl-10 bg-primary/10'
      />
      {value && (
        <button
          onClick={clearInput}
          className='absolute top-2 right-3 text-slate-400 cursor-pointer'
          type='button'
        >
          <X />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
