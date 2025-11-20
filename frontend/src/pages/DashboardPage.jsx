import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import PopularSessionsSection from '../components/dashboard/PopularSessionsSection';
import CalendarSection from '../components/dashboard/CalendarSection';
import RightSidebar from '../components/dashboard/RightSidebar';
import { useDashboardPage } from '../logic/dashboard/DashboardPage.logic';
import { reminders } from '../utils/dashboardData';
import '../styles/dashboard/DashboardPage.css';

const DashboardPage = () => {
  const {
    activeSessionTab,
    setActiveSessionTab,
    activeNotesTab,
    setActiveNotesTab,
    currentMonth,
    goToPreviousMonth,
    goToNextMonth,
    notes,
    notesLoading,
    notesError
  } = useDashboardPage();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn">
        <PopularSessionsSection />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CalendarSection
            activeTab={activeSessionTab}
            onTabChange={setActiveSessionTab}
            currentMonth={currentMonth}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
          />

          <RightSidebar
            reminders={reminders}
            activeNotesTab={activeNotesTab}
            onNotesTabChange={setActiveNotesTab}
            notes={notes}
            notesLoading={notesLoading}
            notesError={notesError}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
