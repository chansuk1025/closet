import React from 'react';
import { UserProfile } from '../types';
import { Sparkles, Plus, ShoppingBag, User } from 'lucide-react';

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
  cartCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#E6DDCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand Title */}
        <button
          onClick={() => setActiveTab('closet')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#2D241E] group-hover:text-[#634832] transition-colors">
            ATELIER CLOSET
          </span>
        </button>

        {/* Zone 2: 4 clean text navigation links with active state */}
        <nav className="flex items-center gap-1 sm:gap-2 md:gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('closet')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              activeTab === 'closet'
                ? 'bg-[#382A21] text-[#FAF6F0] shadow-sm font-semibold'
                : 'text-[#5C4A3C] hover:text-[#2D241E] hover:bg-[#EFE8DC]'
            }`}
          >
            스마트 옷장
          </button>
          <button
            onClick={() => setActiveTab('shopping')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              activeTab === 'shopping'
                ? 'bg-[#382A21] text-[#FAF6F0] shadow-sm font-semibold'
                : 'text-[#5C4A3C] hover:text-[#2D241E] hover:bg-[#EFE8DC]'
            }`}
          >
            스마트 쇼핑
          </button>
          <button
            onClick={() => setActiveTab('coordinator')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'coordinator'
                ? 'bg-[#382A21] text-[#FAF6F0] shadow-sm font-semibold'
                : 'text-[#5C4A3C] hover:text-[#2D241E] hover:bg-[#EFE8DC]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B88746]" />
            패션 코디네이터
          </button>
          <button
            onClick={() => setActiveTab('mypage')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              activeTab === 'mypage'
                ? 'bg-[#382A21] text-[#FAF6F0] shadow-sm font-semibold'
                : 'text-[#5C4A3C] hover:text-[#2D241E] hover:bg-[#EFE8DC]'
            }`}
          >
            마이페이지
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium text-[#FAF6F0] bg-[#443327] hover:bg-[#2D221A] rounded-md transition-colors shadow-sm whitespace-nowrap"
            title="새 옷 등록하기"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">옷 등록</span>
          </button>

          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-[#4A3B30] bg-[#EFE8DC] hover:bg-[#E4DBCC] rounded-md transition-colors border border-[#D8CABE] whitespace-nowrap"
          >
            <User className="w-4 h-4 text-[#7A6350]" />
            <span className="max-w-[70px] sm:max-w-[100px] truncate">
              {user ? user.name : '로그인'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
