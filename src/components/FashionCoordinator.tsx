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
    preSelectedClosetItem ? preSelectedClosetItem.name : '메리노울 하프집업 니트'
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
    personalColorVerdict: `${user.personalColor}인 ${user.name}님의 피부톤에 따뜻하게 어우러지며 안색을 생기있게 돋보이게 해주는 색상입니다.`,
    bodyTypeAdvice: `${user.bodyType} 체형의 상체 라인을 부드럽게 감싸주어 어깨선이 안정적이고 비율이 좋아 보입니다.`,
    recommendedCombinations: [
      {
        pairingItem: '스마트 옷장의 생지 데님 팬츠 (인디고)',
        styleTip: '따뜻한 오트밀과 딥 인디고의 조화로 단정한 캠퍼스 룩을 연출합니다.',
      },
      {
        pairingItem: '스마트 옷장의 카멜 베이지 워크 셔켓',
        styleTip: '톤온톤 아우터를 가볍게 걸쳐 편안한 레이어드를 완성하세요.',
      },
    ],
    dominantColor: '오트밀 베이지',
    stylingKeywords: ['톤온톤', '편안한 실루엣'],
  });

  // Sample clothing presets for immediate 1-click test
  const samplePresets: Array<{ title: string; category: GarmentCategory; image: string }> = [
    {
      title: '메리노울 하프집업 (오트밀)',
      category: '상의',
      image: '/src/assets/images/wardrobe_hanger_wood_1790992705475.jpg',
    },
    {
      title: '캔버스 워크 셔켓 (카멜)',
      category: '아우터',
      image: '/src/assets/images/atelier_hero_sketchbook_1790992692082.jpg',
    },
    {
      title: '드레이프 슬랙스 (모카 브라운)',
      category: '하의',
      image: '/src/assets/images/fashion_shopping_collection_1790992729115.jpg',
    },
    {
      title: '레더 메신저백 (체스트넛)',
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
        setAnalysisResult({
          personalColorVerdict: resData.data.personalColorVerdict,
          bodyTypeAdvice: resData.data.bodyTypeAdvice,
          recommendedCombinations: resData.data.recommendedCombinations || [],
          dominantColor: resData.data.dominantColor || '뉴트럴 톤',
          stylingKeywords: resData.data.stylingKeywords || [],
        });
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
      category: testCategory,
      color: analysisResult?.dominantColor || '뉴트럴 톤',
      season: '사계절',
      style: user.preferredStyles[0] || '미니멀',
      imageUrl: selectedImagePreview,
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D7] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2C241E]">
            패션 코디네이터
          </h1>
          <p className="text-xs text-[#7A6B5D] mt-0.5">
            옷 사진을 찍으면 내 피부색과 체형에 어울리는지 판별하고 스마트 옷장과의 코디를 제안합니다.
          </p>
        </div>

        {/* User Style Info Pill */}
        <div className="flex items-center gap-3 text-xs bg-[#F5F2EB] px-3.5 py-2 rounded-xl border border-[#E0D7CB] text-[#5E4C3D]">
          <span>내 프로필: <strong className="text-[#2C241E]">{user.personalColor}</strong> · <strong className="text-[#2C241E]">{user.bodyType}</strong></span>
        </div>
      </div>

      {/* Core Feature: Interactive Garment Photo Harmony Test */}
      <section className="space-y-6">
        <div className="border-b border-[#E8DDCE] pb-4">
          <h2 className="text-xl font-serif font-bold text-[#2A1F18]">
            옷 사진 어울림 판별 & 옷장 코디 제안
          </h2>
          <p className="text-xs text-[#6B5747] mt-0.5">
            카메라로 찍거나 앨범에서 사진을 업로드해 어울림을 확인하고, 스마트 옷장에 바로 저장할 수 있습니다.
          </p>
        </div>

        {/* Quick Sample Presets (Sticker style) */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#443327]">샘플 옷 스티커 선택:</span>
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
                className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  selectedImagePreview === preset.image
                    ? 'bg-[#382A21] text-[#FAF6F0] border-[#382A21] shadow-sm'
                    : 'bg-white/90 hover:bg-white text-[#2C211A] border-[#D5C6B5]'
                }`}
              >
                <img
                  src={preset.image}
                  alt={preset.title}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 object-contain bg-white rounded p-0.5"
                />
                <div className="overflow-hidden">
                  <div className="text-[10px] opacity-75">{preset.category}</div>
                  <div className="text-xs font-bold truncate">{preset.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input and Photo Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Garment Image Preview as Unpeeled Sticker */}
          <div className="lg:col-span-5 space-y-4">
            <div className="sticker-outline-slot">
              <div className="sticker-item-card relative aspect-4/3 bg-white p-4 flex items-center justify-center overflow-hidden">
                <div className="sticker-peel-cue" />
                {selectedImagePreview ? (
                  <img
                    src={selectedImagePreview}
                    alt="분석 대상 의류"
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.14)]"
                  />
                ) : (
                  <div className="text-center p-6 text-[#8C6D53] space-y-2">
                    <Camera className="w-10 h-10 mx-auto opacity-50" />
                    <p className="text-xs">사진을 업로드하거나 촬영해주세요</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Buttons */}
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#EDE5D8] hover:bg-[#DDD2C2] text-[#443327] rounded-xl text-xs font-semibold cursor-pointer border border-[#DACDBD] transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>사진 촬영/업로드</span>
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
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#382A21] hover:bg-[#201712] text-[#FAF6F0] rounded-xl text-xs font-semibold transition-all disabled:opacity-50 shadow-sm"
              >
                <Sparkles className={`w-3.5 h-3.5 text-[#DEB887] ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? '판별 중...' : '어울림 판별'}</span>
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

          {/* Right: AI Analysis (Qualitative only - No percentage score) */}
          <div className="lg:col-span-7 space-y-5">
            {analysisResult && (
              <div className="bg-white rounded-2xl border border-[#DFD3C3] p-5 sm:p-6 pencil-shadow space-y-5">
                <div className="border-b border-[#F0E6D8] pb-3">
                  <span className="text-xs font-semibold text-[#8C6D53]">
                    AI 어울림 판별 결과
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#2A1F18]">
                    {testGarmentTitle}
                  </h3>
                </div>

                {/* 1. Personal Color Verdict */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#35251C]">
                    <Palette className="w-3.5 h-3.5 text-[#A87A40]" />
                    <span>내 피부색({user.personalColor}) 어울림</span>
                  </div>
                  <p className="text-xs text-[#5C4A3C] leading-relaxed bg-[#FAF6F0] p-3 rounded-xl border border-[#E8DDCE]">
                    {analysisResult.personalColorVerdict}
                  </p>
                </div>

                {/* 2. Body Silhouette Advice */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#35251C]">
                    <UserCheck className="w-3.5 h-3.5 text-[#A87A40]" />
                    <span>내 체형({user.bodyType}) 맞춤 스타일링</span>
                  </div>
                  <p className="text-xs text-[#5C4A3C] leading-relaxed bg-[#FAF6F0] p-3 rounded-xl border border-[#E8DDCE]">
                    {analysisResult.bodyTypeAdvice}
                  </p>
                </div>

                {/* 3. Pre-suggested Combinations with existing wardrobe items */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#35251C]">
                    <Layers className="w-3.5 h-3.5 text-[#A87A40]" />
                    <span>내 스마트 옷장 옷과의 추천 코디 조합</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {analysisResult.recommendedCombinations.map((combo, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-[#F5EFE6] rounded-xl border border-[#DFD3C2] space-y-1 text-xs"
                      >
                        <div className="font-bold text-[#2A1F18] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#3D7847]" />
                          <span>{combo.pairingItem}</span>
                        </div>
                        <p className="text-[11px] text-[#6B5747] leading-relaxed">{combo.styleTip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action Buttons: Save to Closet or Search Shopping */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-[#F0E6D8]">
                  <button
                    onClick={handleRegisterThisToCloset}
                    className="w-full sm:flex-1 py-2.5 px-3 bg-[#382A21] hover:bg-[#201712] text-[#FAF6F0] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>스마트 옷장에 바로 저장</span>
                  </button>
                  <button
                    onClick={() => onGoToShopping(testGarmentTitle.split(' ')[0])}
                    className="w-full sm:flex-1 py-2.5 px-3 bg-[#EDE5D8] hover:bg-[#DDD2C2] text-[#443327] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#DACDBD]"
                  >
                    <span>추천 쇼핑 보기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
