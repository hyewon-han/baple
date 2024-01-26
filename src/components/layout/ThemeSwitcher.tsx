import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { Switch } from '@nextui-org/react';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);
  const themeToggleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setTheme('baple');
    } else {
      setTheme('color_blind');
    }
  };
  if (!mounted) return null;

  return <Switch defaultSelected onChange={themeToggleHandler} />;
};

export default ThemeSwitcher;
