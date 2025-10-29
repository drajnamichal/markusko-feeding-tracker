import { describe, it, expect } from 'vitest';
import type { DoctorVisit } from '../../types';
import { doctorVisitToDB, dbToDoctorVisit, type DoctorVisitDB } from '../../supabaseClient';

describe('Doctor Visits', () => {
  describe('Data Conversion', () => {
    it('should convert DoctorVisit to database format', () => {
      const visit: DoctorVisit = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        babyProfileId: '123e4567-e89b-12d3-a456-426614174001',
        visitDate: new Date('2025-11-15'),
        visitTime: '14:30',
        doctorType: 'Pediater',
        doctorName: 'MUDr. Test',
        location: 'Test Clinic',
        notes: 'Bring vaccination card',
        completed: false,
        createdAt: new Date('2025-10-29T20:00:00Z'),
        updatedAt: new Date('2025-10-29T20:00:00Z'),
      };

      const dbVisit = doctorVisitToDB(visit);

      expect(dbVisit).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        baby_profile_id: '123e4567-e89b-12d3-a456-426614174001',
        visit_date: '2025-11-15',
        visit_time: '14:30',
        doctor_type: 'Pediater',
        doctor_name: 'MUDr. Test',
        location: 'Test Clinic',
        notes: 'Bring vaccination card',
        completed: false,
      });
    });

    it('should handle empty optional fields when converting to DB', () => {
      const visit: DoctorVisit = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        babyProfileId: '123e4567-e89b-12d3-a456-426614174001',
        visitDate: new Date('2025-11-15'),
        visitTime: '14:30',
        doctorType: 'Pediater',
        doctorName: '',
        location: '',
        notes: '',
        completed: false,
        createdAt: new Date('2025-10-29T20:00:00Z'),
        updatedAt: new Date('2025-10-29T20:00:00Z'),
      };

      const dbVisit = doctorVisitToDB(visit);

      expect(dbVisit.doctor_name).toBe('');
      expect(dbVisit.location).toBe('');
      expect(dbVisit.notes).toBe('');
    });

    it('should convert database format to DoctorVisit', () => {
      const dbVisit: DoctorVisitDB = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        baby_profile_id: '123e4567-e89b-12d3-a456-426614174001',
        visit_date: '2025-11-15',
        visit_time: '14:30',
        doctor_type: 'Pediater',
        doctor_name: 'MUDr. Test',
        location: 'Test Clinic',
        notes: 'Bring vaccination card',
        completed: false,
        created_at: '2025-10-29T20:00:00Z',
        updated_at: '2025-10-29T20:00:00Z',
      };

      const visit = dbToDoctorVisit(dbVisit);

      expect(visit.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(visit.babyProfileId).toBe('123e4567-e89b-12d3-a456-426614174001');
      expect(visit.visitDate).toBeInstanceOf(Date);
      expect(visit.visitDate.toISOString().split('T')[0]).toBe('2025-11-15');
      expect(visit.visitTime).toBe('14:30');
      expect(visit.doctorType).toBe('Pediater');
      expect(visit.doctorName).toBe('MUDr. Test');
      expect(visit.location).toBe('Test Clinic');
      expect(visit.notes).toBe('Bring vaccination card');
      expect(visit.completed).toBe(false);
      expect(visit.createdAt).toBeInstanceOf(Date);
      expect(visit.updatedAt).toBeInstanceOf(Date);
    });

    it('should correctly handle date conversion', () => {
      const dbVisit: DoctorVisitDB = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        baby_profile_id: '123e4567-e89b-12d3-a456-426614174001',
        visit_date: '2025-12-25',
        visit_time: '09:00',
        doctor_type: 'Pediater',
        doctor_name: '',
        location: '',
        notes: '',
        completed: false,
        created_at: '2025-10-29T20:00:00Z',
        updated_at: '2025-10-29T20:00:00Z',
      };

      const visit = dbToDoctorVisit(dbVisit);
      
      expect(visit.visitDate.getFullYear()).toBe(2025);
      expect(visit.visitDate.getMonth()).toBe(11); // December is month 11 (0-indexed)
      expect(visit.visitDate.getDate()).toBe(25);
    });
  });

  describe('Visit Sorting', () => {
    it('should sort visits by date and time in ascending order', () => {
      const visits: DoctorVisit[] = [
        {
          id: '1',
          babyProfileId: 'baby1',
          visitDate: new Date('2025-11-20T00:00:00'),
          visitTime: '14:00',
          doctorType: 'Pediater',
          doctorName: '',
          location: '',
          notes: '',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          babyProfileId: 'baby1',
          visitDate: new Date('2025-11-15T00:00:00'),
          visitTime: '10:00',
          doctorType: 'Dentist',
          doctorName: '',
          location: '',
          notes: '',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          babyProfileId: 'baby1',
          visitDate: new Date('2025-11-15T00:00:00'),
          visitTime: '14:00',
          doctorType: 'ORL',
          doctorName: '',
          location: '',
          notes: '',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const sorted = visits.sort((a, b) => {
        const dateTimeA = new Date(a.visitDate.toISOString().split('T')[0] + 'T' + a.visitTime).getTime();
        const dateTimeB = new Date(b.visitDate.toISOString().split('T')[0] + 'T' + b.visitTime).getTime();
        return dateTimeA - dateTimeB;
      });

      expect(sorted[0].visitTime).toBe('10:00'); // Nov 15, 10:00
      expect(sorted[0].doctorType).toBe('Dentist');
      expect(sorted[1].visitTime).toBe('14:00'); // Nov 15, 14:00
      expect(sorted[1].doctorType).toBe('ORL');
      expect(sorted[2].visitTime).toBe('14:00'); // Nov 20, 14:00
      expect(sorted[2].doctorType).toBe('Pediater');
    });
  });

  describe('Visit Filtering', () => {
    it('should filter upcoming visits correctly', () => {
      const visits: DoctorVisit[] = [
        {
          id: '1',
          babyProfileId: 'baby1',
          visitDate: new Date('2025-11-20'),
          visitTime: '14:00',
          doctorType: 'Pediater',
          doctorName: '',
          location: '',
          notes: '',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          babyProfileId: 'baby1',
          visitDate: new Date('2025-11-15'),
          visitTime: '10:00',
          doctorType: 'Dentist',
          doctorName: '',
          location: '',
          notes: '',
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const upcoming = visits.filter(v => !v.completed);
      const completed = visits.filter(v => v.completed);

      expect(upcoming.length).toBe(1);
      expect(upcoming[0].doctorType).toBe('Pediater');
      expect(completed.length).toBe(1);
      expect(completed[0].doctorType).toBe('Dentist');
    });

    it('should filter visits by baby profile ID', () => {
      const visits: DoctorVisit[] = [
        {
          id: '1',
          babyProfileId: 'baby1',
          visitDate: new Date('2025-11-20'),
          visitTime: '14:00',
          doctorType: 'Pediater',
          doctorName: '',
          location: '',
          notes: '',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          babyProfileId: 'baby2',
          visitDate: new Date('2025-11-15'),
          visitTime: '10:00',
          doctorType: 'Dentist',
          doctorName: '',
          location: '',
          notes: '',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const baby1Visits = visits.filter(v => v.babyProfileId === 'baby1');
      const baby2Visits = visits.filter(v => v.babyProfileId === 'baby2');

      expect(baby1Visits.length).toBe(1);
      expect(baby1Visits[0].doctorType).toBe('Pediater');
      expect(baby2Visits.length).toBe(1);
      expect(baby2Visits[0].doctorType).toBe('Dentist');
    });
  });

  describe('Google Calendar Export Data', () => {
    it('should format date correctly for Google Calendar', () => {
      const visitDate = new Date('2025-11-15T00:00:00Z');
      const visitTime = '14:30';
      
      const [hours, minutes] = visitTime.split(':');
      const startDateTime = new Date(visitDate);
      startDateTime.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setUTCHours(startDateTime.getUTCHours() + 1);

      const formatDateForGoogle = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      const start = formatDateForGoogle(startDateTime);
      const end = formatDateForGoogle(endDateTime);

      // Google Calendar format: YYYYMMDDTHHmmssZ
      expect(start).toMatch(/^\d{8}T\d{6}Z$/);
      expect(end).toMatch(/^\d{8}T\d{6}Z$/);
      expect(start).toBe('20251115T143000Z');
      expect(end).toBe('20251115T153000Z');
    });

    it('should create valid Google Calendar URL parameters', () => {
      const visit: DoctorVisit = {
        id: '1',
        babyProfileId: 'baby1',
        visitDate: new Date('2025-11-15'),
        visitTime: '14:30',
        doctorType: 'Pediater',
        doctorName: 'MUDr. Test',
        location: 'Test Clinic, Bratislava',
        notes: 'Bring vaccination card',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const title = `${visit.doctorType}${visit.doctorName ? ` - ${visit.doctorName}` : ''}`;
      const description = visit.notes || '';
      const location = visit.location || '';

      expect(title).toBe('Pediater - MUDr. Test');
      expect(description).toBe('Bring vaccination card');
      expect(location).toBe('Test Clinic, Bratislava');
    });
  });

  describe('Validation', () => {
    it('should require mandatory fields', () => {
      const visitData = {
        visitDate: new Date('2025-11-15'),
        visitTime: '14:30',
        doctorType: 'Pediater',
        doctorName: '',
        location: '',
        notes: '',
        completed: false,
      };

      // All mandatory fields present
      expect(visitData.visitDate).toBeInstanceOf(Date);
      expect(visitData.visitTime).toBeTruthy();
      expect(visitData.doctorType).toBeTruthy();
    });

    it('should allow optional fields to be empty', () => {
      const visitData = {
        visitDate: new Date('2025-11-15'),
        visitTime: '14:30',
        doctorType: 'Pediater',
        doctorName: '',
        location: '',
        notes: '',
        completed: false,
      };

      expect(visitData.doctorName).toBe('');
      expect(visitData.location).toBe('');
      expect(visitData.notes).toBe('');
      // Should not throw error
    });

    it('should validate time format HH:MM', () => {
      const validTimes = ['09:00', '14:30', '23:59', '00:00'];
      const invalidTimes = ['9:00', '14:5', '25:00', '12:60', 'abc'];

      validTimes.forEach(time => {
        expect(time).toMatch(/^\d{2}:\d{2}$/);
      });

      invalidTimes.forEach(time => {
        if (time.match(/^\d{2}:\d{2}$/)) {
          const [hours, minutes] = time.split(':').map(Number);
          expect(hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60).toBe(false);
        }
      });
    });
  });

  describe('Date Comparison', () => {
    it('should correctly combine date and time for comparison', () => {
      const visit1 = {
        visitDate: new Date('2025-11-15T00:00:00'),
        visitTime: '10:00',
      };

      const visit2 = {
        visitDate: new Date('2025-11-15T00:00:00'),
        visitTime: '14:00',
      };

      const visit3 = {
        visitDate: new Date('2025-11-16T00:00:00'),
        visitTime: '09:00',
      };

      const datetime1 = new Date(visit1.visitDate.toISOString().split('T')[0] + 'T' + visit1.visitTime).getTime();
      const datetime2 = new Date(visit2.visitDate.toISOString().split('T')[0] + 'T' + visit2.visitTime).getTime();
      const datetime3 = new Date(visit3.visitDate.toISOString().split('T')[0] + 'T' + visit3.visitTime).getTime();

      expect(datetime1).toBeLessThan(datetime2);
      expect(datetime2).toBeLessThan(datetime3);
    });
  });

  describe('Completed Status Toggle', () => {
    it('should toggle completed status', () => {
      const visit: DoctorVisit = {
        id: '1',
        babyProfileId: 'baby1',
        visitDate: new Date('2025-11-15'),
        visitTime: '14:30',
        doctorType: 'Pediater',
        doctorName: '',
        location: '',
        notes: '',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(visit.completed).toBe(false);
      
      visit.completed = true;
      expect(visit.completed).toBe(true);
      
      visit.completed = false;
      expect(visit.completed).toBe(false);
    });

    it('should move visit between upcoming and completed lists', () => {
      const visits: DoctorVisit[] = [
        {
          id: '1',
          babyProfileId: 'baby1',
          visitDate: new Date('2025-11-15'),
          visitTime: '14:30',
          doctorType: 'Pediater',
          doctorName: '',
          location: '',
          notes: '',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      let upcoming = visits.filter(v => !v.completed);
      let completed = visits.filter(v => v.completed);

      expect(upcoming.length).toBe(1);
      expect(completed.length).toBe(0);

      // Toggle completed
      visits[0].completed = true;

      upcoming = visits.filter(v => !v.completed);
      completed = visits.filter(v => v.completed);

      expect(upcoming.length).toBe(0);
      expect(completed.length).toBe(1);
    });
  });
});

