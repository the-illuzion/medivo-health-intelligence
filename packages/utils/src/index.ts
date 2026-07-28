export function formatScore(score: number): string {
  return `${Math.round(score)}/100`;
}

export function formatDelta(delta: number): string {
  return delta >= 0 ? `+${delta}` : `${delta}`;
}

export function getScoreGrade(score: number): { grade: string; color: string } {
  if (score >= 85) return { grade: 'Optimal', color: '#059669' };
  if (score >= 70) return { grade: 'Good', color: '#0EA5E9' };
  if (score >= 50) return { grade: 'Moderate', color: '#D97706' };
  return { grade: 'Needs Attention', color: '#DC2626' };
}

export function calculateSparklinePoints(data: number[], width: number = 44, height: number = 18): string {
  if (!data || data.length === 0) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  return data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}
