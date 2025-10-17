import { describe, it, expect } from 'vitest';
import {
  sleepSessionToDB,
  dbToSleepSession,
  type SleepSessionDB
} from '../../supabaseClient';
import type { SleepSession } from '../../types';

describe('Sleep Tracking', () => {
  describe('SleepSession conversions', () => {
    it('should convert SleepSession to database format with end time', () => {
      const session: SleepSession = {
        id: 'sleep-id',
        babyProfileId: 'profile-id',
        startTime: new Date('2025-10-17T08:00:00Z'),
        endTime: new Date('2025-10-17T10:30:00Z'),
        durationMinutes: 150,
        notes: 'Good sleep',
        createdAt: new Date('2025-10-17T10:30:00Z'),
        updatedAt: new Date('2025-10-17T10:30:00Z'),
      };

      const dbSession = sleepSessionToDB(session);

      expect(dbSession.id).toBe('sleep-id');
      expect(dbSession.baby_profile_id).toBe('profile-id');
      expect(dbSession.start_time).toBe('2025-10-17T08:00:00.000Z');
      expect(dbSession.end_time).toBe('2025-10-17T10:30:00.000Z');
      expect(dbSession.duration_minutes).toBe(150);
      expect(dbSession.notes).toBe('Good sleep');
    });

    it('should convert ongoing SleepSession without end time', () => {
      const session: SleepSession = {
        id: 'sleep-id',
        babyProfileId: 'profile-id',
        startTime: new Date('2025-10-17T08:00:00Z'),
        endTime: null,
        durationMinutes: null,
        notes: '',
        createdAt: new Date('2025-10-17T08:00:00Z'),
        updatedAt: new Date('2025-10-17T08:00:00Z'),
      };

      const dbSession = sleepSessionToDB(session);

      expect(dbSession.end_time).toBeNull();
      expect(dbSession.duration_minutes).toBeNull();
      expect(dbSession.notes).toBe('');
    });

    it('should convert database format to SleepSession', () => {
      const dbSession: SleepSessionDB = {
        id: 'sleep-id',
        baby_profile_id: 'profile-id',
        start_time: '2025-10-17T08:00:00Z',
        end_time: '2025-10-17T10:30:00Z',
        duration_minutes: 150,
        notes: 'Good sleep',
        created_at: '2025-10-17T10:30:00Z',
        updated_at: '2025-10-17T10:30:00Z',
      };

      const session = dbToSleepSession(dbSession);

      expect(session.id).toBe('sleep-id');
      expect(session.babyProfileId).toBe('profile-id');
      expect(session.startTime).toBeInstanceOf(Date);
      expect(session.endTime).toBeInstanceOf(Date);
      expect(session.durationMinutes).toBe(150);
      expect(session.notes).toBe('Good sleep');
    });

    it('should handle null end_time from database', () => {
      const dbSession: SleepSessionDB = {
        id: 'sleep-id',
        baby_profile_id: 'profile-id',
        start_time: '2025-10-17T08:00:00Z',
        end_time: null,
        duration_minutes: null,
        notes: '',
        created_at: '2025-10-17T08:00:00Z',
        updated_at: '2025-10-17T08:00:00Z',
      };

      const session = dbToSleepSession(dbSession);

      expect(session.endTime).toBeNull();
      expect(session.durationMinutes).toBeNull();
    });
  });

  describe('Sleep duration calculations', () => {
    it('should calculate sleep duration in minutes', () => {
      const startTime = new Date('2025-10-17T08:00:00Z');
      const endTime = new Date('2025-10-17T10:30:00Z');

      const durationMs = endTime.getTime() - startTime.getTime();
      const durationMinutes = Math.floor(durationMs / 60000);

      expect(durationMinutes).toBe(150);
    });

    it('should handle short naps', () => {
      const startTime = new Date('2025-10-17T08:00:00Z');
      const endTime = new Date('2025-10-17T08:15:00Z');

      const durationMs = endTime.getTime() - startTime.getTime();
      const durationMinutes = Math.floor(durationMs / 60000);

      expect(durationMinutes).toBe(15);
    });

    it('should handle long sleep sessions', () => {
      const startTime = new Date('2025-10-17T20:00:00Z');
      const endTime = new Date('2025-10-18T06:00:00Z'); // 10 hours

      const durationMs = endTime.getTime() - startTime.getTime();
      const durationMinutes = Math.floor(durationMs / 60000);

      expect(durationMinutes).toBe(600);
    });
  });

  describe('Sleep statistics', () => {
    const createSleepSession = (durationMinutes: number): SleepSession => ({
      id: `sleep-${durationMinutes}`,
      babyProfileId: 'profile-id',
      startTime: new Date(),
      endTime: new Date(),
      durationMinutes,
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    it('should calculate total sleep time', () => {
      const sessions: SleepSession[] = [
        createSleepSession(120), // 2 hours
        createSleepSession(90),  // 1.5 hours
        createSleepSession(150), // 2.5 hours
      ];

      const totalMinutes = sessions.reduce(
        (sum, s) => sum + (s.durationMinutes || 0),
        0
      );

      expect(totalMinutes).toBe(360); // 6 hours
    });

    it('should calculate average sleep duration', () => {
      const sessions: SleepSession[] = [
        createSleepSession(60),
        createSleepSession(90),
        createSleepSession(120),
      ];

      const totalMinutes = sessions.reduce(
        (sum, s) => sum + (s.durationMinutes || 0),
        0
      );
      const avgMinutes = totalMinutes / sessions.length;

      expect(avgMinutes).toBe(90);
    });

    it('should find longest sleep session', () => {
      const sessions: SleepSession[] = [
        createSleepSession(60),
        createSleepSession(180), // Longest
        createSleepSession(120),
      ];

      const longestMinutes = Math.max(
        ...sessions.map(s => s.durationMinutes || 0)
      );

      expect(longestMinutes).toBe(180);
    });

    it('should handle empty sleep sessions', () => {
      const sessions: SleepSession[] = [];

      const totalMinutes = sessions.reduce(
        (sum, s) => sum + (s.durationMinutes || 0),
        0
      );

      expect(totalMinutes).toBe(0);
    });

    it('should filter out ongoing sleep sessions', () => {
      const sessions: SleepSession[] = [
        createSleepSession(120),
        { ...createSleepSession(0), endTime: null, durationMinutes: null }, // Ongoing
        createSleepSession(90),
      ];

      const completedSessions = sessions.filter(s => s.endTime !== null);
      const totalMinutes = completedSessions.reduce(
        (sum, s) => sum + (s.durationMinutes || 0),
        0
      );

      expect(completedSessions.length).toBe(2);
      expect(totalMinutes).toBe(210);
    });

    it('should format sleep duration as hours and minutes', () => {
      const totalMinutes = 150; // 2h 30m

      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;

      expect(hours).toBe(2);
      expect(mins).toBe(30);
    });
  });
});

