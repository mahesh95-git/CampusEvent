import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement, incrementByAmount } from './store/slices/counter';
import { useEffect } from 'react';
import Home from './pages/Home';
export default function App() {
  const value = useSelector((state) => state.counter.value);
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();

  // checking the theme and applying it to the root element
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      // window matchMeadi is used to check the system theme
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<div className="flex h-screen items-center justify-center text-2xl font-bold">404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}
