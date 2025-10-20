
import React, { useMemo } from 'react';
import type { LogEntry, SleepSession } from '../types';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface StatisticsProps {
  entries: LogEntry[];
  sleepSessions: SleepSession[];
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

const Statistics: React.FC<StatisticsProps> = ({ entries, sleepSessions }) => {
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

    // Filter sleep sessions
    const todaySleeps = sleepSessions.filter(s => {
      const sleepDate = new Date(s.startTime);
      return sleepDate >= today && s.endTime !== null;
    });

    const weekSleeps = sleepSessions.filter(s => {
      const sleepDate = new Date(s.startTime);
      return sleepDate >= weekAgo && s.endTime !== null;
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
      { name: 'Materské', value: totalBreastMilk, color: '#a855f7' },
      { name: 'Umelé', value: totalFormula, color: '#16a34a' },
    ].filter(item => item.value > 0);

    // Calculate sleep statistics
    const calculateSleepStats = (sleeps: SleepSession[]) => {
      const totalMinutes = sleeps.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
      const count = sleeps.length;
      const avgMinutes = count > 0 ? totalMinutes / count : 0;
      const longestMinutes = sleeps.length > 0 
        ? Math.max(...sleeps.map(s => s.durationMinutes || 0))
        : 0;
      
      return {
        totalMinutes,
        count,
        avgMinutes,
        longestMinutes,
        totalHours: Math.floor(totalMinutes / 60),
        totalMins: totalMinutes % 60,
        avgHours: Math.floor(avgMinutes / 60),
        avgMins: Math.floor(avgMinutes % 60),
        longestHours: Math.floor(longestMinutes / 60),
        longestMins: longestMinutes % 60,
      };
    };

    const todaySleepStats = calculateSleepStats(todaySleeps);
    const weekSleepStats = calculateSleepStats(weekSleeps);

    // Calculate daily feeding statistics (last 30 days)
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = new Map<string, { totalMl: number; breastfedCount: number }>();
    
    entries.forEach(entry => {
      const entryDate = new Date(entry.dateTime);
      if (entryDate >= thirtyDaysAgo) {
        const dateKey = entryDate.toLocaleDateString('sk-SK');
        
        if (!dailyStats.has(dateKey)) {
          dailyStats.set(dateKey, { totalMl: 0, breastfedCount: 0 });
        }
        
        const dayData = dailyStats.get(dateKey)!;
        dayData.totalMl += entry.breastMilkMl + entry.formulaMl;
        if (entry.breastfed) {
          dayData.breastfedCount += 1;
        }
      }
    });

    // Convert to array and sort by date (newest first)
    const dailyStatsArray = Array.from(dailyStats.entries())
      .map(([date, data]) => ({
        date,
        totalMl: data.totalMl,
        breastfedCount: data.breastfedCount,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date.split('.').reverse().join('-'));
        const dateB = new Date(b.date.split('.').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      });

    return {
      today: todayStats,
      week: weekStats,
      avgIntervalHours,
      avgIntervalMinutes,
      timeSinceLastFeeding,
      lastFeeding,
      chartData,
      pieData,
      todaySleep: todaySleepStats,
      weekSleep: weekSleepStats,
      dailyStatsArray,
    };
  }, [entries, sleepSessions]);

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
      {/* Daily Feeding Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white p-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-table"></i>
            Denný prehľad kŕmenia
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-200">
                <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Dátum</th>
                <th className="px-6 py-3 text-center text-sm font-bold text-slate-700">Celkom mlieka (ml)</th>
                <th className="px-6 py-3 text-center text-sm font-bold text-slate-700">Počet dojčení</th>
              </tr>
            </thead>
            <tbody>
              {stats.dailyStatsArray.length > 0 ? (
                stats.dailyStatsArray.map((day, index) => (
                  <tr 
                    key={day.date}
                    className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                      index === 0 ? 'bg-teal-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium flex items-center gap-2">
                      {index === 0 && <i className="fas fa-star text-teal-500"></i>}
                      {day.date}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-bold text-blue-600">
                        {day.totalMl}
                      </span>
                      <span className="text-sm text-slate-500 ml-1">ml</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-bold text-teal-600">
                        {day.breastfedCount}
                      </span>
                      <span className="text-sm text-slate-500 ml-1">×</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    <i className="fas fa-info-circle mr-2"></i>
                    Zatiaľ nie sú k dispozícii žiadne údaje
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
            label="Dojčenie" 
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

      {/* Sleep Stats - Today */}
      <div>
        <h3 className="text-lg font-bold text-slate-700 mb-3 flex items-center">
          <i className="fas fa-moon mr-2 text-indigo-500"></i>
          Spánok dnes
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <StatCard 
            icon="fa-bed" 
            label="Celkový spánok" 
            value={stats.todaySleep.count > 0 ? `${stats.todaySleep.totalHours}h ${stats.todaySleep.totalMins}m` : '-'}
            color="text-indigo-500"
          />
          <StatCard 
            icon="fa-moon" 
            label="Počet spánkov" 
            value={stats.todaySleep.count}
            color="text-blue-500"
          />
          <StatCard 
            icon="fa-clock" 
            label="Priemerné trvanie" 
            value={stats.todaySleep.count > 0 ? `${stats.todaySleep.avgHours}h ${stats.todaySleep.avgMins}m` : '-'}
            color="text-purple-500"
          />
          <StatCard 
            icon="fa-crown" 
            label="Najdlhší spánok" 
            value={stats.todaySleep.longestMinutes > 0 ? `${stats.todaySleep.longestHours}h ${stats.todaySleep.longestMins}m` : '-'}
            color="text-amber-500"
          />
        </div>
      </div>

      {/* Sleep Stats - Week */}
      <div>
        <h3 className="text-lg font-bold text-slate-700 mb-3 flex items-center">
          <i className="fas fa-calendar-week mr-2 text-indigo-500"></i>
          Spánok za týždeň
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <StatCard 
            icon="fa-bed" 
            label="Celkový spánok" 
            value={stats.weekSleep.count > 0 ? `${stats.weekSleep.totalHours}h ${stats.weekSleep.totalMins}m` : '-'}
            subtitle={stats.weekSleep.count > 0 ? `${(stats.weekSleep.totalMinutes / 7 / 60).toFixed(1)}h / deň` : undefined}
            color="text-indigo-500"
          />
          <StatCard 
            icon="fa-moon" 
            label="Počet spánkov" 
            value={stats.weekSleep.count}
            subtitle={stats.weekSleep.count > 0 ? `${(stats.weekSleep.count / 7).toFixed(1)} / deň` : undefined}
            color="text-blue-500"
          />
          <StatCard 
            icon="fa-clock" 
            label="Priemerné trvanie" 
            value={stats.weekSleep.count > 0 ? `${stats.weekSleep.avgHours}h ${stats.weekSleep.avgMins}m` : '-'}
            color="text-purple-500"
          />
          <StatCard 
            icon="fa-crown" 
            label="Najdlhší spánok" 
            value={stats.weekSleep.longestMinutes > 0 ? `${stats.weekSleep.longestHours}h ${stats.weekSleep.longestMins}m` : '-'}
            color="text-amber-500"
          />
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

