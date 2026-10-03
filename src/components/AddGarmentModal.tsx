import React, { useState } from 'react';
import { ClosetItem, FashionStyle, GarmentCategory, Season } from '../types';
import { Upload, Camera, Sparkles, Check, X } from 'lucide-react';

interface AddGarmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGarment: (item: ClosetItem) => void;
}

export const AddGarmentModal: React.FC<AddGarmentModalProps> = ({
  isOpen,
  onClose,
  onAddGarment,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<GarmentCategory>('상의');
  const [color, setColor] = useState('');
  const [season, setSeason] = useState<Season>('사계절');
  const [style, setStyle] = useState<FashionStyle>('미니멀');
  const [brand, setBrand] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/wardrobe_hanger_wood_1790992705475.jpg');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        if (!name) {
          setName(file.name.replace(/\.[^/.]+$/, ''));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: ClosetItem = {
      id: `closet-${Date.now()}`,
      name: name.trim(),
      category,
      color: color.trim() || '내추럴',
      season,
      style,
      brand: brand.trim() || 'ATELIER PERSONAL',
      imageUrl,
      addedAt: new Date().toISOString().slice(0, 10),
      wearCount: 0,
      notes: notes.trim(),
      matchingScoreWithUser: Math.floor(Math.random() * 10 + 90),
    };

    onAddGarment(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF8F3] rounded-2xl border border-[#DFCFC0] max-w-lg w-full p-6 sm:p-7 pencil-shadow max-h-[90vh] overflow-y-auto space-y-5">
        <div className="flex items-start justify-between border-b border-[#E8DDCE] pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D53]">
              Wardrobe Archive
            </span>
            <h3 className="text-xl font-serif font-bold text-[#2A1F18]">
              스마트 옷장에 새 옷 등록
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8C6D53] hover:text-[#2A1F18] p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Photo Preview and Selector */}
          <div className="space-y-2">
            <label className="font-bold text-[#443327] block">의류 사진</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-[#EFE8DC] border border-[#D5C6B5] overflow-hidden shrink-0">
                <img
                  src={imageUrl}
                  alt="미리보기"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="inline-flex items-center gap-1.5 py-2 px-3 bg-[#EDE5D8] hover:bg-[#DDD2C2] text-[#443327] rounded-xl font-semibold cursor-pointer border border-[#DACDBD]">
                  <Upload className="w-3.5 h-3.5" />
                  <span>내 사진 업로드</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-[#7A6350]">
                  휴대폰 카메라로 촬영한 옷 사진을 바로 올릴 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Name & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#443327] block mb-1">옷 이름 *</label>
              <input
                type="text"
                required
                placeholder="예: 릴렉스 린넨 셔츠"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18]"
              />
            </div>
            <div>
              <label className="font-bold text-[#443327] block mb-1">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GarmentCategory)}
                className="w-full p-2.5 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18]"
              >
                <option value="상의">상의</option>
                <option value="하의">하의</option>
                <option value="아우터">아우터</option>
                <option value="신발">신발</option>
                <option value="악세사리">악세사리</option>
              </select>
            </div>
          </div>

          {/* Color & Season */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#443327] block mb-1">색상</label>
              <input
                type="text"
                placeholder="예: 오트밀 베이지"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18]"
              />
            </div>
            <div>
              <label className="font-bold text-[#443327] block mb-1">계절</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as Season)}
                className="w-full p-2.5 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18]"
              >
                <option value="사계절">사계절</option>
                <option value="봄">봄</option>
                <option value="여름">여름</option>
                <option value="가을">가을</option>
                <option value="겨울">겨울</option>
              </select>
            </div>
          </div>

          {/* Style & Brand */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#443327] block mb-1">스타일</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as FashionStyle)}
                className="w-full p-2.5 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18]"
              >
                <option value="미니멀">미니멀</option>
                <option value="시티보이">시티보이</option>
                <option value="캐주얼">캐주얼</option>
                <option value="아메카지">아메카지</option>
                <option value="스트릿">스트릿</option>
                <option value="클래식/포멀">클래식/포멀</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-[#443327] block mb-1">브랜드 (선택)</label>
              <input
                type="text"
                placeholder="예: 무신사 스탠다드, 유니클로"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="font-bold text-[#443327] block mb-1">코디 메모 / 특징</label>
            <textarea
              rows={2}
              placeholder="예: 어깨가 살짝 드롭되어 슬랙스와 궁합이 좋음."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18]"
            />
          </div>

          {/* Submit CTA */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-[#EAE1D3] hover:bg-[#DDD2C2] text-[#443327] rounded-xl font-semibold"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-2 py-2.5 bg-[#382A21] hover:bg-[#251B15] text-[#FAF6F0] rounded-xl font-semibold shadow-sm"
            >
              옷장에 보관하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
