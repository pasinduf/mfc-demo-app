import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const toastMessage = (
  message: string,
  type: 'success' | 'warning' | 'error',
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left'
    | undefined,
) => {
  toast.clearWaitingQueue();

  return toast(message, {
    type,
    position,
    theme: 'colored',
  });
};
