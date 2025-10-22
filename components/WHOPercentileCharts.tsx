import React, { useState, useMemo } from 'react';
import type { BabyProfile, Measurement } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getWHOData, calculatePercentile } from '../whoData';

interface WHOPercentileChartsProps {
  babyProfile: BabyProfile;
  measurements: Measurement[];
}

type MetricType = 'weight' | 'length' | 'headCircumference';

const WHOPercentileCharts: React.FC<WHOPercentileChartsProps> = ({ babyProfile, measurements }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('weight');
  const [showSexModal, setShowSexModal] = useState(false);
  const [babySex, setBabySex] = useState<'male' | 'female'>(() => {
    const saved = localStorage.getItem('babySex');
    return (saved as 'male' | 'female') || 'male';
  });

  const calculateAgeInMonths = (date: Date) => {
    const birthDate = babyProfile.birthDate;
    const diffTime = date.getTime() - birthDate.getTime();
    const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44); // average month length
    return Math.max(0, Math.min(24, diffMonths));
  };

  const currentAgeMonths = calculateAgeInMonths(new Date());

  // Prepare chart data
  const chartData = useMemo(() => {
    const whoData = getWHOData(selectedMetric, babySex);
    
    return whoData.map(point => {
      const dataPoint: any = {
        month: point.month,
        P3: point.p3,
        P15: point.p15,
        P50: point.p50,
        P85: point.p85,
        P97: point.p97,
      };

      // Add baby's measurements
      const babyMeasurements = measurements
        .filter(m => {
          const ageMonths = calculateAgeInMonths(m.measuredAt);
          return Math.abs(ageMonths - point.month) < 0.5;
        })
        .map(m => {
          if (selectedMetric === 'weight') return m.weightGrams / 1000; // convert to kg
          if (selectedMetric === 'length') return m.heightCm;
          return m.headCircumferenceCm;
        })
        .filter(v => v > 0);

      if (babyMeasurements.length > 0) {
        dataPoint.baby = babyMeasurements[babyMeasurements.length - 1];
      }

      return dataPoint;
    });
  }, [selectedMetric, babySex, measurements, babyProfile]);

  // Get latest measurement and calculate percentile
  const latestMeasurement = useMemo(() => {
    const validMeasurements = measurements.filter(m => {
      if (selectedMetric === 'weight') return m.weightGrams > 0;
      if (selectedMetric === 'length') return m.heightCm > 0;
      return m.headCircumferenceCm > 0;
    });

    if (validMeasurements.length === 0) return null;

    const latest = validMeasurements.sort((a, b) => b.measuredAt.getTime() - a.measuredAt.getTime())[0];
    const ageMonths = calculateAgeInMonths(latest.measuredAt);
    
    let value: number;
    if (selectedMetric === 'weight') value = latest.weightGrams / 1000;
    else if (selectedMetric === 'length') value = latest.heightCm;
    else value = latest.headCircumferenceCm;

    const percentile = calculatePercentile(value, ageMonths, selectedMetric, babySex);

    return {
      measurement: latest,
      value,
      ageMonths,
      percentile,
    };
  }, [measurements, selectedMetric, babySex, babyProfile]);

  // Get unit and label
  const getMetricInfo = () => {
    switch (selectedMetric) {
      case 'weight':
        return { label: 'Váha', unit: 'kg', icon: 'fa-weight' };
      case 'length':
        return { label: 'Výška/Dĺžka', unit: 'cm', icon: 'fa-ruler-vertical' };
      case 'headCircumference':
        return { label: 'Obvod hlavy', unit: 'cm', icon: 'fa-head-side-brain' };
    }
  };

  const metricInfo = getMetricInfo();

  const handleSexChange = (sex: 'male' | 'female') => {
    setBabySex(sex);
    localStorage.setItem('babySex', sex);
    setShowSexModal(false);
  };

  const getPercentileColor = (percentile: number | null) => {
    if (!percentile) return 'text-slate-600';
    if (percentile < 3 || percentile > 97) return 'text-red-600';
    if (percentile < 15 || percentile > 85) return 'text-amber-600';
    return 'text-green-600';
  };

  const getPercentileMessage = (percentile: number | null) => {
    if (!percentile) return '';
    if (percentile < 3) return '⚠️ Pod normálom - konzultujte s lekárom';
    if (percentile > 97) return '⚠️ Nad normálom - konzultujte s lekárom';
    if (percentile < 15) return 'Mierne pod priemerom';
    if (percentile > 85) return 'Mierne nad priemerom';
    return '✅ V norme';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          <i className="fas fa-chart-line mr-3 text-blue-500"></i>
          WHO Percentilové grafy
        </h2>
        <button
          onClick={() => setShowSexModal(true)}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm font-medium text-slate-700"
        >
          <i className={`fas ${babySex === 'male' ? 'fa-mars text-blue-500' : 'fa-venus text-pink-500'} mr-2`}></i>
          {babySex === 'male' ? 'Chlapec' : 'Dievča'}
        </button>
      </div>

      {/* Sex Selection Modal */}
      {showSexModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Pohlavie dieťaťa</h3>
            <p className="text-sm text-slate-600 mb-6">
              WHO percentily sa líšia pre chlapcov a dievčatá. Vyberte pohlavie vášho dieťaťa:
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleSexChange('male')}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  babySex === 'male'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <i className="fas fa-mars text-3xl text-blue-500 mb-2"></i>
                <p className="font-semibold">Chlapec</p>
              </button>
              <button
                onClick={() => handleSexChange('female')}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  babySex === 'female'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-slate-200 hover:border-pink-300'
                }`}
              >
                <i className="fas fa-venus text-3xl text-pink-500 mb-2"></i>
                <p className="font-semibold">Dievča</p>
              </button>
            </div>
            <button
              onClick={() => setShowSexModal(false)}
              className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700"
            >
              Zrušiť
            </button>
          </div>
        </div>
      )}

      {/* Metric Selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setSelectedMetric('weight')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedMetric === 'weight'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <i className="fas fa-weight mr-2"></i>
          Váha
        </button>
        <button
          onClick={() => setSelectedMetric('length')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedMetric === 'length'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <i className="fas fa-ruler-vertical mr-2"></i>
          Výška/Dĺžka
        </button>
        <button
          onClick={() => setSelectedMetric('headCircumference')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedMetric === 'headCircumference'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <i className="fas fa-head-side-brain mr-2"></i>
          Obvod hlavy
        </button>
      </div>

      {/* Current Status Card */}
      {latestMeasurement && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-slate-800">
              <i className={`fas ${metricInfo.icon} mr-2 text-blue-500`}></i>
              Aktuálny stav - {metricInfo.label}
            </h3>
            <span className="text-xs text-slate-600">
              {latestMeasurement.measurement.measuredAt.toLocaleDateString('sk-SK')}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Hodnota</p>
              <p className="text-2xl font-bold text-slate-800">
                {latestMeasurement.value.toFixed(selectedMetric === 'weight' ? 2 : 1)} {metricInfo.unit}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Vek</p>
              <p className="text-2xl font-bold text-slate-800">
                {latestMeasurement.ageMonths.toFixed(1)} mes.
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Percentil</p>
              <p className={`text-2xl font-bold ${getPercentileColor(latestMeasurement.percentile)}`}>
                {latestMeasurement.percentile?.toFixed(0)}. percentil
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Hodnotenie</p>
              <p className={`text-sm font-semibold ${getPercentileColor(latestMeasurement.percentile)}`}>
                {getPercentileMessage(latestMeasurement.percentile)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-slate-50 rounded-xl p-4">
        <h3 className="text-md font-bold text-slate-700 mb-4">
          {metricInfo.label} podľa veku (WHO štandardy)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              label={{ value: 'Vek (mesiace)', position: 'insideBottom', offset: -5 }}
              stroke="#64748b"
            />
            <YAxis 
              label={{ value: `${metricInfo.label} (${metricInfo.unit})`, angle: -90, position: 'insideLeft' }}
              stroke="#64748b"
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px' }}
              labelFormatter={(value) => `Vek: ${value} mesiacov`}
            />
            <Legend />
            
            {/* WHO Percentile Lines */}
            <Line type="monotone" dataKey="P3" stroke="#ef4444" strokeWidth={1} dot={false} name="3. percentil" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="P15" stroke="#f59e0b" strokeWidth={1} dot={false} name="15. percentil" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="P50" stroke="#10b981" strokeWidth={2} dot={false} name="50. percentil (medián)" />
            <Line type="monotone" dataKey="P85" stroke="#f59e0b" strokeWidth={1} dot={false} name="85. percentil" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="P97" stroke="#ef4444" strokeWidth={1} dot={false} name="97. percentil" strokeDasharray="5 5" />
            
            {/* Baby's measurements */}
            <Line type="monotone" dataKey="baby" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} name={babyProfile.name} />
            
            {/* Current age line */}
            <ReferenceLine x={Math.round(currentAgeMonths)} stroke="#6366f1" strokeWidth={2} strokeDasharray="3 3" label={{ value: 'Teraz', position: 'top' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-800 mb-2">
          <i className="fas fa-info-circle mr-2"></i>
          Informácie o percentiloch
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li><strong>50. percentil (medián):</strong> Priemerná hodnota - 50% detí je nad touto hodnotou a 50% pod ňou</li>
          <li><strong>3.-97. percentil:</strong> Normálne rozpätie - 94% zdravých detí spadá do tejto zóny</li>
          <li><strong>Pod 3. percentil alebo nad 97. percentil:</strong> Odporúčame konzultáciu s lekárom</li>
          <li><strong>15.-85. percentil:</strong> Najbežnejšie hodnoty</li>
        </ul>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-red-500" style={{ borderTop: '2px dashed' }}></div>
          <span className="text-slate-600">3. a 97. percentil</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-amber-500" style={{ borderTop: '2px dashed' }}></div>
          <span className="text-slate-600">15. a 85. percentil</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-green-500"></div>
          <span className="text-slate-600">50. percentil (medián)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-blue-500"></div>
          <span className="text-slate-600">{babyProfile.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-indigo-500" style={{ borderTop: '2px dashed' }}></div>
          <span className="text-slate-600">Aktuálny vek</span>
        </div>
      </div>

      {/* Measurements History */}
      {measurements.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-slate-800 mb-3">
            <i className="fas fa-history mr-2 text-slate-600"></i>
            História meraní
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-2 text-left text-slate-700">Dátum</th>
                  <th className="px-4 py-2 text-left text-slate-700">Vek</th>
                  <th className="px-4 py-2 text-left text-slate-700">Váha (kg)</th>
                  <th className="px-4 py-2 text-left text-slate-700">Výška (cm)</th>
                  <th className="px-4 py-2 text-left text-slate-700">Obvod hlavy (cm)</th>
                </tr>
              </thead>
              <tbody>
                {measurements
                  .sort((a, b) => b.measuredAt.getTime() - a.measuredAt.getTime())
                  .slice(0, 10)
                  .map((m) => {
                    const ageMonths = calculateAgeInMonths(m.measuredAt);
                    return (
                      <tr key={m.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-2">{m.measuredAt.toLocaleDateString('sk-SK')}</td>
                        <td className="px-4 py-2">{ageMonths.toFixed(1)} mes.</td>
                        <td className="px-4 py-2">{m.weightGrams > 0 ? (m.weightGrams / 1000).toFixed(2) : '-'}</td>
                        <td className="px-4 py-2">{m.heightCm > 0 ? m.heightCm.toFixed(1) : '-'}</td>
                        <td className="px-4 py-2">{m.headCircumferenceCm > 0 ? m.headCircumferenceCm.toFixed(1) : '-'}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default WHOPercentileCharts;

