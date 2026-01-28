import { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-prospere-gray-300 mb-2">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full px-4 py-3 bg-prospere-gray-900 border border-prospere-gray-700',
          'rounded-lg text-white',
          'focus:outline-none focus:ring-2 focus:ring-prospere-red focus:border-transparent',
          'transition-all duration-200',
          error && 'border-red-500',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-prospere-gray-900">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
