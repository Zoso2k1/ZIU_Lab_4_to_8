import fs from 'fs';
import csv from 'csv-parser';

const results = [];
let totalSessions = 0;
let totalBounces = 0;
let totalConversions = 0;
let totalDuration = 0;
let totalLCP = 0;

// Czytanie pliku CSV
fs.createReadStream('sessions_lab12.csv')
  .pipe(csv())
  .on('data', (data) => {
    results.push(data);
    totalSessions++;
    
    if (data.bounce === 'true') totalBounces++;
    if (data.converted === 'true') totalConversions++;
    totalDuration += parseFloat(data.duration_sec || 0);
    totalLCP += parseFloat(data.lcp_ms || 0);
  })
  .on('end', () => {
    console.log('--- RAPORT ANALITYCZNY (LAB 12) ---');
    console.log(`Liczba wszystkich sesji: ${totalSessions}`);
    
    // Współczynnik odrzuceń (Bounce Rate) - % sesji, gdzie bounce = true
    const bounceRate = ((totalBounces / totalSessions) * 100).toFixed(2);
    console.log(`Współczynnik odrzuceń (Bounce Rate): ${bounceRate}%`);
    
    // Współczynnik konwersji - % sesji, gdzie converted = true
    const conversionRate = ((totalConversions / totalSessions) * 100).toFixed(2);
    console.log(`Współczynnik konwersji: ${conversionRate}%`);
    
    // Średni czas trwania sesji
    const avgDuration = (totalDuration / totalSessions).toFixed(2);
    console.log(`Średni czas trwania sesji: ${avgDuration} sekund`);

    // Średni czas LCP
    const avgLCP = (totalLCP / totalSessions).toFixed(2);
    console.log(`Średni czas LCP: ${avgLCP} ms`);
  });