import { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../utils/classNames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button = ({ children, variant = 'primary', className, ...props }: ButtonProps) => {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      className={classNames(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

