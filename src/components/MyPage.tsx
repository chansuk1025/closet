import React, { useState } from 'react';
import { BodyType, ClosetItem, FashionStyle, OrderItem, PersonalColor, StoreItem, UserProfile } from '../types';
import { User, Package, Heart, BarChart3, ShieldCheck, Check, Truck, LogOut, Sparkles, Edit2 } from 'lucide-react';

interface MyPageProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  orders: OrderItem[];
  favorites: string[];
  storeItems: StoreItem[];
  closetItems: ClosetItem[];
  onLogout: () => void;
  onGoToShopping: () => void;
}

export const MyPage: React.FC<MyPageProps> = ({
  user,
  onUpdateUser,
  orders,
  favorites,
  storeItems,
  closetItems,
  onLogout,
  onGoToShopping,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'orders' | 'favorites' | 'stats'>('orders');

  // Profile form local state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user.name);
  const [height, setHeight] = useState(user.height);
  const [weight, setWeight] = useState(user.weight || 68);
  const [bodyType, setBodyType] = useState<BodyType>(user.bodyType);
  const [personalColor, setPersonalColor] = useState<PersonalColor>(user.personalColor);
  const [preferredStyles, setPreferredStyles] = useState<FashionStyle[]>(user.preferredStyles);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Selected Order for tracking modal
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<OrderItem | null>(null);

  const availableStyles: FashionStyle[] = [
    '미니멀',
    '시티보이',
    '캐주얼',
    '스트릿',
    '아메카지',
    '클래식/포멀',
    '고프코어',
  ];

  const handleToggleStyle = (style: FashionStyle) => {
    if (preferredStyles.includes(style)) {
      if (preferredStyles.length > 1) {
        setPreferredStyles(preferredStyles.filter((s) => s !== style));
      }
    } else {
      setPreferredStyles([...preferredStyles, style]);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      height: Number(height),
      weight: Number(weight),
      bodyType,
      personalColor,
      preferredStyles,
    });
    setIsEditingProfile(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const favoriteProducts = storeItems.filter((item) => favorites.includes(item.id));

  return (
    <div className="space-y-8">
      {/* Top Profile Summary Card */}
      <section className="bg-[#FAF5EC] rounded-2xl border border-[#DECFC0] p-6 sm:p-8 pencil-shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#3E2F24] text-[#FAF6F0] flex items-center justify-center font-serif text-2xl font-bold shadow-sm">
              {user.name.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-bold text-[#2A1F18]">{user.name}</h1>
                <span className="text-xs bg-[#EAE0D1] text-[#443327] px-2.5 py-0.5 rounded-full font-medium border border-[#D5C6B5]">
                  학생 멤버십
                </span>
              </div>
              <p className="text-xs text-[#7A6350] mt-0.5">{user.email}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#8C6D53] mt-2">
                <span>{user.height}cm</span>
                <span>·</span>
                <span>{user.bodyType}</span>
                <span>·</span>
                <span className="font-semibold text-[#443327]">{user.personalColor}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveSubTab('profile');
                setIsEditingProfile(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EAE1D3] hover:bg-[#DDD2C2] text-[#443327] rounded-xl text-xs font-semibold border border-[#CFBFAC] transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>프로필 수정</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 hover:bg-white text-[#8C6D53] hover:text-[#A8382A] rounded-xl text-xs font-semibold border border-[#D5C6B5] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>

        {saveSuccessNotice && (
          <div className="mt-4 p-3 bg-[#E5F3E7] text-[#2F6136] rounded-xl border border-[#C3E4C8] text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>신체 정보 및 스타일 프로필이 성공적으로 저장되었습니다.</span>
          </div>
        )}
      </section>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DECFC0] pb-2 text-xs sm:text-sm font-medium">
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
            activeSubTab === 'orders'
              ? 'bg-[#382A21] text-[#FAF6F0] font-semibold shadow-sm'
              : 'text-[#6B5747] hover:bg-[#EFE8DC]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>구매 및 배송 내역 ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('favorites')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
            activeSubTab === 'favorites'
              ? 'bg-[#382A21] text-[#FAF6F0] font-semibold shadow-sm'
              : 'text-[#6B5747] hover:bg-[#EFE8DC]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>즐겨찾기 보관함 ({favorites.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
            activeSubTab === 'profile'
              ? 'bg-[#382A21] text-[#FAF6F0] font-semibold shadow-sm'
              : 'text-[#6B5747] hover:bg-[#EFE8DC]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>신체 및 스타일 설정</span>
        </button>

        <button
          onClick={() => setActiveSubTab('stats')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
            activeSubTab === 'stats'
              ? 'bg-[#382A21] text-[#FAF6F0] font-semibold shadow-sm'
              : 'text-[#6B5747] hover:bg-[#EFE8DC]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>옷장 통계</span>
        </button>
      </div>

      {/* Tab 1: Orders and Live Tracking */}
      {activeSubTab === 'orders' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-[#2A1F18]">
              스마트 쇼핑 구매 내역 ({orders.length}건)
            </h2>
            <span className="text-xs text-[#7A6350]">AI 본사 직발주 실시간 연동</span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-[#FAF7F2] rounded-2xl border border-dashed border-[#CFBFAC] p-12 text-center space-y-3">
              <Package className="w-10 h-10 text-[#8C6D53] mx-auto opacity-50" />
              <h4 className="text-base font-serif font-bold text-[#3B2C21]">
                아직 구매한 내역이 없습니다
              </h4>
              <p className="text-xs text-[#7A6350] max-w-sm mx-auto">
                스마트 쇼핑에서 내 옷장과 찰떡인 의류를 AI 본사 직발주로 편리하게 주문해보세요.
              </p>
              <button
                onClick={onGoToShopping}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#443327] hover:bg-[#2C2017] text-[#FAF6F0] rounded-xl text-xs font-semibold"
              >
                쇼핑하러 가기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl border border-[#DFD3C3] p-5 sm:p-6 pencil-shadow space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#F0E6D8] pb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#443327]">{order.orderId}</span>
                      <span className="text-[#8C6D53]">·</span>
                      <span className="text-[#8C6D53]">{order.createdAt.slice(0, 10)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E7F3E9] text-[#2F6136] border border-[#C2E3C7]">
                        AI 본사 직발주 완료
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={order.item.image}
                        alt={order.item.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover rounded-xl border border-[#DFD3C2]"
                      />
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-[#8C6D53]">
                          {order.item.brand}
                        </span>
                        <h4 className="text-sm font-bold text-[#2A1F18]">{order.item.title}</h4>
                        <div className="text-xs text-[#6B5747]">
                          옵션: {order.item.size} / {order.item.color} · 수량 {order.quantity}개
                        </div>
                      </div>
                    </div>

                    <div className="text-right sm:border-l sm:border-[#F0E6D8] sm:pl-6 space-y-1">
                      <div className="text-xs text-[#8C6D53]">결제 금액 (수수료 4.5% 포함)</div>
                      <div className="text-lg font-bold text-[#2A1F18] font-mono tabular-nums">
                        {order.payment.totalPrice.toLocaleString()}원
                      </div>
                      <button
                        onClick={() => setSelectedOrderForTracking(order)}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#443327] hover:text-[#1F150F] underline"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>실시간 배송 조회</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab 2: Favorites / Wishlist */}
      {activeSubTab === 'favorites' && (
        <section className="space-y-4">
          <h2 className="text-lg font-serif font-bold text-[#2A1F18]">
            즐겨찾기 보관함 ({favoriteProducts.length}개)
          </h2>

          {favoriteProducts.length === 0 ? (
            <div className="bg-[#FAF7F2] rounded-2xl border border-dashed border-[#CFBFAC] p-12 text-center space-y-3">
              <Heart className="w-10 h-10 text-[#8C6D53] mx-auto opacity-50" />
              <h4 className="text-base font-serif font-bold text-[#3B2C21]">
                즐겨찾기한 옷이 없습니다
              </h4>
              <p className="text-xs text-[#7A6350] max-w-sm mx-auto">
                스마트 쇼핑에서 마음에 드는 상품의 하트를 눌러 보관함에 담아두세요.
              </p>
              <button
                onClick={onGoToShopping}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#443327] hover:bg-[#2C2017] text-[#FAF6F0] rounded-xl text-xs font-semibold"
              >
                쇼핑 둘러보기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-[#DFD3C3] overflow-hidden pencil-shadow flex flex-col justify-between"
                >
                  <div className="relative aspect-4/3 bg-[#F4EFE6]">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[11px] font-semibold text-[#8C6D53]">{prod.brand}</span>
                    <h4 className="text-sm font-bold text-[#2A1F18] leading-tight">{prod.title}</h4>
                    <p className="text-base font-mono font-bold text-[#2A1F18]">
                      {prod.price.toLocaleString()}원
                    </p>
                    <button
                      onClick={onGoToShopping}
                      className="w-full py-2 bg-[#382A21] hover:bg-[#251B15] text-[#FAF6F0] rounded-xl text-xs font-semibold transition-colors mt-2"
                    >
                      쇼핑에서 구매하기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab 3: Body & Style Profile Form (Musinsa style membership) */}
      {activeSubTab === 'profile' && (
        <section className="bg-white rounded-2xl border border-[#DFD3C3] p-6 sm:p-8 pencil-shadow space-y-6">
          <div className="border-b border-[#F0E6D8] pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D53]">
              Personal Fashion Profile
            </span>
            <h2 className="text-xl font-serif font-bold text-[#2A1F18]">
              개인 맞춤 신체 정보 및 스타일 설정
            </h2>
            <p className="text-xs text-[#7A6350] mt-1">
              무신사 및 전문 퍼스널 컬러 진단 기준을 반영하여 AI가 체형과 피부색에 최적화된 추천을 제공합니다.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-[#443327] block mb-1">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs text-[#2A1F18]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#443327] block mb-1">키 (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs text-[#2A1F18]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#443327] block mb-1">몸무게 (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs text-[#2A1F18]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#443327] block mb-1">체형 유형 (Body Type)</label>
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value as BodyType)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs text-[#2A1F18]"
                >
                  <option value="직사각형 (슬림/보통)">직사각형 (슬림/보통 - 직선적 실루엣)</option>
                  <option value="역삼각형 (어깨 발달)">역삼각형 (어깨 및 상체 발달형)</option>
                  <option value="삼각형 (하체 중심)">삼각형 (하체 및 힙 중심형)</option>
                  <option value="웨이브 (부드러운 곡선)">웨이브 (부드러운 곡선 라인)</option>
                  <option value="스트레이트 (균형 체형)">스트레이트 (입체적 균형 체형)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#443327] block mb-1">피부색 & 퍼스널 컬러</label>
                <select
                  value={personalColor}
                  onChange={(e) => setPersonalColor(e.target.value as PersonalColor)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs text-[#2A1F18]"
                >
                  <option value="봄 웜톤">봄 웜톤 (Spring Warm - 밝고 따뜻한 톤)</option>
                  <option value="여름 쿨톤">여름 쿨톤 (Summer Cool - 맑고 청량한 톤)</option>
                  <option value="가을 웜톤">가을 웜톤 (Autumn Warm - 그윽하고 포근한 톤)</option>
                  <option value="겨울 쿨톤">겨울 쿨톤 (Winter Cool - 선명하고 시크한 톤)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#443327] block mb-2">
                추구하는 패션 스타일 (다중 선택 가능)
              </label>
              <div className="flex flex-wrap gap-2">
                {availableStyles.map((style) => {
                  const isChecked = preferredStyles.includes(style);
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => handleToggleStyle(style)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isChecked
                          ? 'bg-[#382A21] text-[#FAF6F0] shadow-sm'
                          : 'bg-[#F2ECE2] text-[#6B5747] hover:bg-[#EAE0D1]'
                      }`}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-[#382A21] hover:bg-[#251B15] text-[#FAF6F0] rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              설정 저장하기
            </button>
          </form>
        </section>
      )}

      {/* Tab 4: Wardrobe Statistics */}
      {activeSubTab === 'stats' && (
        <section className="bg-white rounded-2xl border border-[#DFD3C3] p-6 sm:p-8 pencil-shadow space-y-6">
          <div className="border-b border-[#F0E6D8] pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D53]">
              Closet Intelligence
            </span>
            <h2 className="text-xl font-serif font-bold text-[#2A1F18]">
              스마트 옷장 통계 및 자산 가치
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#DFD3C2] text-center space-y-1">
              <span className="text-xs text-[#8C6D53]">보유 의류 수</span>
              <div className="text-2xl font-serif font-bold text-[#2A1F18]">
                {closetItems.length}벌
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#DFD3C2] text-center space-y-1">
              <span className="text-xs text-[#8C6D53]">퍼스널컬러 일치율</span>
              <div className="text-2xl font-serif font-bold text-[#3D7847]">
                94%
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#DFD3C2] text-center space-y-1">
              <span className="text-xs text-[#8C6D53]">최다 보유 카테고리</span>
              <div className="text-2xl font-serif font-bold text-[#2A1F18]">
                상의 (45%)
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#DFD3C2] text-center space-y-1">
              <span className="text-xs text-[#8C6D53]">추천 쇼핑 보강군</span>
              <div className="text-2xl font-serif font-bold text-[#A87A40]">
                니트/슬랙스
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tracking Modal */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F3] rounded-2xl border border-[#DECFC0] max-w-lg w-full p-6 pencil-shadow space-y-6">
            <div className="flex items-start justify-between border-b border-[#E8DDCE] pb-3">
              <div>
                <span className="text-[11px] font-mono text-[#8C6D53]">
                  {selectedOrderForTracking.orderId}
                </span>
                <h3 className="text-lg font-serif font-bold text-[#2A1F18]">
                  실시간 AI 본사 직발주 배송 현황
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForTracking(null)}
                className="text-xs text-[#8C6D53] hover:text-[#2A1F18] font-bold"
              >
                닫기 ✕
              </button>
            </div>

            <div className="p-3 bg-[#F2EBE0] rounded-xl border border-[#DFD3C2] flex items-center gap-3">
              <img
                src={selectedOrderForTracking.item.image}
                alt={selectedOrderForTracking.item.title}
                referrerPolicy="no-referrer"
                className="w-12 h-12 object-cover rounded-lg border border-[#D5C6B5]"
              />
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-[#2A1F18] truncate">
                  {selectedOrderForTracking.item.title}
                </div>
                <div className="text-[11px] text-[#6B5747]">
                  {selectedOrderForTracking.item.brand} · {selectedOrderForTracking.item.size}
                </div>
              </div>
            </div>

            {/* Stages */}
            <div className="space-y-3 border-l-2 border-[#8C6D53] pl-4 ml-2">
              {selectedOrderForTracking.dispatchTimeline.map((step, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center justify-between font-semibold text-xs text-[#2A1F18]">
                    <span>{step.title}</span>
                    <span className="text-[10px] text-[#8C6D53] font-mono">{step.time}</span>
                  </div>
                  <p className="text-[11px] text-[#6B5747]">{step.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedOrderForTracking(null)}
              className="w-full py-2.5 bg-[#382A21] text-[#FAF6F0] rounded-xl text-xs font-semibold"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
