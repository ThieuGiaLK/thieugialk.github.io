import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ParsedData } from '../types';

interface XpChartProps {
  data: ParsedData;
  maxPlayerLevel: number;
  maxDinoLevel: number;
}

const XpChart: React.FC<XpChartProps> = ({ data, maxPlayerLevel, maxDinoLevel }) => {
  const chartData = useMemo(() => {
    // Determine the max index to show based on inputs
    const maxIndex = Math.max(maxPlayerLevel, maxDinoLevel);
    const result = [];
    
    for (let i = 0; i <= maxIndex; i++) {
      const playerItem = i <= maxPlayerLevel ? data.player[i] : null;
      const dinoItem = i <= maxDinoLevel ? data.dino[i] : null;

      if (playerItem || dinoItem) {
        result.push({
          level: i,
          playerXP: playerItem ? playerItem.xp : null,
          dinoXP: dinoItem ? dinoItem.xp : null,
        });
      }
    }
    return result;
  }, [data, maxPlayerLevel, maxDinoLevel]);

  return (
    <div className="w-full h-80 bg-slate-900 rounded-lg p-4 shadow-inner border border-slate-700">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="level" 
            stroke="#94a3b8" 
            label={{ value: 'Level', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }}
          />
          <YAxis 
            stroke="#94a3b8"
            tickFormatter={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
              return value;
            }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#e2e8f0' }}
            formatter={(value: number) => value.toLocaleString()}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="playerXP" 
            name="Player XP" 
            stroke="#3b82f6" 
            dot={false} 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="dinoXP" 
            name="Dino XP" 
            stroke="#22c55e" 
            dot={false} 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default XpChart;