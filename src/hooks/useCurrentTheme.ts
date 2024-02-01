import { useTheme } from 'next-themes';

export const useCurrentTheme = () => {
  const { theme } = useTheme();
  const baple = theme === 'baple' ? true : false;
  return { baple };
};
