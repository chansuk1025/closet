import React, { useState } from 'react';
import { ClosetItem, GarmentCategory, PhotoAnalysisResult, UserProfile } from '../types';
import { Camera, Sparkles, Upload, CheckCircle2, ArrowRight, Palette, UserCheck, Layers, Plus } from 'lucide-react';

interface FashionCoordinatorProps {
  user: UserProfile;
  closetItems: ClosetItem[];
  onAddAnalyzedGarmentToCloset: (item: Partial<ClosetItem>) => void;
  onGoToShopping: (searchKeyword?: string) => void;
  preSelectedClosetItem?: ClosetItem | null;
}

export const FashionCoordinator: React.FC<FashionCoordinatorProps> = ({
  user,
  closetItems,
  onAddAnalyzedGarmentToCloset,
  onGoToShopping,
  preSelectedClosetItem,
}) => {
  const [testGarmentTitle, setTestGarmentTitle] = useState(
    preSelectedClosetItem ? preSelectedClosetItem.name : '오트밀 울 케이블 니트'
  );
  const [testCategory, setTestCategory] = useState<GarmentCategory>(
    preSelectedClosetItem ? preSelectedClosetItem.category : '상의'
  );
  const [selectedImagePreview, setSelectedImagePreview] = useState<string>(
    preSelectedClosetItem
      ? preSelectedClosetItem.imageUrl
      : '/src/assets/images/wardrobe_hanger_wood_1790992705475.jpg'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PhotoAnalysisResult | null>({
    harmonyScore: 94,
    personalColorVerdict: `${user.personalColor}인 ${user.name}님의 피부톤에 따뜻한 온기를 자연스럽게 더해주며, 차분한 채도로 안색을 균일하고 생기있게 돋보이게 합니다.`,
    bodyTypeAdvice: `${user.bodyType} 체형의 상체 라인을 부드럽게 감싸주어 어깨선이 자연스럽게 연출되고 다리 비율이 길어 보이는 시각적 효과를 줍니다.`,
    recommendedCombinations: [
      {
        pairingItem: '스마트 옷장의 생지 데님 팬츠 (인디고)',
        styleTip: '오트밀의 따뜻한 베이지와 딥 인디고의 청량한 대비로 실패 없는 클래식 캠퍼스 룩을 연출합니다.',
      },
      {
        pairingItem: '스마트 옷장의 카멜 베이지 워크 셔켓',
        styleTip: '톤온톤 아우터를 가볍게 걸쳐 스케치북 아틀리에 감성의 깊이감 있는 레이어드를 완성하세요.',
      },
    ],
    dominantColor: '웜 오트밀 & 샌드 베이지',
    stylingKeywords: ['소프트 어번', '톤온톤 레이어드', '편안한 실루엣'],
    overallComment:
      '현재 보유하신 스마트 옷장 아이템들과의 호환성이 95% 이상으로 높아, 일주일에 3회 이상 손이 갈 핵심 에센셜 아이템입니다.',
  });

  // Sample clothing presets for immediate 1-click test
  const samplePresets: Array<{ title: string; category: GarmentCategory; image: string }> = [
    {
      title: '소프트 메리노울 하프집업 (오트밀)',
      category: '상의',
      image: '/src/assets/images/wardrobe_hanger_wood_1790992705475.jpg',
    },
    {
      title: '헤비 캔버스 워크 셔켓 (카멜)',
      category: '아우터',
      image: '/src/assets/images/atelier_hero_sketchbook_1790992692082.jpg',
    },
    {
      title: '원턱 세미와이드 슬랙스 (모카 브라운)',
      category: '하의',
      image: '/src/assets/images/fashion_shopping_collection_1790992729115.jpg',
    },
    {
      title: '천연 소가죽 메신저백 (체스트넛)',
      category: '악세사리',
      image: '/src/assets/images/fashion_personal_color_palette_1790992717080.jpg',
    },
  ];

  // Handle local image upload via file input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImagePreview(reader.result as string);
        setTestGarmentTitle(file.name.replace(/\.[^/.]+$/, ''));
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Analysis
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/gemini/analyze-garment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImagePreview,
          garmentTitle: testGarmentTitle,
          category: testCategory,
          userProfile: user,
          closetItems,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setAnalysisResult(resData.data);
      }
    } catch (e) {
      console.warn('API error in coordinator:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRegisterThisToCloset = () => {
    onAddAnalyzedGarmentToCloset({
      name: testGarmentTitle,
      category: testCategory as any,
      color: analysisResult?.dominantColor || '뉴트럴 톤',
      season: '사계절',
      style: user.preferredStyles[0] || '미니멀',
      imageUrl: selectedImagePreview,
      notes: analysisResult?.overallComment || 'AI 패션 코디네이터 진단 등록 아이템',
      matchingScoreWithUser: analysisResult?.harmonyScore || 90,
    });
  };

  return (
    <div className="space-y-10">
      {/* Top Banner: Coordinator Overview */}
      <section className="bg-[#FAF5EC] rounded-2xl border border-[#DECFC0] p-6 sm:p-8 pencil-shadow">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6D53]">
              <span>AI 패션 스타일리스트 & 코디네이터</span>
              <span>·</span>
              <span>체형 및 퍼스널컬러 진단 연동</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A1F18]">
              사진 한 장으로 알아보는 나만의 맞춤 스타일링
            </h1>
            <p className="text-sm text-[#5C4A3C] leading-relaxed">
              사고 싶은 옷이나 옷장에 넣을 옷 사진을 찍어보세요. AI가 {user.name}님의 피부톤(
              {user.personalColor})과 체형({user.bodyType})에 어울리는지 판별하고, 이미 옷장에 있는
              옷들과의 환상적인 조합을 제안합니다.
            </p>
          </div>

          {/* User Style Blueprint Pill Card */}
          <div className="p-4 bg-[#EDE5D8] rounded-xl border border-[#DACDBD] text-xs space-y-2 max-w-sm w-full">
            <div className="flex items-center justify-between font-bold text-[#35251C]">
              <span className="flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#A87A40]" />
                {user.name}님의 스타일 DNA
              </span>
              <span className="text-[#8C6D53]">{user.height}cm</span>
            </div>
            <div className="text-[11px] text-[#634E3E] space-y-1">
              <div>· 퍼스널컬러: <span className="font-semibold text-[#2A1F18]">{user.personalColor}</span></div>
              <div>· 체형 실루엣: <span className="font-semibold text-[#2A1F18]">{user.bodyType}</span></div>
              <div>· 추구 스타일: <span className="font-semibold text-[#2A1F18]">{user.preferredStyles.join(', ')}</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Feature: Interactive Garment Photo Harmony Test */}
      <section className="bg-sketch-paper rounded-2xl border border-[#DECFC0] p-6 sm:p-8 pencil-shadow space-y-8">
        <div className="border-b border-[#E8DDCE] pb-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6D53]">
            <span>Photo Compatibility & Outfit Synthesizer</span>
          </div>
          <h2 className="text-xl font-serif font-bold text-[#2A1F18] mt-1">
            옷 사진 판별 & 코디 조합 제안기
          </h2>
          <p className="text-xs text-[#6B5747]">
            실제 카메라로 촬영하거나 앨범에서 사진을 업로드하세요. 아래 샘플 옷을 눌러 바로 진단해볼 수도 있습니다.
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#443327]">빠른 테스트용 샘플 의류 선택:</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedImagePreview(preset.image);
                  setTestGarmentTitle(preset.title);
                  setTestCategory(preset.category);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  selectedImagePreview === preset.image
                    ? 'bg-[#382A21] text-[#FAF6F0] border-[#382A21] shadow-sm'
                    : 'bg-white/80 hover:bg-white text-[#2C211A] border-[#D5C6B5]'
                }`}
              >
                <img
                  src={preset.image}
                  alt={preset.title}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 object-cover rounded-lg shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="text-[10px] opacity-75 truncate">{preset.category}</div>
                  <div className="text-xs font-bold truncate">{preset.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input and Photo Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Garment Image Preview and Upload Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-4/3 rounded-2xl bg-[#EFE8DC] border border-[#DFCFC0] overflow-hidden pencil-shadow flex items-center justify-center">
              {selectedImagePreview ? (
                <img
                  src={selectedImagePreview}
                  alt="분석 대상 의류"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-[#8C6D53] space-y-2">
                  <Camera className="w-10 h-10 mx-auto opacity-50" />
                  <p className="text-xs">사진을 업로드하거나 촬영해주세요</p>
                </div>
              )}
            </div>

            {/* Upload Buttons */}
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#EDE5D8] hover:bg-[#DDD2C2] text-[#443327] rounded-xl text-xs font-semibold cursor-pointer border border-[#DACDBD] transition-colors">
                <Upload className="w-4 h-4" />
                <span>내 사진 업로드</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#382A21] hover:bg-[#251B15] text-[#FAF6F0] rounded-xl text-xs font-semibold transition-all disabled:opacity-50 shadow-sm"
              >
                <Sparkles className={`w-4 h-4 text-[#DEB887] ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'AI 분석 중...' : 'AI 어울림 판별하기'}</span>
              </button>
            </div>

            {/* Garment Details inputs */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[#6B5747] font-medium block mb-1">의류 명칭</label>
                <input
                  type="text"
                  value={testGarmentTitle}
                  onChange={(e) => setTestGarmentTitle(e.target.value)}
                  className="w-full p-2 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18]"
                />
              </div>
              <div>
                <label className="text-[#6B5747] font-medium block mb-1">카테고리</label>
                <select
                  value={testCategory}
                  onChange={(e) => setTestCategory(e.target.value as GarmentCategory)}
                  className="w-full p-2 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18]"
                >
                  <option value="상의">상의</option>
                  <option value="하의">하의</option>
                  <option value="아우터">아우터</option>
                  <option value="신발">신발</option>
                  <option value="악세사리">악세사리</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right: AI Analysis Breakdown */}
          <div className="lg:col-span-7 space-y-6">
            {analysisResult && (
              <div className="bg-white rounded-2xl border border-[#DFD3C3] p-6 pencil-shadow space-y-6">
                {/* Score & Badge Lockup */}
                <div className="flex items-center justify-between border-b border-[#F0E6D8] pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-[#8C6D53]">
                      AI 패션 조화 분석 결과
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[#2A1F18]">
                      {testGarmentTitle}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-serif font-bold text-[#35251C] font-mono tabular-nums">
                      {analysisResult.harmonyScore}
                    </span>
                    <span className="text-xs text-[#8C6D53]"> / 100점</span>
                    <div className="text-[10px] text-[#3D7847] font-semibold">
                      최우수 매칭 등급
                    </div>
                  </div>
                </div>

                {/* 1. Personal Color Verdict */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#35251C]">
                    <Palette className="w-4 h-4 text-[#A87A40]" />
                    <span>피부색 & 퍼스널컬러({user.personalColor}) 어울림 판별</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5C4A3C] leading-relaxed bg-[#FAF6F0] p-3.5 rounded-xl border border-[#E8DDCE]">
                    {analysisResult.personalColorVerdict}
                  </p>
                </div>

                {/* 2. Body Silhouette Advice */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#35251C]">
                    <UserCheck className="w-4 h-4 text-[#A87A40]" />
                    <span>체형 실루엣({user.bodyType}) 피팅 진단</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5C4A3C] leading-relaxed bg-[#FAF6F0] p-3.5 rounded-xl border border-[#E8DDCE]">
                    {analysisResult.bodyTypeAdvice}
                  </p>
                </div>

                {/* 3. Pre-suggested Combinations with existing wardrobe items */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#35251C]">
                    <Layers className="w-4 h-4 text-[#A87A40]" />
                    <span>내 스마트 옷장과의 AI 코디 조합 미리보기</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {analysisResult.recommendedCombinations.map((combo, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-[#F5EFE6] rounded-xl border border-[#DFD3C2] space-y-1.5 text-xs"
                      >
                        <div className="font-bold text-[#2A1F18] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#3D7847]" />
                          <span>{combo.pairingItem}</span>
                        </div>
                        <p className="text-[#6B5747] leading-relaxed">{combo.styleTip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-[#F0E6D8]">
                  <button
                    onClick={handleRegisterThisToCloset}
                    className="w-full sm:flex-1 py-2.5 px-4 bg-[#382A21] hover:bg-[#251B15] text-[#FAF6F0] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>내 스마트 옷장에 바로 등록</span>
                  </button>
                  <button
                    onClick={() => onGoToShopping(testGarmentTitle.split(' ')[0])}
                    className="w-full sm:flex-1 py-2.5 px-4 bg-[#EDE5D8] hover:bg-[#DDD2C2] text-[#443327] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-[#DACDBD]"
                  >
                    <span>스마트 쇼핑에서 유사템 찾기</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
