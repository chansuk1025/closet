import React, { useState } from 'react';
import { ClosetItem, DailyOutfitRecommendation, UserProfile } from '../types';
import { CloudSun, Sparkles, Plus, RefreshCw, Trash2, Edit3, Check, Paperclip } from 'lucide-react';

interface SmartClosetProps {
  closetItems: ClosetItem[];
  user: UserProfile;
  onOpenAddModal: () => void;
  onGoToShopping: (searchKeyword?: string) => void;
  onGoToCoordinatorWithItem: (item: ClosetItem) => void;
  onDeleteItem: (id: string) => void;
  onUpdateItemMemo?: (id: string, newMemo: string) => void;
}

export const SmartCloset: React.FC<SmartClosetProps> = ({
  closetItems,
  user,
  onOpenAddModal,
  onGoToShopping,
  onGoToCoordinatorWithItem,
  onDeleteItem,
  onUpdateItemMemo,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedItemId, setSelectedItemId] = useState<string>(closetItems[0]?.id || '');

  // Memo editing state
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [editedMemoText, setEditedMemoText] = useState('');

  // Daily Outfit Weather & Occasion State (다이어리 날씨 플래너)
  const [weatherTemp, setWeatherTemp] = useState<number>(19);
  const [weatherCondition, setWeatherCondition] = useState<string>('맑음');
  const [occasion, setOccasion] = useState<string>('캠퍼스 강의 & 스터디');
  const [isGeneratingDaily, setIsGeneratingDaily] = useState(false);
  const [isWeatherNoteOpen, setIsWeatherNoteOpen] = useState(false);
  const [dailyOutfit, setDailyOutfit] = useState<DailyOutfitRecommendation | null>({
    outfitTitle: '캠퍼스 데일리 룩',
    temperatureSummary: '19℃ 날씨에 편안하게 입기 좋은 셔켓 레이어드 조합',
    topItem: '옥스포드 코튼 셔츠 (오프화이트)',
    bottomItem: '테이퍼드 생지 데님 팬츠 (인디고)',
    outerItem: '헤비 캔버스 워크 셔켓 (카멜)',
    shoesAndAccessories: '스웨이드 독일군 스니커즈 (샌드)',
    coordinatorTip: '셔츠 소매를 가볍게 걷고 셔켓은 자연스럽게 걸쳐 연출해 보세요.',
  });

  // Wardrobe Gap Note State (다이어리 쇼핑 플래너)
  const [isGapNoteOpen, setIsGapNoteOpen] = useState(false);
  const gapSuggestions = [
    { name: '메리노울 하프집업 니트 (오트밀)', reason: '옥스포드 셔츠 위에 레이어드하기 좋은 기본템' },
    { name: '원턱 드레이프 슬랙스 (모카 브라운)', reason: '생지 데님과 다른 단정한 실루엣 연출' },
  ];

  // Active selected item
  const selectedItem =
    closetItems.find((item) => item.id === selectedItemId) || closetItems[0] || null;

  // Filter items for the hanger rod
  const filteredItems = closetItems.filter((item) => {
    return selectedCategory === '전체' || item.category === selectedCategory;
  });

  const categories: string[] = ['전체', '상의', '하의', '아우터', '신발', '악세사리'];

  // Handle weather recommendation
  const handleGenerateDaily = async () => {
    setIsGeneratingDaily(true);
    try {
      const response = await fetch('/api/gemini/daily-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weather: { temp: weatherTemp, condition: weatherCondition },
          occasion,
          closetItems,
          userProfile: user,
        }),
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setDailyOutfit(resData.data);
      }
    } catch (e) {
      console.warn('API fallback:', e);
    } finally {
      setIsGeneratingDaily(false);
    }
  };

  const handleStartEditMemo = () => {
    if (selectedItem) {
      setEditedMemoText(selectedItem.memo || '');
      setIsEditingMemo(true);
    }
  };

  const handleSaveMemo = () => {
    if (selectedItem && onUpdateItemMemo) {
      onUpdateItemMemo(selectedItem.id, editedMemoText);
    }
    setIsEditingMemo(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header: Planner Bar with Index Tabs & Quick Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Index Tabs */}
        <div className="flex items-center gap-1.5 bg-[#EFECE5] p-1.5 rounded-xl border border-[#DFD8CC] overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-white text-[#2C241E] shadow-xs'
                  : 'text-[#7D6E60] hover:text-[#2C241E]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quick Planner Tools */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsWeatherNoteOpen(!isWeatherNoteOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F9F7F2] text-[#4A3B2F] rounded-xl text-xs font-semibold border border-[#E0D7CB] shadow-xs transition-colors"
          >
            <CloudSun className="w-3.5 h-3.5 text-[#B87D38]" />
            <span>오늘 날씨 코디</span>
          </button>

          <button
            onClick={() => setIsGapNoteOpen(!isGapNoteOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F9F7F2] text-[#4A3B2F] rounded-xl text-xs font-semibold border border-[#E0D7CB] shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#9E733E]" />
            <span>추천 쇼핑</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#3B2F25] hover:bg-[#281F17] text-[#FAF8F5] rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 옷 걸기</span>
          </button>
        </div>
      </div>

      {/* Pop-up Memo 1: Today's Weather Outfit Note */}
      {isWeatherNoteOpen && dailyOutfit && (
        <div className="relative planner-card p-5 max-w-xl mx-auto shadow-sm space-y-3 border border-[#E2DAD0]">
          <div className="washi-tape" />
          <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#2C241E]">오늘 날씨 코디 메모 📌</span>
              <div className="flex items-center gap-1 text-[11px] bg-[#F4EFE6] px-2 py-0.5 rounded-md text-[#5E4C3D]">
                <select
                  value={weatherTemp}
                  onChange={(e) => setWeatherTemp(Number(e.target.value))}
                  className="bg-transparent font-medium cursor-pointer focus:outline-none"
                >
                  <option value={12}>12℃ 쌀쌀</option>
                  <option value={15}>15℃ 선선</option>
                  <option value={19}>19℃ 쾌적</option>
                  <option value={24}>24℃ 포근</option>
                </select>
                <span>·</span>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="bg-transparent font-medium cursor-pointer focus:outline-none max-w-[120px] truncate"
                >
                  <option value="캠퍼스 강의 & 스터디">캠퍼스</option>
                  <option value="주말 데이트">데이트</option>
                  <option value="팀 발표">팀 발표</option>
                  <option value="친구 약속">친구 약속</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setIsWeatherNoteOpen(false)}
              className="text-[#968779] hover:text-[#2C241E] text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-[#524438]">
            <div className="font-bold text-sm text-[#2C241E]">{dailyOutfit.outfitTitle}</div>
            <p className="text-[11px] text-[#7A6B5D]">{dailyOutfit.temperatureSummary}</p>
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE5DB] space-y-1">
              <div>· 상의: <span className="font-semibold text-[#2C241E]">{dailyOutfit.topItem}</span></div>
              <div>· 하의: <span className="font-semibold text-[#2C241E]">{dailyOutfit.bottomItem}</span></div>
              {dailyOutfit.outerItem && (
                <div>· 아우터: <span className="font-semibold text-[#2C241E]">{dailyOutfit.outerItem}</span></div>
              )}
              <div>· 신발/소품: <span className="font-semibold text-[#2C241E]">{dailyOutfit.shoesAndAccessories}</span></div>
            </div>
            <p className="text-[11px] text-[#695747]">"{dailyOutfit.coordinatorTip}"</p>
          </div>

          <button
            onClick={handleGenerateDaily}
            disabled={isGeneratingDaily}
            className="w-full py-1.5 bg-[#4A3B2F] hover:bg-[#34271D] text-[#FAF8F5] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isGeneratingDaily ? 'animate-spin' : ''}`} />
            <span>다른 조합 추천받기</span>
          </button>
        </div>
      )}

      {/* Pop-up Memo 2: Wardrobe Gap Shopping Note */}
      {isGapNoteOpen && (
        <div className="relative planner-card p-5 max-w-xl mx-auto shadow-sm space-y-3 border border-[#E2DAD0]">
          <div className="washi-tape" />
          <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-2 pt-1">
            <span className="font-bold text-sm text-[#2C241E]">옷장에 필요한 추천 아이템 🛍️</span>
            <button
              onClick={() => setIsGapNoteOpen(false)}
              className="text-[#968779] hover:text-[#2C241E] text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 text-xs">
            {gapSuggestions.map((gap, i) => (
              <div key={i} className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#ECE5DB] flex items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-xs text-[#2C241E]">{gap.name}</div>
                  <div className="text-[11px] text-[#7A6B5D]">{gap.reason}</div>
                </div>
                <button
                  onClick={() => onGoToShopping(gap.name.split(' ')[0])}
                  className="px-2.5 py-1 bg-[#4A3B2F] hover:bg-[#34271D] text-[#FAF8F5] rounded-lg text-xs font-semibold shrink-0"
                >
                  쇼핑하기
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT: SIDE-BY-SIDE LAYOUT (좌측: 옷걸이 행거 랙 / 우측: 다이어리 페이퍼 카드) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: REAL CLOTHES HANGER RACK (실제 옷걸이에 옷들이 걸려 있는 행거 랙) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-[#FAF8F4] rounded-3xl p-5 sm:p-7 border border-[#E6E0D5] shadow-xs relative min-h-[520px] flex flex-col justify-start">
          {/* Rack Header info */}
          <div className="flex items-center justify-between mb-3 text-xs text-[#7A6B5D]">
            <span className="font-semibold text-[#4A3B2F]">내 행거 속 옷걸이 ({filteredItems.length}벌)</span>
            <span>옷걸이를 클릭해 옆의 다이어리 메모를 확인하세요</span>
          </div>

          {/* Clothes Rack Hanger Rod (슬림한 행거 봉) */}
          <div className="clothes-rack-bar h-2.5 w-full rounded-full relative mb-1">
            <div className="absolute -left-1.5 -top-1 w-3 h-4.5 bg-[#8C7F70] rounded-r-sm shadow-xs" />
            <div className="absolute -right-1.5 -top-1 w-3 h-4.5 bg-[#8C7F70] rounded-l-sm shadow-xs" />
          </div>

          {/* Clothing Items on Hangers (실제 옷걸이에 순차적으로 걸려 있는 옷들) */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 space-y-2 text-[#8C7D6F]">
              <p className="text-sm font-semibold">이 카테고리에는 등록된 옷이 없습니다.</p>
              <button
                onClick={onOpenAddModal}
                className="mt-1 px-4 py-1.5 bg-[#3B2F25] text-white rounded-xl text-xs font-semibold"
              >
                새 옷 걸기
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-4 sm:gap-5 overflow-x-auto pt-2 pb-5 px-2 scrollbar-thin">
              {filteredItems.map((item) => {
                const isSelected = item.id === selectedItem?.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItemId(item.id);
                      setIsEditingMemo(false);
                    }}
                    className={`flex flex-col items-center cursor-pointer shrink-0 w-32 sm:w-40 select-none transition-all ${
                      isSelected
                        ? 'hanger-garment-selected scale-102'
                        : 'hanger-garment-item opacity-85 hover:opacity-100 hover:scale-101'
                    }`}
                  >
                    {/* Realistic Triangular Coat Hanger with Metallic Hook over Rod */}
                    <div className="flex flex-col items-center relative z-20">
                      {/* Metallic hook wrapped over rod */}
                      <div className="w-3 h-4.5 border-t-2 border-r-2 border-l-2 border-[#8C7E6E] rounded-t-full -mb-1 shadow-xs" />
                      {/* Triangular Wooden/Modern Coat Hanger Body */}
                      <div className="w-20 sm:w-24 h-4 bg-[#C7BAA9] border border-[#DDD3C5] rounded-md shadow-xs flex items-center justify-center">
                        <div className="w-12 h-0.5 bg-[#8A7B6B] opacity-40 rounded-full" />
                      </div>
                    </div>

                    {/* Clothing Sticker Card (Hanging naturally from the hanger) */}
                    <div
                      className={`relative w-full aspect-3/4 rounded-2xl p-2.5 flex items-center justify-center -mt-1 transition-all ${
                        isSelected
                          ? 'bg-white ring-2 ring-[#3B2F25] shadow-md'
                          : 'bg-white/85 border border-[#E8E1D5] hover:bg-white shadow-xs'
                      }`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_6px_rgba(40,30,20,0.1)]"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />

                      {/* Category tag */}
                      <div className="absolute bottom-2 left-2 bg-[#F6F2EB] border border-[#E4DDD1] px-1.5 py-0.5 rounded text-[10px] font-semibold text-[#57483B]">
                        {item.category}
                      </div>

                      {/* Memo indicator badge */}
                      {item.memo && (
                        <div className="absolute top-2 right-2 text-[10px] bg-[#EFECE5] text-[#57483B] px-1.5 py-0.5 rounded font-medium shadow-2xs">
                          메모 ✏️
                        </div>
                      )}
                    </div>

                    {/* Clothing Name under the hanger */}
                    <div className="text-center mt-2 w-full">
                      <div
                        className={`text-xs font-semibold truncate px-1 rounded-md transition-colors ${
                          isSelected ? 'bg-[#3B2F25] text-white' : 'text-[#2C241E]'
                        }`}
                      >
                        {item.name}
                      </div>
                      <div className="text-[11px] text-[#7D6E60] truncate mt-0.5">
                        {item.color} · {item.season}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Rack Base note */}
          <div className="mt-auto pt-4 border-t border-[#EAE3D7] flex items-center justify-between text-xs text-[#8A7B6B]">
            <span>순차적으로 정리된 나의 옷들</span>
            <button
              onClick={onOpenAddModal}
              className="text-[#3B2F25] font-semibold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>새 옷걸이에 걸기</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: DIARY PAPER STYLE CARD (옆에 나타나는 다이어리 페이퍼 스타일 카드) */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
          {selectedItem ? (
            <div className="relative bg-[#FFFDF9] border border-[#E5DDD2] rounded-3xl p-6 shadow-sm space-y-4">
              {/* Decorative Washi Tape & Paper Clip */}
              <div className="washi-tape" />
              <div className="absolute top-4 right-4 text-[#B5A593] flex items-center gap-1">
                <Paperclip className="w-4 h-4 rotate-45" />
              </div>

              {/* Diary Header */}
              <div className="pt-2 border-b border-[#F0EAE1] pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-[#EFECE5] text-[#4A3B2F] font-semibold px-2 py-0.5 rounded-md">
                    {selectedItem.category}
                  </span>
                  <span className="text-xs text-[#7A6B5D]">
                    {selectedItem.season} · {selectedItem.style}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#2C241E]">
                  {selectedItem.name}
                </h3>
                <div className="text-xs text-[#8A7B6B]">
                  색상: {selectedItem.color} · 브랜드: {selectedItem.brand || '소장품'}
                </div>
              </div>

              {/* Garment Image Preview Inside the Diary Note */}
              <div className="aspect-4/3 bg-white rounded-2xl border border-[#ECE5DB] p-4 flex items-center justify-center relative overflow-hidden">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_8px_rgba(40,30,20,0.12)]"
                />
                <span className="absolute bottom-2.5 right-2.5 text-[10px] text-[#9A8C7E] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#EBE3D7]">
                  등록일: {selectedItem.addedAt}
                </span>
              </div>

              {/* USER'S PERSONAL DIARY MEMO (나의 코디 메모) */}
              <div className="p-4 bg-[#FAF8F4] rounded-2xl border border-[#ECE5DB] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#4A3B2F] flex items-center gap-1">
                    <span>✏️ 나의 코디 메모</span>
                  </span>
                  {!isEditingMemo && onUpdateItemMemo && (
                    <button
                      onClick={handleStartEditMemo}
                      className="text-xs text-[#7A6B5D] hover:text-[#2C241E] font-medium flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>메모 편집</span>
                    </button>
                  )}
                </div>

                {isEditingMemo ? (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={editedMemoText}
                      onChange={(e) => setEditedMemoText(e.target.value)}
                      placeholder="이 옷에 대한 나만의 코디 팁이나 기억을 남겨보세요..."
                      className="w-full p-2.5 bg-white border border-[#DDD5C9] rounded-xl text-xs text-[#2C241E] focus:outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditingMemo(false)}
                        className="px-2.5 py-1 text-xs text-[#7A6B5D] hover:text-[#2C241E]"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleSaveMemo}
                        className="px-3 py-1 bg-[#3B2F25] text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>저장하기</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#3E3228] leading-relaxed">
                    {selectedItem.memo || '작성된 코디 메모가 없습니다. [메모 편집]을 눌러 메모를 남겨보세요.'}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onGoToCoordinatorWithItem(selectedItem)}
                  className="flex-1 py-2.5 px-3 bg-[#3B2F25] hover:bg-[#281F17] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E6C687]" />
                  <span>AI 코디 조합 분석</span>
                </button>
                <button
                  onClick={() => onDeleteItem(selectedItem.id)}
                  className="p-2.5 text-[#9E8E80] hover:text-[#C24134] rounded-xl hover:bg-[#FAF4F2] transition-colors border border-[#E8E1D5]"
                  title="옷걸이에서 삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#FFFDF9] border border-[#E5DDD2] rounded-3xl p-8 text-center text-xs text-[#8A7B6B] space-y-2">
              <Paperclip className="w-6 h-6 mx-auto opacity-40" />
              <p className="font-semibold text-sm text-[#4A3B2F]">선택된 의류가 없습니다</p>
              <p>왼쪽 행거에서 옷을 선택하면 상세 정보와 다이어리 메모가 나타납니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
