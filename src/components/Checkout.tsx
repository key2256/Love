import * as React from 'react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ShoppingBag,
  MapPin,
  Phone,
  User,
  MessageSquare,
  ChevronRight,
  AlertCircle,
  Wallet,
  Banknote
} from 'lucide-react';
import { CartItem, ShippingInfo, Order } from '../types';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import StripeCheckout from './StripeCheckout';

interface CheckoutProps {
  items: CartItem[];
  onBack: () => void;
  onSuccess: () => void;
}

export default function Checkout({ items, onBack, onSuccess }: CheckoutProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    recipientName: user?.displayName || '',
    phoneNumber: '',
    address: '',
    detailAddress: '',
    zipCode: '',
    memo: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'vbank' | 'paypal' | 'bank_transfer'>('card');

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const shippingFee = totalAmount >= 50000 ? 0 : 3000;
  const finalAmount = totalAmount + shippingFee;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.recipientName || !shippingInfo.phoneNumber || !shippingInfo.address || !shippingInfo.zipCode) {
      toast.error('모든 필수 배송 정보를 입력해주세요.');
      return;
    }
    setStep('payment');
  };

  const createOrder = async () => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      const orderData: Omit<Order, 'id'> = {
        userId: user.uid,
        items,
        totalAmount: finalAmount,
        shippingInfo,
        paymentMethod,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      setStep('confirmation');
      toast.success('주문이 완료되었습니다!');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('주문 처리 중 오류가 발생했습니다.');
    }
  };

  const handlePaymentSubmit = async () => {
    if (paymentMethod === 'card') {
      // Stripe handles this via StripeCheckout
      return;
    }

    setIsProcessing(true);
    
    // Mock payment processing delay for other methods
    await new Promise(resolve => setTimeout(resolve, 2000));

    await createOrder();
    setIsProcessing(false);
  };

  const steps = [
    { id: 'shipping', label: '배송 정보', icon: Truck },
    { id: 'payment', label: '결제 수단', icon: CreditCard },
    { id: 'confirmation', label: '주문 완료', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  const ProgressBar = () => (
    <div className="max-w-3xl mx-auto mb-16 px-4">
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-100 -translate-y-1/2 rounded-full" />
        
        {/* Progress Line */}
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full origin-left"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((s, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;
            const Icon = s.icon;

            return (
              <div key={s.id} className="flex flex-col items-center gap-3">
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isCompleted || isActive ? "#10b981" : "#f4f4f5",
                    color: isCompleted || isActive ? "#ffffff" : "#a1a1aa",
                  }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm z-10 transition-colors`}
                >
                  {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                </motion.div>
                <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                  isActive ? 'text-zinc-900' : 'text-zinc-400'
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (step === 'confirmation') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <ProgressBar />
        <div className="max-w-2xl mx-auto py-12 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 flex justify-center"
          >
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={48} />
            </div>
          </motion.div>
          
          <h1 className="text-4xl font-black text-zinc-900 mb-4">주문이 완료되었습니다!</h1>
          <p className="text-zinc-500 mb-12 text-lg">
            정성껏 제작하여 안전하게 배송해 드리겠습니다.<br />
            주문 내역은 마이페이지에서 확인하실 수 있습니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onSuccess}
              className="px-12 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
            >
              쇼핑 계속하기
            </button>
            <button
              onClick={() => window.location.reload()} // Simple way to go to home/orders
              className="px-12 py-4 bg-zinc-900 text-white rounded-2xl font-black text-sm hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-100"
            >
              주문 내역 확인
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <ProgressBar />
      
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 font-bold mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        장바구니로 돌아가기
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 space-y-8">
          {/* Steps Indicator Removed - Replaced by ProgressBar */}

          {step === 'shipping' ? (
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleShippingSubmit} 
              className="space-y-6"
            >
              <div className="bg-white rounded-[32px] p-8 border border-zinc-100 shadow-sm space-y-6">
                <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-3">
                  <Truck className="text-emerald-600" />
                  배송지 정보
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                      수령인 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                      <input
                        type="text"
                        required
                        value={shippingInfo.recipientName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, recipientName: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                        placeholder="이름을 입력하세요"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                      <input
                        type="tel"
                        required
                        value={shippingInfo.phoneNumber}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phoneNumber: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                        placeholder="010-0000-0000"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                      주소 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                        <input
                          type="text"
                          readOnly
                          required
                          value={shippingInfo.zipCode}
                          className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none font-medium cursor-not-allowed"
                          placeholder="우편번호"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => setShippingInfo({ ...shippingInfo, zipCode: '06234', address: '서울특별시 강남구 테헤란로 123' })}
                        className="px-6 py-4 bg-zinc-900 text-white rounded-2xl font-bold text-xs hover:bg-zinc-800 transition-all"
                      >
                        주소 찾기
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    readOnly
                    required
                    value={shippingInfo.address}
                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none font-medium cursor-not-allowed"
                    placeholder="기본 주소"
                  />

                  <input
                    type="text"
                    required
                    value={shippingInfo.detailAddress}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, detailAddress: e.target.value })}
                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    placeholder="상세 주소를 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                    배송 메모 (선택)
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 text-zinc-300" size={18} />
                    <textarea
                      value={shippingInfo.memo}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, memo: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium min-h-[100px] resize-none"
                      placeholder="배송 시 요청사항을 적어주세요"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-6 bg-emerald-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
              >
                결제 단계로 이동
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-[32px] p-8 border border-zinc-100 shadow-sm space-y-8">
                <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-3">
                  <CreditCard className="text-emerald-600" />
                  결제 수단 선택
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'card', label: '신용/체크카드', icon: CreditCard },
                    { id: 'transfer', label: '실시간 계좌이체', icon: MessageSquare },
                    { id: 'vbank', label: '가상계좌', icon: ShoppingBag },
                    { id: 'paypal', label: '페이팔 (PayPal)', icon: Wallet },
                    { id: 'bank_transfer', label: '무통장 입금', icon: Banknote }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${
                        paymentMethod === method.id 
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-600' 
                          : 'border-zinc-100 hover:border-zinc-200 text-zinc-400'
                      }`}
                    >
                      <method.icon size={24} />
                      <span className="font-bold text-sm">{method.label}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'card' ? (
                  <div className="p-6 bg-white rounded-3xl border border-zinc-100 shadow-sm">
                    <h3 className="text-lg font-black text-zinc-900 mb-4">카드 결제</h3>
                    <StripeCheckout amount={finalAmount} onPaymentSuccess={createOrder} />
                  </div>
                ) : (
                  <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                    <div className="flex items-start gap-3 text-zinc-500">
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <p className="text-xs leading-relaxed">
                        완두프린트는 안전한 결제를 위해 보안 표준을 준수합니다. <br />
                        결제 완료 후 제작이 시작되며, 제작 시작 후에는 취소가 어려울 수 있습니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {paymentMethod !== 'card' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('shipping')}
                    className="flex-1 py-6 bg-zinc-100 text-zinc-600 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all"
                  >
                    이전 단계
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={isProcessing}
                    className="flex-[2] py-6 bg-emerald-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        결제 처리 중...
                      </>
                    ) : (
                      <>
                        {finalAmount.toLocaleString()}원 결제하기
                        <CheckCircle2 className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[32px] border border-zinc-100 shadow-sm overflow-hidden sticky top-24">
            <div className="p-8 border-b border-zinc-100 bg-zinc-50/50">
              <h3 className="text-lg font-black text-zinc-900 mb-1">주문 요약</h3>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{items.length}개의 품목</p>
            </div>

            <div className="p-8 space-y-6 max-h-[400px] overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-zinc-50 border border-zinc-100 overflow-hidden shrink-0">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-zinc-900 truncate">{item.product.name}</h4>
                    <p className="text-[10px] text-zinc-400 font-medium mb-1">
                      {Object.values(item.options).join(' / ')}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-zinc-500">{item.quantity}개</span>
                      <span className="text-sm font-black text-zinc-900">{item.totalPrice.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-zinc-50/50 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-medium">상품 합계</span>
                <span className="text-zinc-900 font-bold">{totalAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-medium">배송비</span>
                <span className="text-zinc-900 font-bold">{shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}</span>
              </div>
              {shippingFee > 0 && (
                <p className="text-[10px] text-emerald-600 font-bold text-right">
                  50,000원 이상 구매 시 무료배송
                </p>
              )}
              <div className="pt-4 border-t border-zinc-100 flex justify-between items-end">
                <span className="text-base font-black text-zinc-900">최종 결제 금액</span>
                <span className="text-2xl font-black text-emerald-600">{finalAmount.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
