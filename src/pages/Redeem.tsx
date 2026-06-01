import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { useChildStore } from '@/stores/childStore';
import { useProductStore } from '@/stores/productStore';
import { useStampStore } from '@/stores/stampStore';
import { Award, Clock, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import { PRODUCT_CATEGORIES, REDEEM_STATUS_LABELS } from '@/utils/constants';
import type { Product } from '@/types';

export default function Redeem() {
  const navigate = useNavigate();
  const { userRole, selectedChildId } = useAppStore();
  const { currentChild } = useChildStore();
  const { products, loadProducts } = useProductStore();
  const { applyRedeem, getRedeemHistory } = useStampStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  const redeemHistory = selectedChildId ? getRedeemHistory(selectedChildId) : [];
  const pendingCount = redeemHistory.filter((r) => r.status === 'pending').length;

  const handleApplyRedeem = () => {
    if (!selectedChildId || !selectedProduct) return;
    applyRedeem(selectedChildId, selectedProduct);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-gray-800">兑换商城</h1>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-card">
            <Award className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
              {currentChild?.currentStamps || 0}
            </span>
          </div>
        </div>

        {userRole === 'parent' && pendingCount > 0 && (
          <button
            onClick={() => navigate('/confirm-redeem')}
            className="w-full flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-200 mb-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800">待审批兑换</p>
                <p className="text-xs text-amber-600">{pendingCount} 个申请等待处理</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-amber-400" />
          </button>
        )}

        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.key
                  ? 'text-white shadow-md'
                  : 'bg-white text-gray-500 shadow-card'
              }`}
              style={activeCategory === cat.key ? { backgroundColor: 'var(--color-primary)' } : {}}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState message="该分类暂无商品" />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                name={product.name}
                icon={product.icon}
                price={product.price}
                onClick={() => setSelectedProduct(product)}
                index={index}
              />
            ))}
          </div>
        )}

        {redeemHistory.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-500 mb-3">兑换记录</h2>
            <div className="space-y-2">
              {redeemHistory.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-card">
                  <div className="text-2xl">🎁</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{record.productName}</p>
                    <p className="text-xs text-gray-400">{REDEEM_STATUS_LABELS[record.status]}</p>
                  </div>
                  <span className="text-sm font-bold text-red-500">-{record.stampCost}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title="确认兑换"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedProduct(null)}
              className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleApplyRedeem}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-colors"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              确认兑换
            </button>
          </div>
        }
      >
        {selectedProduct && (
          <div className="flex flex-col items-center py-4">
            <div className="text-6xl mb-3">{selectedProduct.icon}</div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{selectedProduct.name}</h3>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: 'var(--color-primary)10', color: 'var(--color-primary)' }}>
                <span>⭐</span>
                <span>需要 {selectedProduct.price}</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold bg-gray-100 text-gray-500">
                <span>⭐</span>
                <span>现有 {currentChild?.currentStamps || 0}</span>
              </div>
            </div>
            {(currentChild?.currentStamps || 0) < selectedProduct.price && (
              <p className="text-sm text-red-500 mt-3">印章不足，继续加油！</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
