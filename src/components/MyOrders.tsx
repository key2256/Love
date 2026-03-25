import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  Search,
  Filter,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Order } from '../types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const STATUS_CONFIG = {
  pending: {
    label: '결제대기',
    icon: Clock,
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    pulse: 'bg-amber-400',
    step: 1
  },
  processing: {
    label: '제작중',
    icon: Package,
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    pulse: 'bg-blue-400',
    step: 2
  },
  shipped: {
    label: '배송중',
    icon: Truck,
    color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    pulse: 'bg-indigo-400',
    step: 3
  },
  delivered: {
    label: '배송완료',
    icon: CheckCircle2,
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    pulse: null,
    step: 4
  },
  cancelled: {
    label: '주문취소',
    icon: AlertCircle,
    color: 'text-rose-700 bg-rose-50 border-rose-200',
    pulse: null,
    step: 0
  }
};

const OrderStepper = ({ currentStatus }: { currentStatus: string }) => {
  const steps = [
    { key: 'pending', label: '결제대기' },
    { key: 'processing', label: '제작중' },
    { key: 'shipped', label: '배송중' },
    { key: 'delivered', label: '배송완료' }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  if (isCancelled) return null;

  return (
    <div className="mt-6 mb-2 px-2">
      <div className="relative flex justify-between">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-zinc-900 -translate-y-1/2 z-0 transition-all duration-500" 
          style={{ width: `${Math.max(0, currentStepIndex) * (100 / (steps.length - 1))}%` }}
        />

        {steps.map((step, index) => {
          const isActive = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const Config = STATUS_CONFIG[step.key as keyof typeof STATUS_CONFIG];
          const StepIcon = Config.icon;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  isCurrent 
                    ? 'bg-zinc-900 border-zinc-900 text-white scale-110 shadow-lg shadow-zinc-200' 
                    : isActive 
                      ? 'bg-white border-zinc-900 text-zinc-900' 
                      : 'bg-white border-zinc-200 text-zinc-300'
                }`}
              >
                <StepIcon size={14} />
              </div>
              <span className={`mt-2 text-[10px] font-bold whitespace-nowrap ${
                isCurrent ? 'text-zinc-900' : isActive ? 'text-zinc-500' : 'text-zinc-300'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  const orderToCancel = orders.find(o => o.id === cancellingOrderId);

  const handleCancelOrder = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'cancelled',
        updatedAt: Timestamp.now()
      });
      toast.success('주문이 취소되었습니다.');
      setCancellingOrderId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
      toast.error('주문 취소 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredOrders = orders.filter(order => {
    const productNames = order.items?.map(item => item.product.name).join(' ') || '';
    const matchesSearch = productNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">주문 내역</h1>
        <p className="text-zinc-500">최근 주문하신 내역을 확인하실 수 있습니다.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="상품명 또는 주문번호로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              statusFilter === 'all' 
                ? 'bg-zinc-900 text-white' 
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            전체
          </button>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                statusFilter === key 
                  ? config.color.split(' ')[0].replace('text', 'bg').replace('600', '900') + ' text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const config = STATUS_CONFIG[order.status];
              const StatusIcon = config.icon;
              
              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-zinc-500 mr-2">주문일자</span>
                        <span className="font-medium text-zinc-900">
                          {order.createdAt instanceof Timestamp 
                            ? format(order.createdAt.toDate(), 'yyyy.MM.dd', { locale: ko })
                            : order.createdAt}
                        </span>
                      </div>
                      <div className="h-3 w-[1px] bg-zinc-200" />
                      <div className="text-sm">
                        <span className="text-zinc-500 mr-2">주문번호</span>
                        <span className="font-medium text-zinc-900">{order.id.slice(0, 8).toUpperCase()}</span>
                      </div>
                    </div>
                    <button className="text-sm text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors">
                      상세보기 <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Order Content */}
                  <div className="p-6 flex flex-col md:flex-row gap-6">
                    <div className="w-24 h-24 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="text-zinc-400" size={32} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-zinc-900 mb-1 truncate">
                            {order.items && order.items.length > 0 
                              ? `${order.items[0].product.name}${order.items.length > 1 ? ` 외 ${order.items.length - 1}건` : ''}`
                              : '주문 상품 정보 없음'}
                          </h3>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-zinc-500">
                            {order.items && order.items.length > 0 && Object.entries(order.items[0].options).map(([key, value]) => (
                              <span key={key}>{key}: {value}</span>
                            ))}
                          </div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full border text-xs font-black flex items-center gap-2 shadow-sm ${config.color}`}>
                          {config.pulse && (
                            <span className="relative flex h-2 w-2">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.pulse}`}></span>
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${config.pulse}`}></span>
                            </span>
                          )}
                          <StatusIcon size={14} />
                          {config.label}
                        </div>
                      </div>

                      <OrderStepper currentStatus={order.status} />

                      <div className="flex items-end justify-between mt-6">
                        <div className="text-sm text-zinc-500">
                          총 {order.items?.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()}개
                        </div>
                        <div className="text-lg font-bold text-zinc-900">
                          {order.totalAmount.toLocaleString()}원
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Footer / Actions */}
                  <div className="px-6 py-4 bg-white border-t border-zinc-100 flex justify-end gap-3">
                    {['pending', 'processing'].includes(order.status) && (
                      <button 
                        onClick={() => setCancellingOrderId(order.id)}
                        className="px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-50 transition-all"
                      >
                        주문취소
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-all">
                        구매후기 작성
                      </button>
                    )}
                    <button className="px-4 py-2 text-sm font-medium text-zinc-900 border border-zinc-900 rounded-lg hover:bg-zinc-50 transition-all">
                      재주문하기
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200"
            >
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="text-zinc-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">주문 내역이 없습니다</h3>
              <p className="text-zinc-500 mb-6">완두박스에서 멋진 결과물을 만들어보세요!</p>
              <button className="px-6 py-2 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-800 transition-all">
                상품 둘러보기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cancellation Confirmation Modal */}
      <AnimatePresence>
        {cancellingOrderId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
            >
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="text-rose-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">주문을 취소하시겠습니까?</h3>
              <p className="text-zinc-500 mb-6">
                주문번호: <span className="font-bold text-zinc-900">{orderToCancel?.id.slice(0, 8).toUpperCase()}</span><br />
                취소된 주문은 복구할 수 없습니다. 정말로 취소하시겠습니까?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancellingOrderId(null)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-all"
                >
                  아니오
                </button>
                <button
                  onClick={() => handleCancelOrder(cancellingOrderId)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-all"
                >
                  네, 취소합니다
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
