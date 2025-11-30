import { classNames } from '../utils/classNames';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export const LoadingSpinner = ({ message = 'Loading...', className }: LoadingSpinnerProps) => {
  return (
    <div className={classNames('text-center py-8', className)}>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

