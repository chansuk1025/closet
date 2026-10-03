// Cloudflare Pages Function: /api/gemini/daily-outfit
export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json();
    const { weather, occasion } = body;

    const fallback = {
      outfitTitle: `${occasion || '캠퍼스 데일리'}에 어울리는 감성 스케치 룩`,
      temperatureSummary: `현재 ${weather?.temp || 19}°C 날씨에 적합하도록 체온 유지와 활동성을 동시에 잡은 코디입니다.`,
      topItem: '소프트 코튼 옥스포드 셔츠 & 니트 베스트 레이어드',
      bottomItem: '와이드 핏 딥 베이지 치노 팬츠',
      outerItem: '자연스러운 워싱감의 라이트 캔버스 자켓',
      shoesAndAccessories: '미니멀 레더 스니커즈 & 패브릭 토트백',
      coordinatorTip: '바지 밑단을 자연스럽게 1단 접어올리고, 셔츠 단추를 하나 풀어 편안하면서도 단정한 아틀리에 룩을 연출해보세요.',
      synergyScore: 95,
    };

    return new Response(JSON.stringify({ success: true, data: fallback }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
