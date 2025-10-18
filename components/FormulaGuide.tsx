import React from 'react';

interface FormulaGuideProps {
  currentWeight?: number; // in grams
}

const FormulaGuide: React.FC<FormulaGuideProps> = ({ currentWeight }) => {
  // Generate table data from 3.2kg to 5.0kg in 0.1kg increments
  const tableData = [];
  for (let weightKg = 3.2; weightKg <= 5.0; weightKg += 0.1) {
    const weight = Math.round(weightKg * 10) / 10; // Round to 1 decimal place
    const daily150 = Math.round(weight * 150);
    const daily180 = Math.round(weight * 180);
    const dose150 = Math.round(daily150 / 8);
    const dose180 = Math.round(daily180 / 8);

    tableData.push({
      weight,
      daily150,
      daily180,
      dose150,
      dose180,
    });
  }

  // Find the row matching current weight (if provided)
  const currentWeightKg = currentWeight ? currentWeight / 1000 : null;
  const highlightRow = (weight: number) => {
    if (!currentWeightKg) return false;
    return Math.abs(weight - currentWeightKg) < 0.05; // Within 50g
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <i className="fas fa-table text-pink-500"></i>
          Tabuľka dávkovania umelého mlieka
        </h2>
        <p className="text-slate-600 text-sm">
          Odporúčané dávkovanie pre novorodencov pri 8 dávkach denne
        </p>
        {currentWeight && (
          <div className="mt-3 p-3 bg-pink-50 rounded-lg border border-pink-200">
            <p className="text-sm text-pink-800">
              <i className="fas fa-info-circle mr-2"></i>
              Aktuálna váha dieťaťa: <span className="font-bold">{currentWeight}g ({(currentWeight / 1000).toFixed(1)}kg)</span>
            </p>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              <th className="px-4 py-3 text-left rounded-tl-lg">Hmotnosť dieťaťa</th>
              <th className="px-4 py-3 text-center">Denný príjem<br/>(150 ml/kg)</th>
              <th className="px-4 py-3 text-center">Denný príjem<br/>(180 ml/kg)</th>
              <th className="px-4 py-3 text-center">1 dávka<br/>(150 ml/kg)</th>
              <th className="px-4 py-3 text-center rounded-tr-lg">1 dávka<br/>(180 ml/kg)</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => {
              const isHighlighted = highlightRow(row.weight);
              return (
                <tr 
                  key={index} 
                  className={`border-b border-slate-200 transition-colors ${
                    isHighlighted 
                      ? 'bg-pink-100 font-bold text-pink-900' 
                      : index % 2 === 0 
                        ? 'bg-slate-50 hover:bg-slate-100' 
                        : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <td className="px-4 py-3 flex items-center gap-2">
                    {isHighlighted && <i className="fas fa-arrow-right text-pink-500"></i>}
                    {row.weight.toFixed(1)} kg
                  </td>
                  <td className="px-4 py-3 text-center">{row.daily150} ml</td>
                  <td className="px-4 py-3 text-center">{row.daily180} ml</td>
                  <td className="px-4 py-3 text-center">{row.dose150} ml</td>
                  <td className="px-4 py-3 text-center">{row.dose180} ml</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-slate-100 rounded-lg">
        <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
          <i className="fas fa-lightbulb text-amber-500"></i>
          Poznámky
        </h3>
        <ul className="text-sm text-slate-700 space-y-2">
          <li className="flex gap-2">
            <i className="fas fa-check text-green-500 mt-1"></i>
            <span>Tabuľka je odporúčaná pre novorodencov pri <strong>8 dávkach denne</strong></span>
          </li>
          <li className="flex gap-2">
            <i className="fas fa-check text-green-500 mt-1"></i>
            <span>Denný príjem sa pohybuje medzi <strong>150-180 ml na kg</strong> telesnej váhy</span>
          </li>
          <li className="flex gap-2">
            <i className="fas fa-check text-green-500 mt-1"></i>
            <span>Tieto hodnoty sú orientačné - vždy konzultujte s pediatrom</span>
          </li>
          <li className="flex gap-2">
            <i className="fas fa-check text-green-500 mt-1"></i>
            <span>Množstvo mlieka môže závisieť od individuálnych potrieb dieťaťa</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FormulaGuide;

