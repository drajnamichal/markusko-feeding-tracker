
import React, { useMemo } from 'react';
import type { LogEntry } from '../types';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

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

interface ChartData {
  date: string;
  materské: number;
  umelé: number;
  stolica: number;
  moč: number;
  dojčené: number;
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

    // Generate chart data for last 7 days
    const chartData: ChartData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayEntries = entries.filter(e => {
        const entryDate = new Date(e.dateTime);
        return entryDate >= date && entryDate < nextDate;
      });

      const materské = dayEntries.reduce((sum, e) => sum + e.breastMilkMl, 0);
      const umelé = dayEntries.reduce((sum, e) => sum + e.formulaMl, 0);
      const stolica = dayEntries.filter(e => e.poop).length;
      const moč = dayEntries.filter(e => e.pee).length;
      const dojčené = dayEntries.filter(e => e.breastfed).length;

      chartData.push({
        date: `${date.getDate()}.${date.getMonth() + 1}`,
        materské,
        umelé,
        stolica,
        moč,
        dojčené,
      });
    }

    // Pie chart data for milk distribution
    const totalBreastMilk = weekEntries.reduce((sum, e) => sum + e.breastMilkMl, 0);
    const totalFormula = weekEntries.reduce((sum, e) => sum + e.formulaMl, 0);
    
    const pieData = [
      { name: 'Materské mlieko', value: totalBreastMilk, color: '#a855f7' },
      { name: 'Umelé mlieko', value: totalFormula, color: '#16a34a' },
    ].filter(item => item.value > 0);

    return {
      today: todayStats,
      week: weekStats,
      avgIntervalHours,
      avgIntervalMinutes,
      timeSinceLastFeeding,
      lastFeeding,
      chartData,
      pieData
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

      {/* Feeding Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center">
          <i className="fas fa-chart-line mr-2 text-teal-500"></i>
          Kŕmenie za posledných 7 dní (ml)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={stats.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="materské" stackId="1" stroke="#a855f7" fill="#a855f7" name="Materské mlieko" />
            <Area type="monotone" dataKey="umelé" stackId="1" stroke="#16a34a" fill="#16a34a" name="Umelé mlieko" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Diapers Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center">
          <i className="fas fa-chart-bar mr-2 text-teal-500"></i>
          Plienky za posledných 7 dní
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="stolica" fill="#ca8a04" name="Stolica" />
            <Bar dataKey="moč" fill="#60a5fa" name="Moč" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Split view: Pie Chart + Breastfed Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Milk Distribution Pie Chart */}
        {stats.pieData.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center">
              <i className="fas fa-chart-pie mr-2 text-teal-500"></i>
              Rozdelenie mlieka (týždeň)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} ml`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Breastfed Sessions Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center">
            <i className="fas fa-heart mr-2 text-pink-500"></i>
            Dojčenie za 7 dní
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="dojčené" stroke="#ec4899" strokeWidth={2} name="Počet dojčení" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

