import * as React from 'react';

import { cn } from '../lib/utils';

export type InputWithAdornmentsElement = HTMLInputElement;

export type InputWithAdornmentsProps =
  React.InputHTMLAttributes<HTMLInputElement> & {
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    containerClassName?: string;
  };

const InputWithAdornments = ({
  className,
  startAdornment,
  endAdornment,
  containerClassName,
  ...props
}: InputWithAdornmentsProps): React.JSX.Element => {
  const hasStart = Boolean(startAdornment);
  const hasEnd = Boolean(endAdornment);

  return (
    <div className={cn('relative flex h-9 w-full', containerClassName)}>
      {hasStart && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center">
          {startAdornment}
        </span>
      )}

      <input
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          hasStart && hasEnd
            ? 'pl-10 pr-10'
            : hasStart
              ? 'pl-10 pr-3'
              : hasEnd
                ? 'pl-3 pr-10'
                : 'px-3',
          className
        )}
        {...props}
      />

      {hasEnd && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center">
          {endAdornment}
        </span>
      )}
    </div>
  );
};

export { InputWithAdornments };
