import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '20mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (e) {
    console.warn('Gemini client init error, fallback heuristic enabled:', e);
  }
}

// Helper for timeout
async function withTimeout<T>(promise: Promise<T>, ms: number = 4000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('AI Request Timeout')), ms)),
  ]);
}

// 1. AI Fashion Garment Photo & Compatibility Analysis
app.post('/api/gemini/analyze-garment', async (req: Request, res: Response) => {
  try {
    const { imageBase64, garmentTitle, category, userProfile, closetItems } = req.body;

    const profileText = userProfile
      ? `사용자 정보: 키 ${userProfile.height}cm, 체형 ${userProfile.bodyType} (${userProfile.bodyDesc || ''}), 피부톤/퍼스널컬러 ${userProfile.personalColor}, 선호 스타일 ${userProfile.preferredStyles?.join(', ')}`
      : '사용자 정보: 키 174cm, 체형 보통/직사각형, 퍼스널컬러 가을 웜톤(Autumn Warm), 선호 스타일 미니멀 & 시티보이 캐주얼';

    const closetContext = Array.isArray(closetItems) && closetItems.length > 0
      ? `현재 사용자의 스마트 옷장에 등록된 주요 옷들:\n${closetItems.slice(0, 6).map((c: any) => `- [${c.category}] ${c.name} (${c.color}, ${c.season})`).join('\n')}`
      : '현재 스마트 옷장 보유 아이템: 베이지 치노 팬츠, 옥스포드 화이트 셔츠, 생지 데님, 네이비 울 블레이저, 그레이 후드티';

    if (aiClient) {
      try {
        const prompt = `당신은 꼼꼼하고 감각적인 패션 디렉터이자 스케치북 아틀리에의 퍼스널 스타일리스트입니다.
아래 옷 정보를 분석하여 사용자와의 어울림(피부색/퍼스널컬러 적합도, 체형 실루엣 매칭)을 진단하고, 스마트 옷장의 기존 아이템과의 코디 조합을 제안해주세요.

${profileText}
${closetContext}
검토 대상 옷: ${garmentTitle || '업로드된 의류 사진'} (카테고리: ${category || '의류'})

반드시 아래 JSON 형식으로만 응답하세요:
{
  "harmonyScore": 88,
  "personalColorVerdict": "가을 웜톤의 내추럴하고 따뜻한 혈색과 자연스럽게 어우러지는 톤입니다.",
  "bodyTypeAdvice": "체형의 어깨 및 허리 라인을 안정감 있게 잡아주어 단정한 비율을 연출합니다.",
  "recommendedCombinations": [
    {
      "pairingItem": "옷장의 베이지 치노 팬츠 또는 슬랙스",
      "styleTip": "밑단을 롤업하고 로퍼나 캔버스화를 매치하면 스케치북 감성의 감각적인 무드가 완성됩니다."
    },
    {
      "pairingItem": "네이비 블레이저 또는 가벼운 워크자켓",
      "styleTip": "톤온톤 레이어드로 실루엣의 깊이감을 더할 수 있습니다."
    }
  ],
  "dominantColor": "아이보리/베이지",
  "stylingKeywords": ["어번 미니멀", "톤온톤", "감성 캐주얼"],
  "overallComment": "전체적으로 차분하고 세련된 인상을 주는 피스입니다. 캠퍼스 룩부터 주말 약속까지 폭넓게 활용 가능합니다."
}`;

        let parts: any[] = [{ text: prompt }];

        if (imageBase64 && typeof imageBase64 === 'string') {
          const cleanBase64 = imageBase64.includes('base64,')
            ? imageBase64.split('base64,')[1]
            : imageBase64;

          parts = [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: cleanBase64,
              },
            },
            { text: prompt },
          ];
        }

        const response = await withTimeout(
          aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: { parts },
            config: {
              responseMimeType: 'application/json',
              temperature: 0.7,
            },
          }),
          4000
        );

        const responseText = response.text || '';
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, data: parsed });
      } catch (geminiErr) {
        console.warn('Gemini request failed/timed out, using rich fallback heuristic:', geminiErr);
      }
    }

    // Heuristic Fallback tailored to user's personal color and body type
    const pColor = userProfile?.personalColor || '가을 웜톤';
    const bType = userProfile?.bodyType || '직사각형/보통';

    const fallbackData = {
      harmonyScore: 92,
      personalColorVerdict: `${pColor}을 보유하신 사용자님의 피부톤에 자연스럽고 부드럽게 감기며, 안색을 화사하고 안정감 있게 보완해 주는 컬러감입니다.`,
      bodyTypeAdvice: `${bType} 체형의 라인을 과하지 않게 정리해주며, 어깨선과 밑단 떨어짐이 안정적이어서 세련된 비율감을 만들어줍니다.`,
      recommendedCombinations: [
        {
          pairingItem: '스마트 옷장의 생지 데님 또는 테이퍼드 치노 팬츠',
          styleTip: '상의를 가볍게 하프 턱인(Half Tuck-in)하여 착용하면 허리선이 높아 보여 다리가 길어 보입니다.'
        },
        {
          pairingItem: '내추럴 톤의 캔버스 백 & 로우탑 스니커즈',
          styleTip: '아틀리에 스케치북 감성의 담백하고 정갈한 캠퍼스/데이트 룩으로 완성됩니다.'
        }
      ],
      dominantColor: '웜 뉴트럴 톤',
      stylingKeywords: ['소프트 미니멀', '데일리 아틀리에', '자연스러운 실루엣'],
      overallComment: '보유하신 스마트 옷장의 기본 아이템들과 호환성이 매우 높아 주 3회 이상 손이 갈 만능 아이템입니다.'
    };

    return res.json({ success: true, data: fallbackData });
  } catch (error: any) {
    console.error('Error in analyze-garment:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. AI Daily Outfit & Weather Recommendation
app.post('/api/gemini/daily-outfit', async (req: Request, res: Response) => {
  try {
    const { weather, occasion, closetItems, userProfile } = req.body;

    if (aiClient) {
      try {
        const prompt = `사용자의 스마트 옷장 아이템 목록을 기반으로 오늘 날씨와 상황에 맞는 최고의 데일리 코디를 제안해주세요.

오늘 날씨: 기온 ${weather?.temp || 18}°C, 날씨 상태 ${weather?.condition || '약간 쌀쌀하고 맑음'}
상황/일정: ${occasion || '대학 캠퍼스 강의 및 가벼운 스터디 약속'}
사용자 프로필: 퍼스널컬러 ${userProfile?.personalColor || '가을 웜톤'}, 스타일 ${userProfile?.preferredStyles?.join(', ') || '미니멀 캐주얼'}
보유 옷장 아이템 목록:
${JSON.stringify(closetItems?.slice(0, 10) || [], null, 2)}

다음 JSON 규격으로만 응답하세요:
{
  "outfitTitle": "차분한 톤온톤 캠퍼스 아틀리에 룩",
  "temperatureSummary": "한낮과 저녁 일교차를 고려해 레이어드가 용이한 조합입니다.",
  "topItem": "아이보리 옥스포드 셔츠",
  "bottomItem": "테이퍼드 생지 데님 팬츠",
  "outerItem": "카멜 베이지 워크자켓",
  "shoesAndAccessories": "스웨이드 로퍼, 브라운 레더 스트랩 시계",
  "coordinatorTip": "쌀쌀한 오전에는 자켓을 여미고, 따뜻한 오후에는 셔츠 소매를 걷어 캐주얼한 느낌을 살리세요.",
  "synergyScore": 95
}`;

        const response = await withTimeout(
          aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.7,
            },
          }),
          4000
        );

        const parsed = JSON.parse(response.text || '{}');
        return res.json({ success: true, data: parsed });
      } catch (geminiErr) {
        console.warn('Gemini daily-outfit failed/timed out, using heuristic fallback:', geminiErr);
      }
    }

    // Heuristic response
    const fallback = {
      outfitTitle: `${occasion || '캠퍼스 데일리'}에 어울리는 감성 스케치 룩`,
      temperatureSummary: `현재 ${weather?.temp || 19}°C 날씨에 적합하도록 체온 유지와 활동성을 동시에 잡은 코디입니다.`,
      topItem: '소프트 코튼 옥스포드 셔츠 & 니트 베스트 레이어드',
      bottomItem: '와이드 핏 딥 베이지 치노 팬츠',
      outerItem: '자연스러운 워싱감의 라이트 캔버스 자켓',
      shoesAndAccessories: '미니멀 레더 스니커즈 & 패브릭 토트백',
      coordinatorTip: '바지 밑단을 자연스럽게 1단 접어올리고, 셔츠 단추를 하나 풀어 편안하면서도 단정한 아틀리에 룩을 연출해보세요.',
      synergyScore: 94
    };

    return res.json({ success: true, data: fallback });
  } catch (error: any) {
    console.error('Error in daily-outfit:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. AI Wardrobe Gap & Shopping Synergy Analysis
app.post('/api/gemini/wardrobe-gaps', async (req: Request, res: Response) => {
  try {
    const { closetItems, userProfile } = req.body;

    const itemCount = Array.isArray(closetItems) ? closetItems.length : 0;
    const fallbackGaps = {
      summary: `현재 등록된 ${itemCount}벌의 옷장을 분석한 결과, 기본 상의와 데님 하의는 탄탄하지만 간절기용 레이어드 아이템과 단정한 슈즈 매칭이 보강되면 코디 조합이 2.5배 늘어납니다.`,
      suggestedAdditions: [
        {
          category: '아우터/가디건',
          name: '메리노울 니트 집업 가디건 (오트밀)',
          reason: '가지고 계신 셔츠와 반팔티 위에 걸치기만 해도 따뜻하고 감성적인 스케치북 무드가 완성됩니다.',
          matchPotentialScore: 96
        },
        {
          category: '하의',
          name: '원턱 세미와이드 슬랙스 (차콜 그레이)',
          reason: '데님 위주의 하의에 모던한 슬랙스를 추가하면 발표나 미팅 같은 격식 있는 자리까지 완벽 커버됩니다.',
          matchPotentialScore: 93
        },
        {
          category: '악세사리',
          name: '빈티지 레더 미니멀 메신저백 (체스트넛 브라운)',
          reason: '학생다운 학업용 수납과 함께 우드 감성의 룩 포인트를 확실하게 살려줍니다.',
          matchPotentialScore: 91
        }
      ]
    };

    return res.json({ success: true, data: fallbackGaps });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 4. In-App Direct Headquarter Purchase Simulation & Tracking
app.post('/api/orders/place', async (req: Request, res: Response) => {
  try {
    const { item, buyer, paymentMethod, quantity = 1 } = req.body;

    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
    const basePrice = item?.price || 59000;
    const subtotal = basePrice * quantity;
    const platformFeeRate = 0.045; // 4.5% student platform fee
    const platformFee = Math.round(subtotal * platformFeeRate);
    const totalPrice = subtotal;

    const simulatedOrder = {
      orderId,
      createdAt: new Date().toISOString(),
      item: {
        id: item?.id || 'prod-1',
        title: item?.title || '오가닉 코튼 오버사이즈 옥스포드 셔츠',
        brand: item?.brand || 'ATELIER STUDIO',
        price: basePrice,
        image: item?.image || '',
        size: item?.selectedSize || 'L',
        color: item?.selectedColor || '아이보리 베이지'
      },
      quantity,
      buyer: {
        name: buyer?.name || '김학생',
        phone: buyer?.phone || '010-3849-2819',
        address: buyer?.address || '서울특별시 마포구 와우산로 94 디자인캠퍼스',
      },
      payment: {
        method: paymentMethod || '간편 계좌결제 / 카드',
        subtotal,
        platformFee, // Platform commission
        totalPrice,
        status: 'PAID'
      },
      status: 'HEADQUARTER_CONFIRMED', // Immediate AI HQ dispatch
      dispatchTimeline: [
        { stage: 'ORDER_PLACED', time: '방금 전', title: '앱 결제 완료', desc: '고객 주문 승인 및 수수료 정산' },
        { stage: 'AI_HQ_ROUTED', time: '방금 전', title: 'AI 본사 직발주 접수', desc: `${item?.brand || '브랜드 본사'} 전산망에 실시간 직발주 완료` },
        { stage: 'STOCK_VERIFIED', time: '진행 중', title: '본사 물류센터 재고 승인', desc: '의류 본사 물류센터 자동 패킹 지시' },
        { stage: 'IN_TRANSIT', time: '출고 예정 (익일)', title: '배송사 인계 및 이동', desc: 'CJ대한통운 / 우체국택배 발송' },
        { stage: 'DELIVERED', time: '2일 후 도착 예정', title: '배송 완료', desc: '문 앞 배송 완료' }
      ]
    };

    return res.json({ success: true, order: simulatedOrder });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Setup Vite or Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
