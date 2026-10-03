import React, { useState } from 'react';
import { BodyType, FashionStyle, PersonalColor, UserProfile } from '../types';
import { User, X, Check, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [height, setHeight] = useState(175);
  const [bodyType, setBodyType] = useState<BodyType>('직사각형 (슬림/보통)');
  const [personalColor, setPersonalColor] = useState<PersonalColor>('가을 웜톤');

  if (!isOpen) return null;

  // Student Project Demo Switcher Profiles
  const demoProfiles: UserProfile[] = [
    {
      id: 'demo_1',
      name: '이도현 (학생 데모)',
      email: 'dohyun.fashion@univ.ac.kr',
      gender: '남성',
      height: 177,
      weight: 68,
      bodyType: '직사각형 (슬림/보통)',
      personalColor: '가을 웜톤',
      preferredStyles: ['미니멀', '시티보이'],
      bio: '따뜻한 어스 톤과 스케치북 아틀리에 룩을 선호하는 대학생',
    },
    {
      id: 'demo_2',
      name: '김서연 (학생 데모)',
      email: 'seoyeon.atelier@univ.ac.kr',
      gender: '여성',
      height: 165,
      weight: 51,
      bodyType: '웨이브 (부드러운 곡선)',
      personalColor: '여름 쿨톤',
      preferredStyles: ['시티보이', '캐주얼', '클래식/포멀'],
      bio: '청량하고 깔끔한 톤과 세미오버핏 셔츠를 좋아하는 패션학도',
    },
  ];

  const handleSelectDemo = (p: UserProfile) => {
    onLogin(p);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userObj: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim() || '신규 사용자',
      email: email.trim() || 'user@atelier.app',
      gender: '남성',
      height,
      bodyType,
      personalColor,
      preferredStyles: ['미니멀', '시티보이'],
    };
    onLogin(userObj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF8F3] rounded-2xl border border-[#DFCFC0] max-w-md w-full p-6 sm:p-7 pencil-shadow max-h-[90vh] overflow-y-auto space-y-6">
        <div className="flex items-start justify-between border-b border-[#E8DDCE] pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D53]">
              Membership Access
            </span>
            <h3 className="text-xl font-serif font-bold text-[#2A1F18]">
              {isSignUp ? '아틀리에 회원가입' : '회원 로그인'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8C6D53] hover:text-[#2A1F18] p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Fast Switcher (For student testing & grading) */}
        <div className="p-3.5 bg-[#F2ECE2] rounded-xl border border-[#DFD3C2] space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#3E2F24]">
            <Sparkles className="w-3.5 h-3.5 text-[#B88746]" />
            <span>학생 프로젝트 테스트용 원클릭 데모 프로필</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {demoProfiles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectDemo(p)}
                className="w-full text-left p-2.5 bg-white/90 hover:bg-white rounded-lg border border-[#D5C6B5] transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[#2A1F18]">{p.name}</div>
                  <div className="text-[11px] text-[#7A6350]">
                    {p.height}cm · {p.bodyType.split(' ')[0]} · {p.personalColor}
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#382A21] underline">
                  선택 전환
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Normal Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-[#443327] block mb-1">이메일</label>
            <input
              type="email"
              required
              placeholder="id@univ.ac.kr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18]"
            />
          </div>

          <div>
            <label className="font-bold text-[#443327] block mb-1">이름</label>
            <input
              type="text"
              required
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18]"
            />
          </div>

          {isSignUp && (
            <>
              <div>
                <label className="font-bold text-[#443327] block mb-1">키 (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18]"
                />
              </div>

              <div>
                <label className="font-bold text-[#443327] block mb-1">체형</label>
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value as BodyType)}
                  className="w-full p-2.5 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18]"
                >
                  <option value="직사각형 (슬림/보통)">직사각형 (슬림/보통)</option>
                  <option value="역삼각형 (어깨 발달)">역삼각형 (어깨 발달)</option>
                  <option value="삼각형 (하체 중심)">삼각형 (하체 중심)</option>
                  <option value="웨이브 (부드러운 곡선)">웨이브 (부드러운 곡선)</option>
                  <option value="스트레이트 (균형 체형)">스트레이트 (균형 체형)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#443327] block mb-1">퍼스널 컬러</label>
                <select
                  value={personalColor}
                  onChange={(e) => setPersonalColor(e.target.value as PersonalColor)}
                  className="w-full p-2.5 bg-white border border-[#D5C6B5] rounded-xl text-[#2A1F18]"
                >
                  <option value="봄 웜톤">봄 웜톤</option>
                  <option value="여름 쿨톤">여름 쿨톤</option>
                  <option value="가을 웜톤">가을 웜톤</option>
                  <option value="겨울 쿨톤">겨울 쿨톤</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#382A21] hover:bg-[#251B15] text-[#FAF6F0] rounded-xl font-semibold transition-colors shadow-sm"
          >
            {isSignUp ? '회원가입 완료' : '로그인'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#E8DDCE]">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-[#8C6D53] hover:text-[#2A1F18] font-medium underline"
          >
            {isSignUp ? '이미 계정이 있으신가요? 로그인' : '처음이신가요? 30초 회원가입'}
          </button>
        </div>
      </div>
    </div>
  );
};
