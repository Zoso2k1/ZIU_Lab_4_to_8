import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

// Funkcja, która przyjmuje inną funkcję (callback) i przekazuje jej wyniki
export function reportWebVitals(onPerfEntry?: (metric: Metric) => void) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
    onINP(onPerfEntry);
  }
}