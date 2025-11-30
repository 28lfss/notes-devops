import { classNames } from '../utils/classNames';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage = ({ message, className }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <div className={classNames('mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded', className)}>
      {message}
    </div>
  );
};

