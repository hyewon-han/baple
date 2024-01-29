import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { Switch } from '@nextui-org/react';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'baple') {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, []);
  const themeToggleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setTheme('baple');
    } else {
      setTheme('color_blind');
    }
  };
  if (!mounted) return null;

  return (
    <Switch
      // defaultSelected
      isSelected={isSelected}
      onValueChange={setIsSelected}
      onChange={themeToggleHandler}
    />
  );
};

export default ThemeSwitcher;
