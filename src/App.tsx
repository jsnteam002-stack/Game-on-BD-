import React, { useState, useEffect } from 'react';
import { store } from './store/state';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/ToastContainer';
import { NotificationsModal } from './components/NotificationsModal';
import { FaucetModal } from './components/FaucetModal';

// Views
import { HomeView } from './views/HomeView';
import { GamesView } from './views/GamesView';
import { BonusView } from './views/BonusView';
import { LeaderboardView } from './views/LeaderboardView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';

// Games
import { WesternSlotGame } from './games/WesternSlotGame';
import { AviatorCrashGame } from './games/AviatorCrashGame';
import { LiveRouletteGame } from './games/LiveRouletteGame';
import { GoldenDiceGame } from './games/GoldenDiceGame';
import { RoyalCardsGame } from './games/RoyalCardsGame';
import { LuckyWheelGame } from './games/LuckyWheelGame';

export const App: React.FC = () => {
  const [, setTick] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [faucetModalOpen, setFaucetModalOpen] = useState(false);

  useEffect(() => {
    return store.subscribe(() => setTick((t) => t + 1));
  }, []);

  const currentView = store.getCurrentView();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'games':
        return <GamesView />;
      case 'bonus':
      case 'daily':
        return <BonusView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminView />;
      case 'slot':
        return <WesternSlotGame />;
      case 'crash':
        return <AviatorCrashGame />;
      case 'roulette':
        return <LiveRouletteGame />;
      case 'dice':
        return <GoldenDiceGame />;
      case 'cards':
        return <RoyalCardsGame />;
      case 'wheel':
        return <LuckyWheelGame />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFF2CC] flex flex-col font-mono pb-20 md:pb-6 selection:bg-[#8B1717] selection:text-[#FFF2CC]">
      
      {/* Toast Notifications Overlay */}
      <ToastContainer />

      {/* Top Navigation Header */}
      <Header
        onOpenSidebar={() => setSidebarOpen(true)}
        onOpenNotifications={() => setNotifModalOpen(true)}
        onOpenFaucetModal={() => setFaucetModalOpen(true)}
      />

      {/* Drawer Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Modals */}
      <NotificationsModal isOpen={notifModalOpen} onClose={() => setNotifModalOpen(false)} />
      <FaucetModal isOpen={faucetModalOpen} onClose={() => setFaucetModalOpen(false)} />

      {/* Main View Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-2 sm:py-4">
        {renderCurrentView()}
      </main>

      {/* Mobile & Desktop Fixed Bottom Navigation Bar (HOME, GAMES, BONUS, RANKS, PROFILE) */}
      <BottomNav />

    </div>
  );
};

export default App;
