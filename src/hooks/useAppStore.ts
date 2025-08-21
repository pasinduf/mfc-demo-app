import { useContext } from 'react';
import AppContext from '../context/AppContext';

export const useAppStore = () => {
  return useContext(AppContext);
};
