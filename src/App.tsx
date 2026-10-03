/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { SmartCloset } from './components/SmartCloset';
import { SmartShopping } from './components/SmartShopping';
import { FashionCoordinator } from './components/FashionCoordinator';
import { MyPage } from './components/MyPage';
import { AddGarmentModal } from './components/AddGarmentModal';
import { AuthModal } from './components/AuthModal';
import {
  ClosetItem,
  OrderItem,
  StoreItem,
  UserProfile,
} from './types';
import {
  INITIAL_CLOSET_ITEMS,
  INITIAL_STORE_ITEMS,
  INITIAL_USER_PROFILE,
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'closet' | 'shopping' | 'coordinator' | 'mypage'>('closet');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [closetItems, setClosetItems] = useState<ClosetItem[]>(INITIAL_CLOSET_ITEMS);
  const [storeItems, setStoreItems] = useState<StoreItem[]>(INITIAL_STORE_ITEMS);
  const [favorites, setFavorites] = useState<string[]>(['store-1', 'store-4']);

  // Initial starter order for immediate tracking demo
  const [orders, setOrders] = useState<OrderItem[]>([
    {
      orderId: 'ORD-8941-204',
      createdAt: '2026-10-01',
      item: {
        id: 'store-1',
        title: '소프트 메리노울 하프집업 니트 (오트밀)',
        brand: 'ATELIER KNITWORKS',
        price: 68000,
        image: '/src/assets/images/wardrobe_hanger_wood_1790992705475.jpg',
        size: 'L (100-105)',
        color: '오트밀 베이지',
      },
      quantity: 1,
      buyer: {
        name: '이도현',
        phone: '010-3849-2819',
        address: '서울특별시 마포구 와우산로 94 아틀리에 하우스 302호',
      },
      payment: {
        method: '스마트 아틀리에 간편결제',
        subtotal: 68000,
        platformFee: 3060,
        totalPrice: 68000,
        status: 'PAID',
      },
      status: 'HEADQUARTER_CONFIRMED',
      dispatchTimeline: [
        {
          stage: 'ORDER_PLACED',
          time: '어제 14:20',
          title: '앱 결제 승인 완료',
          desc: '고객 주문 승인 및 수수료(4.5%) 정산',
          completed: true,
        },
        {
          stage: 'AI_HQ_ROUTED',
          time: '어제 14:21',
          title: 'AI 본사 전산망 직발주 접수',
          desc: 'ATELIER KNITWORKS 본사 ERP 시스템에 자동 발주 접수 완료',
          completed: true,
        },
        {
          stage: 'STOCK_VERIFIED',
          time: '오늘 09:30',
          title: '본사 물류센터 재고 승인 및 패킹',
          desc: '본사 물류 1차 검수 및 친환경 크라프트 포장 완료',
          completed: true,
        },
        {
          stage: 'IN_TRANSIT',
          time: '진행 중',
          title: '택배사 인계 (CJ대한통운 654-2918-0912)',
          desc: '허브 터미널 간 이동 중 (내일 도착 예정)',
          completed: false,
        },
        {
          stage: 'DELIVERED',
          time: '익일 예정',
          title: '문 앞 배송 완료',
          desc: '배송 완료 후 스마트 옷장에 자동 등록 안내',
          completed: false,
        },
      ],
    },
  ]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Cross-Navigation States
  const [coordinatorPreselectedItem, setCoordinatorPreselectedItem] = useState<ClosetItem | null>(null);
  const [shoppingSearchKeyword, setShoppingSearchKeyword] = useState<string>('');

  // Handle Add Item to Closet
  const handleAddGarment = (item: ClosetItem) => {
    setClosetItems([item, ...closetItems]);
  };

  // Add analyzed garment from Fashion Coordinator
  const handleAddAnalyzedGarment = (partialItem: Partial<ClosetItem>) => {
    const fullItem: ClosetItem = {
      id: `closet-${Date.now()}`,
      name: partialItem.name || '새 의류',
      category: partialItem.category || '상의',
      color: partialItem.color || '뉴트럴',
      season: partialItem.season || '사계절',
      style: partialItem.style || '미니멀',
      brand: partialItem.brand || 'ATELIER SELECTION',
      imageUrl: partialItem.imageUrl || '/src/assets/images/wardrobe_hanger_wood_1790992705475.jpg',
      addedAt: new Date().toISOString().slice(0, 10),
      wearCount: 0,
      notes: partialItem.notes,
      matchingScoreWithUser: partialItem.matchingScoreWithUser || 92,
    };
    setClosetItems([fullItem, ...closetItems]);
    setActiveTab('closet');
  };

  // Handle Order Placement
  const handleOrderPlaced = (newOrder: OrderItem) => {
    setOrders([newOrder, ...orders]);
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Navigation handlers
  const handleGoToShoppingWithSearch = (keyword?: string) => {
    setShoppingSearchKeyword(keyword || '');
    setActiveTab('shopping');
  };

  const handleGoToCoordinatorWithItem = (item: ClosetItem) => {
    setCoordinatorPreselectedItem(item);
    setActiveTab('coordinator');
  };

  return (
    <div className="min-h-screen bg-[#F7F5EE] text-[#2D251E] flex flex-col font-sans">
      {/* 3-Zone Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        cartCount={orders.length}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'closet' && (
          <SmartCloset
            closetItems={closetItems}
            user={user}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onGoToShopping={handleGoToShoppingWithSearch}
            onGoToCoordinatorWithItem={handleGoToCoordinatorWithItem}
            onDeleteItem={(id) => setClosetItems(closetItems.filter((i) => i.id !== id))}
          />
        )}

        {activeTab === 'shopping' && (
          <SmartShopping
            storeItems={storeItems}
            closetItems={closetItems}
            user={user}
            onOrderPlaced={handleOrderPlaced}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            initialSearch={shoppingSearchKeyword}
          />
        )}

        {activeTab === 'coordinator' && (
          <FashionCoordinator
            user={user}
            closetItems={closetItems}
            onAddAnalyzedGarmentToCloset={handleAddAnalyzedGarment}
            onGoToShopping={handleGoToShoppingWithSearch}
            preSelectedClosetItem={coordinatorPreselectedItem}
          />
        )}

        {activeTab === 'mypage' && (
          <MyPage
            user={user}
            onUpdateUser={setUser}
            orders={orders}
            favorites={favorites}
            storeItems={storeItems}
            closetItems={closetItems}
            onLogout={() => setIsAuthModalOpen(true)}
            onGoToShopping={() => setActiveTab('shopping')}
          />
        )}
      </main>

      {/* Subtle Sketchbook Atelier Footer */}
      <footer className="border-t border-[#DECFC0] bg-[#F2EDE4] py-10 mt-16 text-xs text-[#7A6350]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-serif font-bold text-sm text-[#2D241E]">
              ATELIER CLOSET (아틀리에 클로젯)
            </div>
            <p className="text-[11px] text-[#8C6D53]">
              스케치북 & 우드 감성의 학생 패션 프로젝트 · 스마트 옷장, AI 코디 및 본사 직발주 쇼핑 플랫폼
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span>AI 직발주 엔진 가동 중</span>
            <span>·</span>
            <span>플랫폼 수수료율 4.5% 학생 정산</span>
            <span>·</span>
            <span>퍼스널컬러 & 체형 알고리즘 연동</span>
          </div>

          <div className="text-[11px] text-[#9E8B7A]">
            © 2026 Atelier Closet Studio. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGarmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGarment={handleAddGarment}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        onLogin={(loggedUser) => setUser(loggedUser)}
      />
    </div>
  );
}
