// Cloudflare Pages Function: /api/gemini/wardrobe-gaps
export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json();
    const itemCount = Array.isArray(body?.closetItems) ? body.closetItems.length : 6;

    const data = {
      summary: `현재 등록된 ${itemCount}벌의 옷장을 분석한 결과, 기본 상의와 데님 하의는 탄탄하지만 간절기용 레이어드 아이템과 단정한 슈즈 매칭이 보강되면 코디 조합이 2.5배 늘어납니다.`,
      suggestedAdditions: [
        {
          category: '아우터/가디건',
          name: '메리노울 니트 집업 가디건 (오트밀)',
          reason: '가지고 계신 셔츠와 반팔티 위에 걸치기만 해도 따뜻하고 감성적인 스케치북 무드가 완성됩니다.',
          matchPotentialScore: 96,
        },
        {
          category: '하의',
          name: '원턱 세미와이드 슬랙스 (차콜 그레이)',
          reason: '데님 위주의 하의에 모던한 슬랙스를 추가하면 발표나 미팅 같은 격식 있는 자리까지 완벽 커버됩니다.',
          matchPotentialScore: 93,
        },
      ],
    };

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
