
import React, { useMemo } from 'react';
import type { LogEntry } from '../types';

interface LogListProps {
  entries: LogEntry[];
  onDeleteEntry: (id: string) => void;
  onEditEntry: (entry: LogEntry) => void;
}

const ActivityIcon: React.FC<{ icon: string; label: string; value?: string | number; color: string; enabled: boolean }> = ({ icon, label, value, color, enabled }) => {
    if (!enabled) return null;
    return (
        <div className={`flex items-center text-sm ${color}`}>
            <i className={`fas ${icon} w-5 text-center`}></i>
            <span className="ml-1.5 font-medium">{label}{value && `: ${value}`}</span>
        </div>
    );
};

const LogList: React.FC<LogListProps> = ({ entries, onDeleteEntry, onEditEntry }) => {
    const groupedEntries = useMemo(() => {
        return entries.reduce((acc, entry) => {
            const date = entry.dateTime.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(entry);
            return acc;
        }, {} as Record<string, LogEntry[]>);
    }, [entries]);

    const sortedDates = useMemo(() => {
        return Object.keys(groupedEntries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    }, [groupedEntries]);

    if (entries.length === 0) {
        return (
            <div className="bg-white p-8 text-center rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-2 text-slate-700">Zatiaľ žiadne záznamy</h2>
                <p className="text-slate-500">Použite formulár na pridanie prvého záznamu.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {sortedDates.map(date => (
                <div key={date}>
                    <h2 className="text-lg font-bold text-slate-600 pb-2 mb-4 border-b-2 border-slate-200">{date}</h2>
                    <div className="space-y-3">
                        {groupedEntries[date].map(entry => (
                             <div key={entry.id} className="bg-white rounded-xl shadow-md p-4 transition-shadow hover:shadow-lg relative group">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="font-bold text-teal-600 text-lg">
                                            {entry.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 mt-3">
                                            <ActivityIcon icon="fa-poo" label="Stolica" color="text-yellow-700" enabled={entry.poop} />
                                            <ActivityIcon icon="fa-tint" label="Moč" color="text-blue-500" enabled={entry.pee} />
                                            <ActivityIcon icon="fa-heart" label="Dojčenie" color="text-pink-500" enabled={entry.breastfed} />
                                            <ActivityIcon icon="fa-bottle-droplet" label="Materské mlieko" value={`${entry.breastMilkMl}ml`} color="text-purple-500" enabled={entry.breastMilkMl > 0} />
                                            <ActivityIcon icon="fa-prescription-bottle" label="Umelé mlieko" value={`${entry.formulaMl}ml`} color="text-green-600" enabled={entry.formulaMl > 0} />
                                            <ActivityIcon icon="fa-triangle-exclamation" label="Vracanie" color="text-red-500" enabled={entry.vomit} />
                                            <ActivityIcon icon="fa-sun" label="Vitamín D" color="text-orange-500" enabled={entry.vitaminD} />
                                            <ActivityIcon icon="fa-baby" label="Tummy Time" color="text-indigo-500" enabled={entry.tummyTime} />
                                            <ActivityIcon icon="fa-flask" label="Sterilizácia" color="text-cyan-500" enabled={entry.sterilization} />
                                            <ActivityIcon icon="fa-bath" label="Kúpanie" color="text-blue-500" enabled={entry.bathing} />
                                        </div>
                                        {entry.notes && (
                                            <p className="text-slate-600 text-sm mt-3 bg-slate-100 p-2 rounded-md">
                                                <i className="fas fa-note-sticky mr-2 text-slate-400"></i>
                                                {entry.notes}
                                            </p>
                                        )}
                                    </div>
                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEditEntry(entry)}
                                            className="text-slate-400 hover:text-teal-500"
                                            aria-label="Upraviť záznam"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => onDeleteEntry(entry.id)}
                                            className="text-slate-400 hover:text-red-500"
                                            aria-label="Vymazať záznam"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LogList;
