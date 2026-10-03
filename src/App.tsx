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
        title: '메리노울 하프집업 니트 (오트밀)',
        brand: 'ATELIER KNITWORKS',
        price: 68000,
        image: '/src/assets/images/wardrobe_hanger_wood_1790992705475.jpg',
        size: 'L',
        color: '오트밀',
      },
      quantity: 1,
      buyer: {
        name: '이도현',
        phone: '010-3849-2819',
        address: '서울특별시 마포구 와우산로 94 아틀리에 하우스 302호',
      },
      payment: {
        method: '아틀리에 간편결제',
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
          desc: 'ATELIER KNITWORKS 본사 ERP 자동 발주 접수',
          completed: true,
        },
        {
          stage: 'STOCK_VERIFIED',
          time: '오늘 09:30',
          title: '본사 재고 승인 및 패킹',
          desc: '본사 물류 출하 검수 완료',
          completed: true,
        },
        {
          stage: 'IN_TRANSIT',
          time: '진행 중',
          title: '택배사 인계 (CJ대한통운)',
          desc: '배송 이동 중 (내일 도착 예정)',
          completed: false,
        },
        {
          stage: 'DELIVERED',
          time: '익일 예정',
          title: '문 앞 배송 완료',
          desc: '배송 완료',
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
      color: partialItem.color || '내추럴',
      season: partialItem.season || '사계절',
      style: partialItem.style || '미니멀',
      brand: partialItem.brand || 'ATELIER PERSONAL',
      imageUrl: partialItem.imageUrl || '/src/assets/images/wardrobe_hanger_wood_1790992705475.jpg',
      addedAt: new Date().toISOString().slice(0, 10),
      memo: '사진 판별 후 내 옷장에 새로 등록한 옷',
    };
    setClosetItems([fullItem, ...closetItems]);
    setActiveTab('closet');
  };

  // Update memo for an item
  const handleUpdateItemMemo = (id: string, newMemo: string) => {
    setClosetItems(closetItems.map((item) => (item.id === id ? { ...item, memo: newMemo } : item)));
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
    <div className="min-h-screen bg-[#F8F6F1] text-[#2C241E] flex flex-col selection:bg-[#EAE2D5] selection:text-[#2C241E]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        cartCount={orders.length}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'closet' && (
          <SmartCloset
            closetItems={closetItems}
            user={user}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onGoToShopping={handleGoToShoppingWithSearch}
            onGoToCoordinatorWithItem={handleGoToCoordinatorWithItem}
            onDeleteItem={(id) => setClosetItems(closetItems.filter((i) => i.id !== id))}
            onUpdateItemMemo={handleUpdateItemMemo}
          />
        )}

        {activeTab === 'shopping' && (
          <div className="planner-card p-6 sm:p-8">
            <SmartShopping
              storeItems={storeItems}
              closetItems={closetItems}
              user={user}
              onOrderPlaced={handleOrderPlaced}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              initialSearch={shoppingSearchKeyword}
            />
          </div>
        )}

        {activeTab === 'coordinator' && (
          <div className="planner-card p-6 sm:p-8">
            <FashionCoordinator
              user={user}
              closetItems={closetItems}
              onAddAnalyzedGarmentToCloset={handleAddAnalyzedGarment}
              onGoToShopping={handleGoToShoppingWithSearch}
              preSelectedClosetItem={coordinatorPreselectedItem}
            />
          </div>
        )}

        {activeTab === 'mypage' && (
          <div className="planner-card p-6 sm:p-8">
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
          </div>
        )}
      </main>

      {/* Clean Minimal Diary Footer */}
      <footer className="border-t border-[#EAE3D7] bg-[#F2EDE4] py-6 text-center text-xs text-[#7A6B5D]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>closet</span>
          <span>© 2026 closet. All rights reserved.</span>
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
