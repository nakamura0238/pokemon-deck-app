import { useEffect, useState } from "react";

export const useDeviceSize = () => {
  const breakpoint = 800;
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return width < breakpoint;
};