import React from 'react';

// Base skeleton component with shimmer animation
const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-slate-200 rounded animate-pulse ${className}`}></div>
);

// Profile Header Skeleton
export const ProfileHeaderSkeleton: React.FC = () => (
  <div className="flex items-center gap-3">
    <Skeleton className="w-16 h-16 rounded-full" />
    <div className="flex-1">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-5 w-32" />
    </div>
  </div>
);

// Log Entry Card Skeleton
export const LogEntrySkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-4 mb-3">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <div className="flex flex-wrap gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
  </div>
);

// Log List Skeleton (multiple entries)
export const LogListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-32 rounded-lg" />
    </div>
    {Array.from({ length: count }).map((_, i) => (
      <LogEntrySkeleton key={i} />
    ))}
  </div>
);

// Statistics Card Skeleton
export const StatsCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
    <Skeleton className="h-6 w-48 mb-4" />
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-6 w-12" />
      </div>
    </div>
  </div>
);

// WHO Guidelines Skeleton
export const WHOGuidelinesSkeleton: React.FC = () => (
  <div>
    <Skeleton className="h-10 w-64 mb-6" />
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm p-6">
          <Skeleton className="h-6 w-48 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      ))}
    </div>
  </div>
);

// Development Guide Skeleton
export const DevelopmentGuideSkeleton: React.FC = () => (
  <div>
    <Skeleton className="h-10 w-56 mb-6" />
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Percentile Chart Skeleton
export const PercentileChartSkeleton: React.FC = () => (
  <div>
    <Skeleton className="h-10 w-64 mb-6" />
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

// Measurement Card Skeleton
export const MeasurementCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div>
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div>
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div>
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  </div>
);

// Reminder Card Skeleton
export const ReminderCardSkeleton: React.FC = () => (
  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-4 rounded-lg shadow-md mb-3">
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-5 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="w-8 h-8 rounded-lg" />
    </div>
  </div>
);

// Main App Loading Skeleton (Full Page)
export const AppLoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-slate-50 font-sans">
    {/* Header Skeleton */}
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <ProfileHeaderSkeleton />
          <Skeleton className="w-12 h-12 rounded-lg" />
        </div>
      </div>
    </header>

    {/* Reminders Section Skeleton */}
    <div className="container mx-auto px-4 pt-4 space-y-3">
      <ReminderCardSkeleton />
      <ReminderCardSkeleton />
    </div>

    {/* Daily Milk Intake Skeleton */}
    <div className="container mx-auto px-4 pt-4">
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-xl p-6 mb-4">
        <Skeleton className="h-6 w-64 mb-4 bg-white/20" />
        <Skeleton className="h-16 w-48 mb-4 bg-white/20" />
        <Skeleton className="h-3 w-full rounded-full bg-white/20" />
      </div>
    </div>

    {/* Next Feeding Skeleton */}
    <div className="container mx-auto px-4">
      <div className="bg-gradient-to-br from-teal-500 to-green-500 text-white rounded-2xl shadow-xl p-6">
        <Skeleton className="h-6 w-48 mb-3 bg-white/20" />
        <Skeleton className="h-8 w-32 bg-white/20" />
      </div>
    </div>

    {/* Main Content Skeleton */}
    <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
      <div className="lg:col-span-2">
        <LogListSkeleton count={6} />
      </div>
    </main>
  </div>
);

// Component Loading Skeleton (for modals/views)
export const ComponentLoadingSkeleton: React.FC<{ type?: 'stats' | 'who' | 'development' | 'percentiles' | 'ai' }> = ({ type = 'stats' }) => {
  switch (type) {
    case 'who':
      return <WHOGuidelinesSkeleton />;
    case 'development':
      return <DevelopmentGuideSkeleton />;
    case 'percentiles':
      return <PercentileChartSkeleton />;
    case 'ai':
      return (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case 'stats':
    default:
      return (
        <div>
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="space-y-4">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>
        </div>
      );
  }
};

export default Skeleton;

