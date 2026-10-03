import React, { useState } from 'react';
import { ClosetItem, DailyOutfitRecommendation, GarmentCategory, Season, UserProfile } from '../types';
import { CloudSun, Sparkles, Filter, Search, Plus, Shirt, ArrowRight, RefreshCw, CheckCircle2, Trash2 } from 'lucide-react';

interface SmartClosetProps {
  closetItems: ClosetItem[];
  user: UserProfile;
  onOpenAddModal: () => void;
  onGoToShopping: (searchKeyword?: string) => void;
  onGoToCoordinatorWithItem: (item: ClosetItem) => void;
  onDeleteItem: (id: string) => void;
}

export const SmartCloset: React.FC<SmartClosetProps> = ({
  closetItems,
  user,
  onOpenAddModal,
  onGoToShopping,
  onGoToCoordinatorWithItem,
  onDeleteItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedSeason, setSelectedSeason] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');

  // Daily Outfit Weather & Occasion State
  const [weatherTemp, setWeatherTemp] = useState<number>(19);
  const [weatherCondition, setWeatherCondition] = useState<string>('약간 쌀쌀하고 맑음');
  const [occasion, setOccasion] = useState<string>('캠퍼스 강의 & 도서관 스터디');
  const [isGeneratingDaily, setIsGeneratingDaily] = useState(false);
  const [dailyOutfit, setDailyOutfit] = useState<DailyOutfitRecommendation | null>({
    outfitTitle: '스케치북 감성의 캠퍼스 아틀리에 룩',
    temperatureSummary: '낮 최고 19℃로 활동하기 쾌적하며, 늦은 오후 쌀쌀한 바람을 대비한 가벼운 셔켓 레이어드 조합입니다.',
    topItem: '릴렉스 옥스포드 코튼 셔츠 (오프화이트)',
    bottomItem: '테이퍼드 생지 데님 팬츠 (인디고)',
    outerItem: '헤비 캔버스 워크 셔켓 (카멜 베이지)',
    shoesAndAccessories: '스웨이드 샌드 독일군 스니커즈',
    coordinatorTip: '셔츠 소매를 1단 무심하게 걷어올리고 셔켓 단추는 오픈하여 자연스러운 실루엣을 연출하세요.',
    synergyScore: 97,
  });

  // Wardrobe Gap State
  const [isAnalyzingGap, setIsAnalyzingGap] = useState(false);
  const [gapAnalysis, setGapAnalysis] = useState<{
    summary: string;
    suggestedAdditions: Array<{ category: string; name: string; reason: string; matchPotentialScore: number }>;
  } | null>({
    summary: `현재 등록된 ${closetItems.length}벌의 옷장을 분석한 결과, 캐주얼 상의와 데님 하의의 기본기는 탄탄하지만, 일교차가 큰 계절용 니트 레이어드 피스와 포멀한 모카 슬랙스가 보강되면 코디 조합이 2.5배 늘어납니다.`,
    suggestedAdditions: [
      {
        category: '상의/니트',
        name: '소프트 메리노울 하프집업 니트 (오트밀)',
        reason: '보유 중인 옥스포드 셔츠 위에 레이어드하거나 단독 착용하여 가을 웜톤의 따뜻함을 극대화할 수 있습니다.',
        matchPotentialScore: 98,
      },
      {
        category: '하의/슬랙스',
        name: '원턱 세미와이드 드레이프 슬랙스 (모카 브라운)',
        reason: '데님 중심의 하의에 차분한 브라운 슬랙스를 더해 격식 있는 자리까지 완벽 커버합니다.',
        matchPotentialScore: 94,
      },
    ],
  });

  // Handle Generate Daily Outfit
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
      console.warn('API error, using fallback:', e);
    } finally {
      setIsGeneratingDaily(false);
    }
  };

  // Filter items
  const filteredItems = closetItems.filter((item) => {
    const matchesCategory = selectedCategory === '전체' || item.category === selectedCategory;
    const matchesSeason =
      selectedSeason === '전체' || item.season === '사계절' || item.season === selectedSeason;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSeason && matchesSearch;
  });

  const categories: string[] = ['전체', '상의', '하의', '아우터', '신발', '악세사리'];
  const seasons: string[] = ['전체', '봄', '여름', '가을', '겨울'];

  return (
    <div className="space-y-10">
      {/* Top Hero: Atelier Sketchbook Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-[#F5EFE6] border border-[#DFCFC0] pencil-shadow p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6D53]">
              <span>스마트 옷장 아카이브</span>
              <span>·</span>
              <span>총 {closetItems.length}벌 보관 중</span>
              <span>·</span>
              <span>{user.personalColor} 맞춤 분석</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A1F18] leading-snug">
              {user.name}님의 아틀리에 옷장
            </h1>
            <p className="text-sm text-[#5C493B] leading-relaxed">
              옷을 스마트폰으로 간편하게 기록하고 관리해보세요. 오늘 날씨와 하루 일정에 맞춘 인공지능 코디부터,
              내 옷장 속 옷들과 찰떡인 쇼핑 아이템 제안까지 하나로 연결됩니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#382A21] hover:bg-[#251B15] text-[#FAF6F0] rounded-xl text-sm font-medium transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>새 옷 등록하기</span>
            </button>
            <button
              onClick={() => onGoToShopping()}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#EAE1D3] hover:bg-[#DDD2C2] text-[#443327] rounded-xl text-sm font-medium transition-all border border-[#CFBFAC]"
            >
              <span>어울리는 쇼핑 탐색</span>
              <ArrowRight className="w-4 h-4 text-[#8C6D53]" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature 1: Weather & Schedule Daily Outfit Recommender */}
      <section className="bg-sketch-paper rounded-2xl border border-[#DECFC0] p-6 sm:p-8 pencil-shadow space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#E8DDCE] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#443327] text-[#FAF6F0] flex items-center justify-center shrink-0">
              <CloudSun className="w-5 h-5 text-[#DEB887]" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#2C211A]">
                오늘의 날씨 & 일정 맞춤 AI 코디
              </h2>
              <p className="text-xs text-[#6B5747]">
                현재 옷장 데이터를 분석하여 기온과 상황에 최적화된 착장을 스케치합니다.
              </p>
            </div>
          </div>

          {/* Quick Context Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#EFE7DA] px-3 py-1.5 rounded-lg border border-[#DFCFC0] text-xs">
              <span className="text-[#7A6350] font-medium">기온:</span>
              <select
                aria-label="오늘의 기온 선택"
                value={weatherTemp}
                onChange={(e) => setWeatherTemp(Number(e.target.value))}
                className="bg-transparent font-semibold text-[#2D211A] focus:outline-none cursor-pointer"
              >
                <option value={12}>12℃ 쌀쌀함</option>
                <option value={15}>15℃ 선선함</option>
                <option value={19}>19℃ 쾌적함</option>
                <option value={24}>24℃ 포근함</option>
                <option value={28}>28℃ 더움</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-[#EFE7DA] px-3 py-1.5 rounded-lg border border-[#DFCFC0] text-xs">
              <span className="text-[#7A6350] font-medium">상황:</span>
              <select
                aria-label="오늘의 일정 및 상황 선택"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="bg-transparent font-semibold text-[#2D211A] focus:outline-none cursor-pointer max-w-[150px] truncate"
              >
                <option value="캠퍼스 강의 & 도서관 스터디">캠퍼스 강의/스터디</option>
                <option value="주말 분위기 있는 데이트">주말 데이트</option>
                <option value="팀 프로젝트 과제 발표">팀 과제 발표</option>
                <option value="친구들과 캐주얼 모임">친구들과 약속</option>
                <option value="단정한 인턴/알바 면접">면접/격식있는 자리</option>
              </select>
            </div>

            <button
              onClick={handleGenerateDaily}
              disabled={isGeneratingDaily}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#4A3B30] hover:bg-[#34271E] text-[#FAF6F0] rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingDaily ? 'animate-spin' : ''}`} />
              <span>{isGeneratingDaily ? '분석 중...' : '코디 새로고침'}</span>
            </button>
          </div>
        </div>

        {dailyOutfit && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#7C634F]">AI 추천 착장 타이틀</span>
                <span className="text-xs font-semibold text-[#443327] bg-[#EAE0D1] px-2.5 py-0.5 rounded-full border border-[#D5C6B5]">
                  옷장 조화율 {dailyOutfit.synergyScore}%
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#2A1F18]">
                {dailyOutfit.outfitTitle}
              </h3>
              <p className="text-sm text-[#5C4A3C] leading-relaxed">
                {dailyOutfit.temperatureSummary}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-[#F4EFE6] rounded-xl border border-[#DFD3C3] space-y-1">
                  <span className="text-[11px] font-medium text-[#8C6D53]">상의 (Top)</span>
                  <p className="text-xs font-semibold text-[#2C211A] leading-tight">
                    {dailyOutfit.topItem}
                  </p>
                </div>
                <div className="p-3 bg-[#F4EFE6] rounded-xl border border-[#DFD3C3] space-y-1">
                  <span className="text-[11px] font-medium text-[#8C6D53]">하의 (Bottom)</span>
                  <p className="text-xs font-semibold text-[#2C211A] leading-tight">
                    {dailyOutfit.bottomItem}
                  </p>
                </div>
                <div className="p-3 bg-[#F4EFE6] rounded-xl border border-[#DFD3C3] space-y-1">
                  <span className="text-[11px] font-medium text-[#8C6D53]">아우터 (Outer)</span>
                  <p className="text-xs font-semibold text-[#2C211A] leading-tight">
                    {dailyOutfit.outerItem || '날씨에 맞게 생략'}
                  </p>
                </div>
                <div className="p-3 bg-[#F4EFE6] rounded-xl border border-[#DFD3C3] space-y-1">
                  <span className="text-[11px] font-medium text-[#8C6D53]">신발/소품</span>
                  <p className="text-xs font-semibold text-[#2C211A] leading-tight">
                    {dailyOutfit.shoesAndAccessories}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#EDE5D8] rounded-xl p-5 border border-[#DACDBD] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#443327]">
                  <Sparkles className="w-4 h-4 text-[#A7793D]" />
                  <span>아틀리에 스타일리스트 팁</span>
                </div>
                <p className="text-xs text-[#523F30] leading-relaxed">
                  "{dailyOutfit.coordinatorTip}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#DECFC0] flex items-center justify-between text-xs text-[#7A6350]">
                <span>오늘 착용 시 옷장 기록 반영</span>
                <span className="font-semibold text-[#382A21]">착용 횟수 +1</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Feature 2: Smart Wardrobe Gap & Shopping Synergy Analysis */}
      {gapAnalysis && (
        <section className="bg-[#FAF5EC] rounded-2xl border border-[#E0D3C3] p-6 sm:p-7 pencil-shadow">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#E8DDCE] pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D53]">
                  Wardrobe Analysis
                </span>
                <span className="text-xs bg-[#E4D7C7] text-[#443327] px-2 py-0.5 rounded font-medium">
                  스마트 옷장 분석
                </span>
              </div>
              <h2 className="text-lg font-serif font-bold text-[#2A1F18]">
                내 옷장의 빈틈 채우기 & 쇼핑 제안
              </h2>
            </div>
            <button
              onClick={() => onGoToShopping()}
              className="text-xs font-semibold text-[#443327] hover:text-[#1F150F] flex items-center gap-1 group"
            >
              <span>스마트 쇼핑 전체보기</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-[#5C4A3C] mt-3 mb-5 leading-relaxed">
            {gapAnalysis.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gapAnalysis.suggestedAdditions.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/80 rounded-xl p-4 border border-[#E3D6C5] flex items-start justify-between gap-3 hover:border-[#BFA890] transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#8C6D53]">{item.category}</span>
                    <span className="text-[11px] text-[#3D7847] font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> 매칭 잠재력 {item.matchPotentialScore}%
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#2C211A]">{item.name}</h4>
                  <p className="text-xs text-[#6B5747] leading-relaxed">{item.reason}</p>
                </div>
                <button
                  onClick={() => onGoToShopping(item.name.split(' ')[1] || item.name)}
                  className="shrink-0 px-3 py-1.5 bg-[#443327] hover:bg-[#2C2017] text-[#FAF6F0] rounded-lg text-xs font-medium transition-colors"
                >
                  제안 보기
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Feature 3: Clothing Catalog Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#2A1F18]">
              보유 의류 목록 ({filteredItems.length}벌)
            </h2>
            <p className="text-xs text-[#7A6350]">
              원하는 옷을 선택해 AI 어울림 판별이나 데일리 코디를 연계해보세요.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#8C6D53] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="옷 이름, 색상, 브랜드 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F5EFE6] border border-[#DFCFC0] rounded-xl text-xs text-[#2A1F18] placeholder-[#9E8B7A] focus:outline-none focus:border-[#4A3B30]"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1 bg-[#EFE8DC] p-1 rounded-xl border border-[#DFD3C3]">
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

          <div className="flex items-center gap-1 bg-[#EFE8DC] p-1 rounded-xl border border-[#DFD3C3]">
            {seasons.map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedSeason === season
                    ? 'bg-[#382A21] text-[#FAF6F0] shadow-sm'
                    : 'text-[#6B5747] hover:text-[#2C211A]'
                }`}
              >
                {season}
              </button>
            ))}
          </div>
        </div>

        {/* Garment Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-[#FAF7F2] rounded-2xl border border-dashed border-[#CFBFAC] p-12 text-center space-y-3">
            <Shirt className="w-10 h-10 text-[#8C6D53] mx-auto opacity-60" />
            <h4 className="text-base font-serif font-bold text-[#3B2C21]">
              조건에 맞는 옷이 없습니다
            </h4>
            <p className="text-xs text-[#7A6350] max-w-sm mx-auto">
              다른 필터를 선택하시거나 사진을 찍어 새로운 옷을 스마트 옷장에 등록해보세요.
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#443327] hover:bg-[#2C2017] text-[#FAF6F0] rounded-xl text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>새 옷 등록하기</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-[#DFD3C3] overflow-hidden pencil-shadow flex flex-col justify-between hover:border-[#9A7F66] transition-all"
              >
                <div>
                  <div className="relative aspect-4/3 bg-[#F4EFE6] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-[#2D211A]/80 backdrop-blur-sm text-[#FAF6F0] text-[11px] px-2.5 py-1 rounded-md font-medium">
                      {item.category} · {item.season}
                    </div>
                    {item.matchingScoreWithUser && (
                      <div className="absolute top-3 right-3 bg-[#EAD5B8] text-[#3A2A1E] text-[11px] px-2 py-0.5 rounded font-bold border border-[#C6A98A]">
                        어울림 {item.matchingScoreWithUser}%
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#8C6D53]">
                      <span>{item.brand || 'ATELIER COLLECTION'}</span>
                      <span>착용 {item.wearCount}회</span>
                    </div>
                    <h3 className="text-base font-serif font-bold text-[#2A1F18] group-hover:text-[#684C35] transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#6B5747] line-clamp-2 leading-relaxed">
                      {item.notes || `${item.color} 색상의 ${item.style} 스타일 아이템입니다.`}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#F2ECE2] mt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onGoToCoordinatorWithItem(item)}
                    className="flex-1 py-2 px-3 bg-[#EFE8DC] hover:bg-[#E2D5C3] text-[#382A21] rounded-xl text-xs font-semibold transition-colors text-center"
                  >
                    AI 코디 조합 분석
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-2 text-[#A8907E] hover:text-[#A8382A] rounded-xl hover:bg-[#FBEBE8] transition-colors"
                    title="옷장에서 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
