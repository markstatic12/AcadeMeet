import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { SessionsSection } from '../components/sessions/Sessions';
import { CalendarSection } from '../components/dashboard/SessionActivity';
import HeroCarousel from '../components/dashboard/HeroCarousel';
import { useDashboardPage } from '../services/DashboardLogic';
import '../styles/dashboard/DashboardPage.css';

const DashboardPage = () => {
  const {
    activeSessionTab,
    setActiveSessionTab,
    currentMonth,
    goToPreviousMonth,
    goToNextMonth,
  } = useDashboardPage();

  return (
    <DashboardLayout>
      <div className="h-full flex gap-6 p-6">
        {/* Center Stage - Hero Zone (Widest Column) */}
        <div className="flex-[2] flex flex-col gap-6">
          {/* Active Session Card - Visually Striking */}
          <div className="flex-shrink-0">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-indigo-700/90 backdrop-blur-xl border border-indigo-400/30 shadow-2xl shadow-indigo-500/40 p-8">
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
              
              {/* Hero Carousel Content */}
              <div className="relative z-10">
                <HeroCarousel />
              </div>
            </div>
          </div>

          {/* Trending Sessions - Horizontal Carousel */}
          <div className="flex-1 min-h-0">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4 relative z-20">
                <h2 className="text-xl font-bold text-white">Trending Sessions</h2>
              </div>
                
                {/* Horizontal Carousel with Arrow Navigation */}
                <div className="flex-1 min-h-0 relative group">
                  {/* Left Arrow Button */}
                  <button
                    onClick={() => {
                      const container = document.getElementById('trending-carousel');
                      if (container) container.scrollBy({ left: -400, behavior: 'smooth' });
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-gray-900/95 hover:bg-gray-800/95 border border-gray-600/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Carousel Container */}
                  <div
                    id="trending-carousel"
                    className="h-full overflow-x-auto scrollbar-hide scroll-smooth py-2 px-2 -mx-2 -my-2"
                  >
                    <div className="h-full flex gap-4">
                      <SessionsSection />
                    </div>
                  </div>

                  {/* Right Arrow Button */}
                  <button
                    onClick={() => {
                      const container = document.getElementById('trending-carousel');
                      if (container) container.scrollBy({ left: 400, behavior: 'smooth' });
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-gray-900/95 hover:bg-gray-800/95 border border-gray-600/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

        {/* Right Rail - Context Zone (Narrower Column) */}
        <div className="flex-1 flex flex-col gap-6">
          <CalendarSection
            activeTab={activeSessionTab}
            onTabChange={setActiveSessionTab}
            currentMonth={currentMonth}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
