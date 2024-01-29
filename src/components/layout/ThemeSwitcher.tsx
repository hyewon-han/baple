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
      setIsSelected(false);
    } else {
      setIsSelected(true);
    }
  }, []);
  const themeToggleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setTheme('color_blind');
    } else {
      setTheme('baple');
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
