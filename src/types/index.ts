export type GarmentCategory = '상의' | '하의' | '아우터' | '신발' | '악세사리';
export type Season = '봄' | '여름' | '가을' | '겨울' | '사계절';
export type PersonalColor = '봄 웜톤' | '여름 쿨톤' | '가을 웜톤' | '겨울 쿨톤';
export type BodyType = '직사각형 (슬림/보통)' | '역삼각형 (어깨 발달)' | '삼각형 (하체 중심)' | '웨이브 (부드러운 곡선)' | '스트레이트 (균형 체형)';
export type FashionStyle = '미니멀' | '시티보이' | '캐주얼' | '스트릿' | '아메카지' | '클래식/포멀' | '고프코어';

export interface ClosetItem {
  id: string;
  name: string;
  category: GarmentCategory;
  color: string;
  season: Season;
  style: FashionStyle;
  brand?: string;
  imageUrl: string;
  addedAt: string;
  wearCount: number;
  notes?: string;
  matchingScoreWithUser?: number;
}

export interface StoreItem {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: GarmentCategory;
  style: FashionStyle;
  personalColorMatch: PersonalColor[];
  image: string;
  stockCount: number;
  sizes: string[];
  colors: string[];
  description: string;
  wardrobeSynergy: {
    recommendedWithClosetId?: string;
    synergyReason: string;
    synergyScore: number;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  gender: '남성' | '여성' | '선택안함';
  height: number; // cm
  weight?: number; // kg
  bodyType: BodyType;
  personalColor: PersonalColor;
  preferredStyles: FashionStyle[];
  avatarUrl?: string;
  bio?: string;
}

export interface OrderTimelineStep {
  stage: string;
  time: string;
  title: string;
  desc: string;
  completed: boolean;
}

export interface OrderItem {
  orderId: string;
  createdAt: string;
  item: {
    id: string;
    title: string;
    brand: string;
    price: number;
    image: string;
    size: string;
    color: string;
  };
  quantity: number;
  buyer: {
    name: string;
    phone: string;
    address: string;
  };
  payment: {
    method: string;
    subtotal: number;
    platformFee: number;
    totalPrice: number;
    status: 'PAID';
  };
  status: 'ORDER_PLACED' | 'HEADQUARTER_CONFIRMED' | 'PACKING' | 'IN_TRANSIT' | 'DELIVERED';
  dispatchTimeline: OrderTimelineStep[];
}

export interface DailyOutfitRecommendation {
  outfitTitle: string;
  temperatureSummary: string;
  topItem: string;
  bottomItem: string;
  outerItem?: string;
  shoesAndAccessories?: string;
  coordinatorTip: string;
  synergyScore: number;
}

export interface PhotoAnalysisResult {
  harmonyScore: number;
  personalColorVerdict: string;
  bodyTypeAdvice: string;
  recommendedCombinations: Array<{
    pairingItem: string;
    styleTip: string;
  }>;
  dominantColor: string;
  stylingKeywords: string[];
  overallComment: string;
}
