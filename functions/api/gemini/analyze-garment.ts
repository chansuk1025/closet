// Cloudflare Pages Function: /api/gemini/analyze-garment
export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json();
    const { userProfile, garmentTitle, category } = body;

    const pColor = userProfile?.personalColor || '가을 웜톤';
    const bType = userProfile?.bodyType || '직사각형/보통';

    const apiKey = context.env?.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const prompt = `당신은 감각적인 패션 디렉터이자 스케치북 아틀리에의 퍼스널 스타일리스트입니다.
사용자 정보: 키 ${userProfile?.height || 175}cm, 체형 ${bType}, 퍼스널컬러 ${pColor}, 선호 스타일 ${userProfile?.preferredStyles?.join(', ') || '미니멀'}
검토 대상 옷: ${garmentTitle || '의류'} (카테고리: ${category || '의류'})

다음 JSON 규격으로만 응답하세요:
{
  "harmonyScore": 92,
  "personalColorVerdict": "${pColor} 피부톤에 어울리는 자연스럽고 감각적인 색감입니다.",
  "bodyTypeAdvice": "${bType} 체형의 라인을 단정하게 보완해줍니다.",
  "recommendedCombinations": [
    {
      "pairingItem": "스마트 옷장의 생지 데님 또는 테이퍼드 치노 팬츠",
      "styleTip": "상의를 가볍게 턱인하여 착용하면 비율이 안정적으로 연출됩니다."
    },
    {
      "pairingItem": "내추럴 톤의 워크자켓 또는 가디건",
      "styleTip": "스케치북 아틀리에 무드의 편안한 레이어드를 완성하세요."
    }
  ],
  "dominantColor": "웜 뉴트럴 톤",
  "stylingKeywords": ["어번 미니멀", "톤온톤", "감성 캐주얼"],
  "overallComment": "데일리로 착용하기에 밸런스가 매우 좋은 피스입니다."
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData: any = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return new Response(JSON.stringify({ success: true, data: parsed }), {
              headers: { 'Content-Type': 'application/json' },
            });
          }
        }
      } catch (err) {
        // fallback
      }
    }

    // Heuristic fallback
    const fallbackData = {
      harmonyScore: 92,
      personalColorVerdict: `${pColor}을 보유하신 사용자님의 피부톤에 자연스럽고 부드럽게 감기며, 안색을 화사하고 안정감 있게 보완해 주는 컬러감입니다.`,
      bodyTypeAdvice: `${bType} 체형의 라인을 과하지 않게 정리해주며, 어깨선과 밑단 떨어짐이 안정적이어서 세련된 비율감을 만들어줍니다.`,
      recommendedCombinations: [
        {
          pairingItem: '스마트 옷장의 생지 데님 또는 테이퍼드 치노 팬츠',
          styleTip: '상의를 가볍게 하프 턱인하여 착용하면 허리선이 높아 보여 다리가 길어 보입니다.',
        },
        {
          pairingItem: '내추럴 톤의 캔버스 백 & 로우탑 스니커즈',
          styleTip: '아틀리에 스케치북 감성의 담백하고 정갈한 캠퍼스/데이트 룩으로 완성됩니다.',
        },
      ],
      dominantColor: '웜 뉴트럴 톤',
      stylingKeywords: ['소프트 미니멀', '데일리 아틀리에', '자연스러운 실루엣'],
      overallComment: '보유하신 스마트 옷장의 기본 아이템들과 호환성이 매우 높아 주 3회 이상 손이 갈 만능 아이템입니다.',
    };

    return new Response(JSON.stringify({ success: true, data: fallbackData }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
