import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => string;
}

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 1000000,
  step = 1000,
  formatValue,
  className,
  ...props
}: SliderProps) {
  const displayValue = formatValue ? formatValue(value) : value.toLocaleString('pt-BR');
  
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-prospere-gray-300">
            {label}
          </label>
          <span className="text-lg font-bold text-white">
            {displayValue}
          </span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'w-full h-2 bg-prospere-gray-800 rounded-lg appearance-none cursor-pointer',
          'accent-prospere-red',
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4',
          '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-prospere-red',
          '[&::-webkit-slider-thumb]:cursor-pointer',
          '[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full',
          '[&::-moz-range-thumb]:bg-prospere-red [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer'
        )}
        {...props}
      />
      <div className="flex justify-between text-xs text-prospere-gray-500 mt-1">
        <span>{formatValue ? formatValue(min) : min.toLocaleString('pt-BR')}</span>
        <span>{formatValue ? formatValue(max) : max.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  );
}
