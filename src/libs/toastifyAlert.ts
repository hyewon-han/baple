import { Flip, toast } from 'react-toastify';

export const toastSuccess = (alertText: string) => {
  toast.success(`${alertText}`, {
    position: 'top-right',
    autoClose: 2000,
  });
  return;
};

export const toastWarn = (alertText: string) => {
  toast.warn(`${alertText}`, {
    position: 'top-right',
    autoClose: 2000,
  });
  return;
};

export const toastError = (alertText: string) => {
  toast.error(`${alertText}`, {
    position: 'top-right',
    autoClose: 2000,
  });
  return;
};

export const toastInfo = (alertText: string) => {
  toast.info(`${alertText}`, {
    position: 'top-right',
    autoClose: 2000,
  });
  return;
};

export const toastAlert = (alertText: string) => {
  toast(`${alertText}`, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Flip,
  });
};
