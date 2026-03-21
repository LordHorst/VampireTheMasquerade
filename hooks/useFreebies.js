// src/hooks/useFreebies.js
import { useState, useCallback } from 'react';

export const useFreebies = (initialPoints = 0, costMap = {}) => {
  const [freebiePoints, setFreebiePoints] = useState(initialPoints);
  const [freebiesActive, setFreebiesActive] = useState(false);

  const getCost = useCallback((category, currentValue, newValue) => {
    const increase = newValue - currentValue;
    if (increase <= 0) return 0;
    const costPerDot = costMap[category] || 0;
    return increase * costPerDot;
  }, [costMap]);

  const canAfford = useCallback((category, currentValue, newValue) => {
    if (!freebiesActive) return false;
    const cost = getCost(category, currentValue, newValue);
    return cost <= freebiePoints;
  }, [freebiesActive, freebiePoints, getCost]);

  const spend = useCallback((category, currentValue, newValue) => {
    const cost = getCost(category, currentValue, newValue);
    if (cost > 0 && freebiesActive) {
      setFreebiePoints(prev => prev - cost);
      return true;
    }
    return false;
  }, [freebiesActive, getCost]);

  const reset = useCallback((newPoints = initialPoints) => {
    setFreebiePoints(newPoints);
    setFreebiesActive(false);
  }, [initialPoints]);

  return {
    freebiePoints,
    freebiesActive,
    setFreebiesActive,
    getCost,
    canAfford,
    spend,
    reset,
  };
};