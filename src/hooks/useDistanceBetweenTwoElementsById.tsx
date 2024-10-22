import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const useDistanceYBetweenElementsById = (elementId1: string, elementId2: string) => {
  const [distance, setDistance] = useState(0);
  const location = useLocation();

  const getDistanceCb = useCallback(() => {
    const element1 = document.getElementById(elementId1);
    const element2 = document.getElementById(elementId2);

    if (!element1 || !element2) return 0;

    const element1Rect = element1.getBoundingClientRect();
    const element2Rect = element2.getBoundingClientRect();

    return element2Rect.y - element1Rect.y;
  }, [elementId1, elementId2]);

  useEffect(() => {
    setDistance(getDistanceCb());
  }, [getDistanceCb]);

  useEffect(() => {
    const resizeCb = () => {
      setDistance(getDistanceCb());
    };

    window.addEventListener("resize", resizeCb);

    return () => {
      window.removeEventListener("resize", resizeCb);
    };
  }, [getDistanceCb]);

  useEffect(() => {
    setDistance(getDistanceCb());
  }, [location.pathname, getDistanceCb]);

  return { distance };
};
