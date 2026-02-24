'use client';

import { X, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { usePayment } from '@/hooks/usePayment';
import { cn } from '@/lib/utils';
import { CATEGORY_MAP } from '@/constants/categories';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, clearCart, totalPrice, itemCount } = useCart();
  const { openPayment } = usePayment();

  const handleCheckout = () => {
    if (items.length === 0) return;

    // For single item, use direct purchase
    if (items.length === 1) {
      openPayment({
        itemName: items[0].title,
        itemPrice: items[0].price,
        creatorUsername: items[0].creatorUsername,
        designId: items[0].designId,
      });
    } else {
      // Multi-item cart checkout
      openPayment({
        itemName: `${itemCount} items`,
        itemPrice: totalPrice,
        creatorUsername: 'multiple creators',
      });
    }

    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[600] bg-black/40 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 z-[601] w-[380px] max-w-[90vw] bg-white shadow-[-8px_0_32px_rgba(0,0,0,0.1)] transition-transform duration-300 flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f0f0]">
          <div className="font-[family-name:var(--font-syne)] text-[16px] font-bold">
            Cart ({itemCount})
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e8e8e8] bg-transparent cursor-pointer hover:bg-[#f5f5f5] transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-[32px] mb-3 opacity-30">&#x1F6D2;</div>
              <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold text-[#999]">
                Your cart is empty
              </div>
              <p className="text-[12px] text-[#bbb] mt-1">
                Browse the gallery to find designs you love.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => {
                const cat = CATEGORY_MAP[item.category];
                return (
                  <div
                    key={item.designId}
                    className="flex gap-3 p-3 rounded-[10px] border border-[#f0f0f0] bg-white"
                  >
                    <div
                      className="w-14 h-14 rounded-[8px] flex-shrink-0 flex items-center justify-center overflow-hidden"
                      style={{ background: cat?.color ?? '#f0f0f0' }}
                    >
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span
                          className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold opacity-25"
                          style={{ color: cat?.textColor ?? '#0a0a0a' }}
                        >
                          {item.title.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-[family-name:var(--font-syne)] text-[12px] font-bold text-[#111] truncate">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-[#bbb]">
                        @{item.creatorUsername}
                      </div>
                      <div className="font-[family-name:var(--font-syne)] text-[13px] font-bold mt-1">
                        ${item.price}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.designId)}
                      className="self-center w-7 h-7 flex items-center justify-center rounded-full bg-transparent border-none cursor-pointer text-[#ccc] hover:text-[#E8001A] hover:bg-[#fef2f2] transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#f0f0f0]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.08em] text-[#999]">
                Total
              </span>
              <span className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-[#0a0a0a] text-white rounded-[13px] border-none font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.06em] cursor-pointer hover:bg-[#333] transition-colors"
            >
              Checkout &rarr;
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-2 py-2 bg-transparent text-[#999] rounded-[13px] border-none font-[family-name:var(--font-syne)] text-[10px] font-bold cursor-pointer hover:text-[#E8001A] transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
