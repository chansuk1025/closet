// Cloudflare Pages Function: /api/orders/place
export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json();
    const { item, buyer, paymentMethod, quantity = 1 } = body;

    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
    const basePrice = item?.price || 59000;
    const subtotal = basePrice * quantity;
    const platformFee = Math.round(subtotal * 0.045);

    const simulatedOrder = {
      orderId,
      createdAt: new Date().toISOString(),
      item: {
        id: item?.id || 'prod-1',
        title: item?.title || '오가닉 코튼 옥스포드 셔츠',
        brand: item?.brand || 'ATELIER STUDIO',
        price: basePrice,
        image: item?.image || '',
        size: item?.selectedSize || 'L',
        color: item?.selectedColor || '아이보리 베이지',
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
        platformFee,
        totalPrice: subtotal,
        status: 'PAID',
      },
      status: 'HEADQUARTER_CONFIRMED',
      dispatchTimeline: [
        { stage: 'ORDER_PLACED', time: '방금 전', title: '앱 결제 완료', desc: '고객 주문 승인 및 수수료 정산' },
        { stage: 'AI_HQ_ROUTED', time: '방금 전', title: 'AI 본사 직발주 접수', desc: `${item?.brand || '브랜드 본사'} 전산망에 실시간 직발주 완료` },
        { stage: 'STOCK_VERIFIED', time: '진행 중', title: '본사 물류센터 재고 승인', desc: '의류 본사 물류센터 자동 패킹 지시' },
        { stage: 'IN_TRANSIT', time: '출고 예정 (익일)', title: '배송사 인계 및 이동', desc: 'CJ대한통운 / 우체국택배 발송' },
        { stage: 'DELIVERED', time: '2일 후 도착 예정', title: '배송 완료', desc: '문 앞 배송 완료' },
      ],
    };

    return new Response(JSON.stringify({ success: true, order: simulatedOrder }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
