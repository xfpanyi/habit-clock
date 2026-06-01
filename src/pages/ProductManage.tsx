import { useEffect, useState } from 'react';
import { useProductStore } from '@/stores/productStore';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import { PRODUCT_CATEGORIES } from '@/utils/constants';

export default function ProductManage() {
  const { products, loadProducts, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🎁');
  const [price, setPrice] = useState(50);
  const [category, setCategory] = useState('toy');
  const [stock, setStock] = useState(999);

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSave = () => {
    if (!name.trim()) return;
    if (editingProduct) {
      updateProduct(editingProduct, { name: name.trim(), icon, price, category: category as 'toy' | 'snack' | 'stationery' | 'other', stock });
    } else {
      addProduct({ name: name.trim(), icon, price, category: category as 'toy' | 'snack' | 'stationery' | 'other', stock });
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setName('');
    setIcon('🎁');
    setPrice(50);
    setCategory('toy');
    setStock(999);
  };

  const handleEdit = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setEditingProduct(productId);
    setName(product.name);
    setIcon(product.icon);
    setPrice(product.price);
    setCategory(product.category);
    setStock(product.stock);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen pb-4">
      <Navbar title="商品管理" />
      <div className="px-5 pt-4 pb-4">
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 py-3 mb-4 rounded-xl text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-bold">添加商品</span>
        </button>

        {products.length === 0 ? (
          <EmptyState message="还没有商品" />
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-card">
                <div className="text-3xl">{product.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-xs text-gray-400">
                    {PRODUCT_CATEGORIES.find((c) => c.key === product.category)?.label} · 库存 {product.stock}
                  </p>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--color-primary)10', color: 'var(--color-primary)' }}>
                  <span>⭐</span>
                  <span>{product.price}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(product.id)} className="p-2 rounded-lg hover:bg-gray-100">
                    <Pencil className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={() => deleteProduct(product.id)} className="p-2 rounded-lg hover:bg-gray-100">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingProduct ? '编辑商品' : '添加商品'}
        footer={
          <div className="flex gap-3">
            <button onClick={closeModal} className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">取消</button>
            <button onClick={handleSave} className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-colors" style={{ backgroundColor: 'var(--color-primary)' }}>保存</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">商品名称</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="如：玩具汽车" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">图标</label>
              <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="emoji" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary text-center text-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">价格</label>
              <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} min={1} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">分类</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-primary">
                {PRODUCT_CATEGORIES.filter((c) => c.key !== 'all').map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">库存</label>
              <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} min={0} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
