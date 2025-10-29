import React, { useState } from 'react';
import type { DoctorVisit } from '../types';

interface DoctorVisitsProps {
  visits: DoctorVisit[];
  onAddVisit: (visit: Omit<DoctorVisit, 'id' | 'babyProfileId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdateVisit: (visit: DoctorVisit) => Promise<void>;
  onDeleteVisit: (id: string) => Promise<void>;
  onToggleCompleted: (id: string, completed: boolean) => Promise<void>;
}

type ButtonState = 'idle' | 'loading' | 'success';

const DoctorVisits: React.FC<DoctorVisitsProps> = ({
  visits,
  onAddVisit,
  onUpdateVisit,
  onDeleteVisit,
  onToggleCompleted,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVisit, setEditingVisit] = useState<DoctorVisit | null>(null);
  const [saveButtonState, setSaveButtonState] = useState<ButtonState>('idle');

  // Form state
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [doctorType, setDoctorType] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const doctorTypes = [
    'Pediater',
    'Očný lekár',
    'Zubný lekár',
    'Dermatológ',
    'ORL',
    'Kardiológ',
    'Neurológ',
    'Ortopéd',
    'Chirurg',
    'Iný špecialista'
  ];

  const resetForm = () => {
    setVisitDate('');
    setVisitTime('');
    setDoctorType('');
    setDoctorName('');
    setLocation('');
    setNotes('');
    setEditingVisit(null);
    setShowAddForm(false);
  };

  const handleEdit = (visit: DoctorVisit) => {
    setEditingVisit(visit);
    setVisitDate(visit.visitDate.toISOString().split('T')[0]);
    setVisitTime(visit.visitTime);
    setDoctorType(visit.doctorType);
    setDoctorName(visit.doctorName);
    setLocation(visit.location);
    setNotes(visit.notes);
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveButtonState('loading');

    try {
      if (editingVisit) {
        await onUpdateVisit({
          ...editingVisit,
          visitDate: new Date(visitDate),
          visitTime,
          doctorType,
          doctorName,
          location,
          notes,
        });
      } else {
        await onAddVisit({
          visitDate: new Date(visitDate),
          visitTime,
          doctorType,
          doctorName,
          location,
          notes,
          completed: false,
        });
      }

      setSaveButtonState('success');
      setTimeout(() => {
        setSaveButtonState('idle');
        resetForm();
      }, 1500);
    } catch (error) {
      console.error('Error saving visit:', error);
      setSaveButtonState('idle');
    }
  };

  const exportToGoogleCalendar = (visit: DoctorVisit) => {
    const [hours, minutes] = visit.visitTime.split(':');
    const startDateTime = new Date(visit.visitDate);
    startDateTime.setHours(parseInt(hours), parseInt(minutes));
    
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + 1);

    const formatDateForGoogle = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const title = `${visit.doctorType}${visit.doctorName ? ` - ${visit.doctorName}` : ''}`;
    const description = visit.notes || '';
    const locationText = visit.location || '';

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(title)}` +
      `&dates=${formatDateForGoogle(startDateTime)}/${formatDateForGoogle(endDateTime)}` +
      `&details=${encodeURIComponent(description)}` +
      `&location=${encodeURIComponent(locationText)}`;

    window.open(googleCalendarUrl, '_blank');
  };

  const upcomingVisits = visits
    .filter(v => !v.completed)
    .sort((a, b) => {
      const dateA = new Date(a.visitDate + 'T' + a.visitTime);
      const dateB = new Date(b.visitDate + 'T' + b.visitTime);
      return dateA.getTime() - dateB.getTime();
    });

  const completedVisits = visits
    .filter(v => v.completed)
    .sort((a, b) => {
      const dateA = new Date(a.visitDate + 'T' + a.visitTime);
      const dateB = new Date(b.visitDate + 'T' + b.visitTime);
      return dateB.getTime() - dateA.getTime();
    });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          <i className="fas fa-user-doctor mr-2 text-blue-500"></i>
          Návštevy lekárov
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-md"
        >
          <i className={`fas ${showAddForm ? 'fa-times' : 'fa-plus'} mr-2`}></i>
          {showAddForm ? 'Zavrieť' : 'Pridať návštevu'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            {editingVisit ? 'Upraviť návštevu' : 'Nová návšteva lekára'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  <i className="fas fa-calendar mr-2"></i>Dátum
                </label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  <i className="fas fa-clock mr-2"></i>Čas
                </label>
                <input
                  type="time"
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                <i className="fas fa-stethoscope mr-2"></i>Typ lekára
              </label>
              <select
                value={doctorType}
                onChange={(e) => setDoctorType(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Vyber typ lekára</option>
                {doctorTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                <i className="fas fa-user-md mr-2"></i>Meno lekára (voliteľné)
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="MUDr. Meno Priezvisko"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                <i className="fas fa-map-marker-alt mr-2"></i>Miesto (voliteľné)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Poliklinika, Ulica, Mesto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                <i className="fas fa-notes-medical mr-2"></i>Poznámky
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Čo doniesť, očkovanie, atď..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saveButtonState !== 'idle'}
                className={`
                  flex-1 text-white py-3 rounded-lg font-semibold transition-all
                  ${saveButtonState === 'loading' ? 'bg-slate-400 cursor-wait' : 
                    saveButtonState === 'success' ? 'bg-green-500' : 
                    'bg-blue-500 hover:bg-blue-600'}
                `}
              >
                {saveButtonState === 'loading' && (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Ukladám...
                  </>
                )}
                {saveButtonState === 'success' && (
                  <>
                    <i className="fas fa-check mr-2"></i>Uložené!
                  </>
                )}
                {saveButtonState === 'idle' && (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    {editingVisit ? 'Uložiť zmeny' : 'Pridať návštevu'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
              >
                Zrušiť
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upcoming Visits */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <i className="fas fa-calendar-check text-green-500"></i>
          Nadchádzajúce návštevy ({upcomingVisits.length})
        </h3>
        
        {upcomingVisits.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            <i className="fas fa-calendar-xmark text-4xl mb-2 block text-slate-300"></i>
            Žiadne nadchádzajúce návštevy
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingVisits.map((visit) => (
              <div
                key={visit.id}
                className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-calendar text-blue-500"></i>
                        <span className="font-semibold text-slate-700">
                          {formatDate(visit.visitDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fas fa-clock text-blue-500"></i>
                        <span className="font-semibold text-slate-700">
                          {visit.visitTime}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-lg font-bold text-slate-800 mb-1">
                      {visit.doctorType}
                      {visit.doctorName && <span className="text-slate-600"> - {visit.doctorName}</span>}
                    </div>
                    
                    {visit.location && (
                      <div className="text-sm text-slate-600 mb-2">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        {visit.location}
                      </div>
                    )}
                    
                    {visit.notes && (
                      <div className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg mt-2">
                        <i className="fas fa-notes-medical mr-2 text-blue-500"></i>
                        {visit.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => exportToGoogleCalendar(visit)}
                      className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap"
                      title="Pridať do Google Calendar"
                    >
                      <i className="fab fa-google mr-2"></i>
                      Calendar
                    </button>
                    <button
                      onClick={() => handleEdit(visit)}
                      className="px-3 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition-colors"
                      title="Upraviť"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => onToggleCompleted(visit.id, true)}
                      className="px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                      title="Označiť ako dokončené"
                    >
                      <i className="fas fa-check"></i>
                    </button>
                    <button
                      onClick={() => onDeleteVisit(visit.id)}
                      className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                      title="Vymazať"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Visits */}
      {completedVisits.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-check-circle text-green-500"></i>
            Dokončené návštevy ({completedVisits.length})
          </h3>
          
          <div className="space-y-3">
            {completedVisits.map((visit) => (
              <div
                key={visit.id}
                className="border border-slate-200 rounded-lg p-4 bg-slate-50 opacity-75"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-calendar text-slate-500"></i>
                        <span className="font-semibold text-slate-600">
                          {formatDate(visit.visitDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fas fa-clock text-slate-500"></i>
                        <span className="font-semibold text-slate-600">
                          {visit.visitTime}
                        </span>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                        <i className="fas fa-check mr-1"></i>Dokončené
                      </span>
                    </div>
                    
                    <div className="text-lg font-bold text-slate-700 mb-1">
                      {visit.doctorType}
                      {visit.doctorName && <span className="text-slate-500"> - {visit.doctorName}</span>}
                    </div>
                    
                    {visit.location && (
                      <div className="text-sm text-slate-500 mb-2">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        {visit.location}
                      </div>
                    )}
                    
                    {visit.notes && (
                      <div className="text-sm text-slate-600 bg-slate-100 p-3 rounded-lg mt-2">
                        <i className="fas fa-notes-medical mr-2 text-slate-500"></i>
                        {visit.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => onToggleCompleted(visit.id, false)}
                      className="px-3 py-2 bg-slate-400 text-white text-sm rounded-lg hover:bg-slate-500 transition-colors"
                      title="Označiť ako nedokončené"
                    >
                      <i className="fas fa-undo"></i>
                    </button>
                    <button
                      onClick={() => onDeleteVisit(visit.id)}
                      className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                      title="Vymazať"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorVisits;

