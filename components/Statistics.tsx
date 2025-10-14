
import React, { useMemo } from 'react';
import type { LogEntry } from '../types';

interface StatisticsProps {
  entries: LogEntry[];
}

interface DayStats {
  date: string;
  totalFeedings: number;
  totalMl: number;
  poopCount: number;
  peeCount: number;
  vomitCount: number;
  breastfedCount: number;
}

const Statistics: React.FC<StatisticsProps> = ({ entries }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const todayEntries = entries.filter(e => {
      const entryDate = new Date(e.dateTime);
      return entryDate >= today;
    });

    const weekEntries = entries.filter(e => {
      const entryDate = new Date(e.dateTime);
      return entryDate >= weekAgo;
    });

    const calculateStats = (entries: LogEntry[]) => {
      const totalMl = entries.reduce((sum, e) => sum + e.breastMilkMl + e.formulaMl, 0);
      const totalFeedings = entries.filter(e => e.breastfed || e.breastMilkMl > 0 || e.formulaMl > 0).length;
      const poopCount = entries.filter(e => e.poop).length;
      const peeCount = entries.filter(e => e.pee).length;
      const vomitCount = entries.filter(e => e.vomit).length;
      const breastfedCount = entries.filter(e => e.breastfed).length;
      
      return { totalMl, totalFeedings, poopCount, peeCount, vomitCount, breastfedCount };
    };

    const todayStats = calculateStats(todayEntries);
    const weekStats = calculateStats(weekEntries);

    // Calculate average feeding interval for today
    const feedingTimes = todayEntries
      .filter(e => e.breastfed || e.breastMilkMl > 0 || e.formulaMl > 0)
      .map(e => e.dateTime.getTime())
      .sort((a, b) => a - b);

    let avgInterval = 0;
    if (feedingTimes.length > 1) {
      const intervals = [];
      for (let i = 1; i < feedingTimes.length; i++) {
        intervals.push(feedingTimes[i] - feedingTimes[i - 1]);
      }
      avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
    }

    const avgIntervalHours = Math.floor(avgInterval / (1000 * 60 * 60));
    const avgIntervalMinutes = Math.floor((avgInterval % (1000 * 60 * 60)) / (1000 * 60));

    // Last feeding time
    const lastFeeding = entries
      .filter(e => e.breastfed || e.breastMilkMl > 0 || e.formulaMl > 0)
      .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime())[0];

    let timeSinceLastFeeding = '';
    if (lastFeeding) {
      const diff = now.getTime() - lastFeeding.dateTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      timeSinceLastFeeding = `${hours}h ${minutes}m`;
    }

    return {
      today: todayStats,
      week: weekStats,
      avgIntervalHours,
      avgIntervalMinutes,
      timeSinceLastFeeding,
      lastFeeding
    };
  }, [entries]);

  const StatCard: React.FC<{ icon: string; label: string; value: string | number; color: string; subtitle?: string }> = 
    ({ icon, label, value, color, subtitle }) => (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className={`text-2xl ${color}`}>
            <i className={`fas ${icon}`}></i>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-700">{value}</p>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
        </div>
        <p className="text-sm text-slate-600 font-medium">{label}</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Last Feeding Alert */}
      {stats.lastFeeding && (
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Posledné kŕmenie</p>
              <p className="text-3xl font-bold">{stats.timeSinceLastFeeding}</p>
              <p className="text-sm opacity-90 mt-1">
                {stats.lastFeeding.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="text-5xl opacity-80">
              <i className="fas fa-clock"></i>
            </div>
          </div>
        </div>
      )}

      {/* Today's Stats */}
      <div>
        <h3 className="text-lg font-bold text-slate-700 mb-3 flex items-center">
          <i className="fas fa-calendar-day mr-2 text-teal-500"></i>
          Dnes
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <StatCard 
            icon="fa-bottle-baby" 
            label="Kŕmenia" 
            value={stats.today.totalFeedings}
            color="text-teal-500"
          />
          <StatCard 
            icon="fa-droplet" 
            label="Celkom ml" 
            value={stats.today.totalMl}
            color="text-blue-500"
          />
          <StatCard 
            icon="fa-heart" 
            label="Dojčené" 
            value={stats.today.breastfedCount}
            color="text-pink-500"
          />
          <StatCard 
            icon="fa-clock" 
            label="Priemer interval" 
            value={stats.avgIntervalHours > 0 || stats.avgIntervalMinutes > 0 ? `${stats.avgIntervalHours}h ${stats.avgIntervalMinutes}m` : '-'}
            color="text-purple-500"
          />
          <StatCard 
            icon="fa-poo" 
            label="Stolica" 
            value={stats.today.poopCount}
            color="text-yellow-700"
          />
          <StatCard 
            icon="fa-tint" 
            label="Moč" 
            value={stats.today.peeCount}
            color="text-blue-400"
          />
        </div>
      </div>

      {/* Week Stats */}
      <div>
        <h3 className="text-lg font-bold text-slate-700 mb-3 flex items-center">
          <i className="fas fa-calendar-week mr-2 text-teal-500"></i>
          Posledných 7 dní
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <StatCard 
            icon="fa-bottle-baby" 
            label="Kŕmenia" 
            value={stats.week.totalFeedings}
            subtitle={`${(stats.week.totalFeedings / 7).toFixed(1)} / deň`}
            color="text-teal-500"
          />
          <StatCard 
            icon="fa-droplet" 
            label="Celkom ml" 
            value={stats.week.totalMl}
            subtitle={`${(stats.week.totalMl / 7).toFixed(0)} / deň`}
            color="text-blue-500"
          />
          <StatCard 
            icon="fa-poo" 
            label="Stolica" 
            value={stats.week.poopCount}
            subtitle={`${(stats.week.poopCount / 7).toFixed(1)} / deň`}
            color="text-yellow-700"
          />
          <StatCard 
            icon="fa-tint" 
            label="Moč" 
            value={stats.week.peeCount}
            subtitle={`${(stats.week.peeCount / 7).toFixed(1)} / deň`}
            color="text-blue-400"
          />
          {stats.week.vomitCount > 0 && (
            <StatCard 
              icon="fa-triangle-exclamation" 
              label="Vracanie" 
              value={stats.week.vomitCount}
              color="text-red-500"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;

