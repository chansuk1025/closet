import React from 'react';
import { UserProfile } from '../types';
import { Sparkles, Plus, User } from 'lucide-react';

interface HeaderProps {
  activeTab: 'closet' | 'shopping' | 'coordinator' | 'mypage';
  setActiveTab: (tab: 'closet' | 'shopping' | 'coordinator' | 'mypage') => void;
  user: UserProfile | null;
  onOpenAddModal: () => void;
  onOpenAuthModal: () => void;
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAddModal,
  onOpenAuthModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#EAE3D7] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Title */}
        <button
          onClick={() => setActiveTab('closet')}
          className="text-left cursor-pointer focus:outline-none flex items-center gap-2"
        >
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#2C241E] lowercase">
            closet
          </span>
        </button>

        {/* Navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('closet')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'closet'
                ? 'bg-[#3B2F25] text-white shadow-xs'
                : 'text-[#6E6053] hover:text-[#2C241E] hover:bg-[#F5F2EB]'
            }`}
          >
            스마트 옷장
          </button>
          <button
            onClick={() => setActiveTab('shopping')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'shopping'
                ? 'bg-[#3B2F25] text-white shadow-xs'
                : 'text-[#6E6053] hover:text-[#2C241E] hover:bg-[#F5F2EB]'
            }`}
          >
            스마트 쇼핑
          </button>
          <button
            onClick={() => setActiveTab('coordinator')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'coordinator'
                ? 'bg-[#3B2F25] text-white shadow-xs'
                : 'text-[#6E6053] hover:text-[#2C241E] hover:bg-[#F5F2EB]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C49A58]" />
            코디네이터
          </button>
          <button
            onClick={() => setActiveTab('mypage')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'mypage'
                ? 'bg-[#3B2F25] text-white shadow-xs'
                : 'text-[#6E6053] hover:text-[#2C241E] hover:bg-[#F5F2EB]'
            }`}
          >
            마이페이지
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#3B2F25] hover:bg-[#281F17] rounded-xl transition-colors shadow-xs whitespace-nowrap"
            title="새 옷 등록"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">새 옷 등록</span>
          </button>

          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#4A3B2F] bg-[#F2ECE2] hover:bg-[#EAE2D5] rounded-xl transition-colors border border-[#DDD3C5] whitespace-nowrap"
          >
            <User className="w-3.5 h-3.5 text-[#7A6B5D]" />
            <span className="max-w-[70px] sm:max-w-[90px] truncate">
              {user ? user.name : '로그인'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
