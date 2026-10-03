import React, { useState } from 'react';
import { ClosetItem, OrderItem, StoreItem, UserProfile } from '../types';
import { Search, ShoppingBag, CheckCircle, ShieldCheck, Truck, Sparkles, AlertCircle, Heart } from 'lucide-react';

interface SmartShoppingProps {
  storeItems: StoreItem[];
  closetItems: ClosetItem[];
  user: UserProfile;
  onOrderPlaced: (order: OrderItem) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  initialSearch?: string;
}

export const SmartShopping: React.FC<SmartShoppingProps> = ({
  storeItems,
  closetItems,
  user,
  onOrderPlaced,
  favorites,
  onToggleFavorite,
  initialSearch = '',
}) => {
  const [searchKeyword, setSearchKeyword] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedStyle, setSelectedStyle] = useState<string>('전체');
  const [onlyPersonalColorMatch, setOnlyPersonalColorMatch] = useState<boolean>(false);

  // Purchase Modal State
  const [activeItemForPurchase, setActiveItemForPurchase] = useState<StoreItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);
  const [orderCompleteData, setOrderCompleteData] = useState<OrderItem | null>(null);

  // Buyer Info state
  const [buyerName, setBuyerName] = useState(user.name);
  const [buyerPhone, setBuyerPhone] = useState('010-3849-2819');
  const [buyerAddress, setBuyerAddress] = useState('서울특별시 마포구 와우산로 94 아틀리에 하우스 302호');

  // Filter items
  const filteredProducts = storeItems.filter((item) => {
    const matchesCat = selectedCategory === '전체' || item.category === selectedCategory;
    const matchesStyle = selectedStyle === '전체' || item.style === selectedStyle;
    const matchesColor = !onlyPersonalColorMatch || item.personalColorMatch.includes(user.personalColor);
    const matchesSearch =
      item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.description.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesCat && matchesStyle && matchesColor && matchesSearch;
  });

  const categories = ['전체', '상의', '하의', '아우터', '신발', '악세사리'];
  const styles = ['전체', '미니멀', '시티보이', '캐주얼', '아메카지', '클래식/포멀'];

  const openPurchaseModal = (item: StoreItem) => {
    setActiveItemForPurchase(item);
    setSelectedSize(item.sizes[0] || 'Free');
    setSelectedColor(item.colors[0] || '기본');
    setQuantity(1);
    setOrderCompleteData(null);
  };

  const handleExecutePurchase = async () => {
    if (!activeItemForPurchase) return;
    setIsOrdering(true);

    try {
      const response = await fetch('/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: {
            ...activeItemForPurchase,
            selectedSize,
            selectedColor,
          },
          buyer: {
            name: buyerName,
            phone: buyerPhone,
            address: buyerAddress,
          },
          quantity,
          paymentMethod: '스마트 아틀리에 간편결제',
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.order) {
        setOrderCompleteData(resData.order);
        onOrderPlaced(resData.order);
      }
    } catch (e) {
      console.error('Order error:', e);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Top Banner: Smart Shopping & AI HQ Dispatch Protocol */}
      <section className="bg-[#FAF6F0] rounded-2xl border border-[#DFCFC0] p-6 sm:p-8 pencil-shadow">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6D53]">
              <span>스마트 쇼핑 & AI 본사 직발주 시스템</span>
              <span>·</span>
              <span>수수료 4.5% 학생 창업 플랫폼</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A1F18]">
              내 옷장과 찰떡인 스타일 맞춤 쇼핑
            </h1>
            <p className="text-sm text-[#5C4A3C] leading-relaxed">
              등록된 스마트 옷장 아이템과의 호환성을 AI가 사전에 검증하여 구매 실패를 방지합니다.
              앱 내에서 주문 즉시 의류 본사 전산망으로 발주가 자동 접수되며, 실시간 재고 확인 및 배송 추적이 가능합니다.
            </p>
          </div>

          <div className="p-4 bg-[#EDE5D8] rounded-xl border border-[#DACDBD] text-xs space-y-2 max-w-xs w-full">
            <div className="flex items-center gap-2 font-bold text-[#35251C]">
              <ShieldCheck className="w-4 h-4 text-[#A87A40]" />
              <span>AI 본사 직발주 보증</span>
            </div>
            <p className="text-[#634E3E] leading-tight">
              중간 유통 단계를 줄여 본사 직배송하며, 플랫폼 이용 수수료(4.5%)를 투명하게 공개합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8C6D53] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="옷, 브랜드, 스타일 검색 (예: 옥스포드, 슬랙스, 자켓)..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#DFCFC0] rounded-xl text-xs sm:text-sm text-[#2A1F18] placeholder-[#9E8B7A] focus:outline-none focus:border-[#4A3B30]"
            />
          </div>

          {/* Personal Color Filter Toggle */}
          <label className="flex items-center gap-2 text-xs font-semibold text-[#443327] cursor-pointer bg-[#EFE8DC] px-3 py-2 rounded-xl border border-[#DFD3C3]">
            <input
              type="checkbox"
              checked={onlyPersonalColorMatch}
              onChange={(e) => setOnlyPersonalColorMatch(e.target.checked)}
              className="rounded text-[#443327] focus:ring-0"
            />
            <span>내 퍼스널컬러({user.personalColor}) 맞춤 상품만 보기</span>
          </label>
        </div>

        {/* Category & Style Tabs */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1 bg-[#EFE8DC] p-1 rounded-xl border border-[#DFD3C3] overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#382A21] text-[#FAF6F0] shadow-sm'
                    : 'text-[#6B5747] hover:text-[#2C211A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#EFE8DC] p-1 rounded-xl border border-[#DFD3C3] overflow-x-auto">
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedStyle === style
                    ? 'bg-[#382A21] text-[#FAF6F0] shadow-sm'
                    : 'text-[#6B5747] hover:text-[#2C211A]'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section>
        {filteredProducts.length === 0 ? (
          <div className="bg-[#FAF7F2] rounded-2xl border border-dashed border-[#CFBFAC] p-12 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-[#8C6D53] mx-auto opacity-60" />
            <h4 className="text-base font-serif font-bold text-[#3B2C21]">
              검색 조건에 맞는 의류 상품이 없습니다
            </h4>
            <p className="text-xs text-[#7A6350] max-w-sm mx-auto">
              필터를 초기화하거나 다른 검색어로 찾아보세요.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('전체');
                setSelectedStyle('전체');
                setOnlyPersonalColorMatch(false);
                setSearchKeyword('');
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#443327] hover:bg-[#2C2017] text-[#FAF6F0] rounded-xl text-xs font-semibold"
            >
              필터 전체 초기화
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isFav = favorites.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-[#DFD3C3] overflow-hidden pencil-shadow flex flex-col justify-between hover:border-[#9A7F66] transition-all"
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative aspect-4/3 bg-[#F4EFE6] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <button
                        onClick={() => onToggleFavorite(product.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                          isFav
                            ? 'bg-[#A8382A] text-white'
                            : 'bg-black/30 text-white hover:bg-black/50'
                        }`}
                        title="즐겨찾기 보관함에 추가"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>

                      <div className="absolute bottom-3 left-3 bg-[#2D211A]/85 backdrop-blur-sm text-[#FAF6F0] text-[11px] px-2.5 py-1 rounded-md font-medium">
                        본사 잔여 {product.stockCount}벌
                      </div>
                    </div>

                    {/* Metadata & Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#8C6D53]">
                        <span className="font-semibold uppercase tracking-wider">
                          {product.brand}
                        </span>
                        <span>{product.style}</span>
                      </div>

                      <h3 className="text-base font-serif font-bold text-[#2A1F18] leading-snug group-hover:text-[#684C35] transition-colors">
                        {product.title}
                      </h3>

                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-[#2A1F18] font-mono tabular-nums">
                          {product.price.toLocaleString()}원
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-[#9E8B7A] line-through font-mono tabular-nums">
                            {product.originalPrice.toLocaleString()}원
                          </span>
                        )}
                      </div>

                      {/* Wardrobe Synergy Highlight */}
                      <div className="p-3 bg-[#F6EFE6] rounded-xl border border-[#DFD3C2] text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-[#443327]">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#B88746]" />
                            스마트 옷장 시너지
                          </span>
                          <span className="text-[#3D7847]">
                            {product.wardrobeSynergy.synergyScore}% 일치
                          </span>
                        </div>
                        <p className="text-[11px] text-[#634E3E] leading-relaxed">
                          {product.wardrobeSynergy.synergyReason}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Buy CTA */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => openPurchaseModal(product)}
                      className="w-full py-2.5 px-4 bg-[#382A21] hover:bg-[#231913] text-[#FAF6F0] rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>AI 본사 직발주 구매</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* In-App Direct Purchase Modal */}
      {activeItemForPurchase && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F3] rounded-2xl border border-[#DFCFC0] max-w-xl w-full p-6 sm:p-8 pencil-shadow max-h-[90vh] overflow-y-auto space-y-6">
            {!orderCompleteData ? (
              <>
                <div className="flex items-start justify-between border-b border-[#E8DDCE] pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D53]">
                      Direct Headquarter Order
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#2A1F18]">
                      AI 본사 직발주 구매 신청
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveItemForPurchase(null)}
                    className="text-[#8C6D53] hover:text-[#2A1F18] text-sm font-bold"
                  >
                    닫기 ✕
                  </button>
                </div>

                {/* Selected Item Summary */}
                <div className="flex items-center gap-4 p-4 bg-[#F2EBE0] rounded-xl border border-[#DFD3C2]">
                  <img
                    src={activeItemForPurchase.image}
                    alt={activeItemForPurchase.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover rounded-lg shrink-0 border border-[#D5C6B5]"
                  />
                  <div className="space-y-1 flex-1 min-w-0">
                    <span className="text-xs text-[#8C6D53] font-semibold">
                      {activeItemForPurchase.brand}
                    </span>
                    <h4 className="text-sm font-bold text-[#2A1F18] truncate">
                      {activeItemForPurchase.title}
                    </h4>
                    <p className="text-xs font-mono font-bold text-[#35251C]">
                      {activeItemForPurchase.price.toLocaleString()}원
                    </p>
                  </div>
                </div>

                {/* Option Pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#443327]">사이즈 선택</label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18] font-medium focus:outline-none"
                    >
                      {activeItemForPurchase.sizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#443327]">컬러 선택</label>
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18] font-medium focus:outline-none"
                    >
                      {activeItemForPurchase.colors.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Buyer Shipping Info Form */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-[#443327] uppercase tracking-wider">
                    배송지 및 주문자 정보
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <input
                        type="text"
                        placeholder="받는 사람 이름"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full p-2.5 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="연락처"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        className="w-full p-2.5 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="배송 주소"
                        value={buyerAddress}
                        onChange={(e) => setBuyerAddress(e.target.value)}
                        className="w-full p-2.5 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18]"
                      />
                    </div>
                  </div>
                </div>

                {/* Transparent Commission & Pricing Calculation */}
                <div className="p-4 bg-[#EDE5D8] rounded-xl border border-[#DACDBD] space-y-2 text-xs">
                  <div className="flex justify-between text-[#6B5747]">
                    <span>상품 금액 ({quantity}개)</span>
                    <span className="font-mono tabular-nums">
                      {(activeItemForPurchase.price * quantity).toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between text-[#6B5747]">
                    <span className="flex items-center gap-1">
                      <span>플랫폼 중개 수수료 (4.5%)</span>
                      <span className="text-[10px] text-[#A87A40]">(학생 팀 정산 포함)</span>
                    </span>
                    <span className="font-mono tabular-nums text-[#3D7847]">
                      {Math.round(activeItemForPurchase.price * quantity * 0.045).toLocaleString()}원 (포함)
                    </span>
                  </div>
                  <div className="flex justify-between text-[#6B5747]">
                    <span>본사 직배송 배송비</span>
                    <span className="font-mono font-semibold text-[#3D7847]">무료 배송</span>
                  </div>
                  <div className="pt-2 border-t border-[#D5C6B5] flex justify-between font-bold text-sm text-[#2A1F18]">
                    <span>최종 결제 금액</span>
                    <span className="font-mono text-base tabular-nums">
                      {(activeItemForPurchase.price * quantity).toLocaleString()}원
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveItemForPurchase(null)}
                    className="flex-1 py-3 bg-[#EAE1D3] hover:bg-[#DDD2C2] text-[#443327] rounded-xl text-xs font-semibold"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleExecutePurchase}
                    disabled={isOrdering}
                    className="flex-2 py-3 bg-[#382A21] hover:bg-[#251B15] text-[#FAF6F0] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isOrdering ? (
                      <span>AI 본사 직발주 전송 중...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-[#DEB887]" />
                        <span>주문 승인 및 본사 직발주</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* Order Success & Live Dispatch State */
              <div className="space-y-6 text-center py-2">
                <div className="w-14 h-14 bg-[#3D7847] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono text-[#8C6D53]">
                    주문번호: {orderCompleteData.orderId}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#2A1F18]">
                    AI 본사 직발주가 완료되었습니다!
                  </h3>
                  <p className="text-xs text-[#5C4A3C]">
                    의류 본사 물류 전산에 실시간 직발주 접수되었으며, 본사에서 패킹 후 출고됩니다.
                  </p>
                </div>

                {/* Dispatch Timeline Preview */}
                <div className="bg-[#F4EFE6] rounded-xl p-4 border border-[#DFD3C2] text-left space-y-3 text-xs">
                  <div className="font-bold text-[#2A1F18] flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#8C6D53]" />
                    <span>실시간 배송 진행 현황</span>
                  </div>

                  <div className="space-y-2 border-l-2 border-[#8C6D53] pl-3 ml-1">
                    {orderCompleteData.dispatchTimeline.map((step, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex items-center justify-between font-semibold text-[#35251C]">
                          <span>{step.title}</span>
                          <span className="text-[10px] text-[#8C6D53]">{step.time}</span>
                        </div>
                        <p className="text-[11px] text-[#6B5747]">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveItemForPurchase(null)}
                  className="w-full py-3 bg-[#382A21] hover:bg-[#251B15] text-[#FAF6F0] rounded-xl text-xs font-semibold"
                >
                  확인 완료 (마이페이지에서 배송 추적 가능)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
