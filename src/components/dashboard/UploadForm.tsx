'use client';

import { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CATEGORIES } from '@/constants/categories';
import { cn } from '@/lib/utils';
import { PLATFORM_FEE_PERCENT } from '@/constants/platform';

interface UploadedFile {
  name: string;
  size: string;
  type: string;
}

export function UploadForm() {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tags, setTags] = useState('');
  const [pricingType, setPricingType] = useState<'paid' | 'free' | 'donate'>('paid');
  const [price, setPrice] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).map((f) => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      type: f.name.split('.').pop()?.toUpperCase() ?? 'FILE',
    }));
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const feeRate = PLATFORM_FEE_PERCENT / 100;
  const platformFee = pricingType === 'paid' && price ? (parseFloat(price) * feeRate).toFixed(2) : '0';
  const earnings = pricingType === 'paid' && price ? (parseFloat(price) * (1 - feeRate)).toFixed(2) : '0';

  return (
    <div>
      {/* Steps */}
      <div className="flex border-b border-[#e8e8e8] mb-6">
        {[
          { n: 1, label: 'Upload' },
          { n: 2, label: 'Details' },
          { n: 3, label: 'Pricing' },
        ].map((s) => (
          <button
            key={s.n}
            onClick={() => setStep(s.n)}
            className={cn(
              'flex items-center gap-2 px-5 py-3 border-b-2 -mb-px transition-all cursor-pointer bg-transparent',
              step === s.n
                ? 'border-[#0a0a0a] text-[#0a0a0a]'
                : step > s.n
                  ? 'border-transparent text-[#2ec66d]'
                  : 'border-transparent text-[#999]'
            )}
          >
            <span
              className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                step >= s.n ? 'bg-[#0a0a0a] text-white' : 'bg-[#e8e8e8] text-[#999]'
              )}
            >
              {step > s.n ? '✓' : s.n}
            </span>
            <span className="font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.06em]">
              {s.label}
            </span>
          </button>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-[12px] p-10 text-center cursor-pointer transition-all',
              isDragging
                ? 'border-[#0a0a0a] bg-[#fafafa]'
                : 'border-[#e8e8e8] hover:border-[#ccc]'
            )}
          >
            <Upload size={32} className="mx-auto mb-3 text-[#ccc]" />
            <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold mb-1">
              Drop files here
            </div>
            <div className="text-[12px] text-[#999]">
              PNG, JPG, GIF, PDF up to 100MB
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 border border-[#e8e8e8] rounded-lg"
                >
                  <div className="w-11 h-11 bg-[#f5f5f5] rounded-lg flex items-center justify-center text-[10px] font-bold text-[#888]">
                    {f.type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-[#111] truncate">{f.name}</div>
                    <div className="text-[11px] text-[#bbb]">{f.size}</div>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="text-[#ccc] hover:text-[#ff4625] cursor-pointer bg-transparent border-none transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <Button onClick={() => setStep(2)}>Continue →</Button>
          </div>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div>
          <Input
            label="Title"
            placeholder="Title — e.g. Lumis Brand System"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="mb-3.5">
            <label className="block mb-1.5 font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.12em] text-[#bbb]">
              Description
            </label>
            <textarea
              className="w-full px-3.5 py-3 border-[1.5px] border-[#e8e8e8] rounded-[10px] font-[family-name:var(--font-dm-sans)] text-sm text-[#111] outline-none placeholder:text-[#ccc] focus:border-[#0a0a0a] focus:shadow-[0_0_0_3px_rgba(10,10,10,0.06)] transition-all resize-y min-h-[100px]"
              placeholder="Describe your design..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-3.5">
            <label className="block mb-2 font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.12em] text-[#bbb]">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em]',
                    'px-4 py-1.5 rounded-full border-[1.5px] cursor-pointer transition-all',
                    selectedCategory === cat.id
                      ? 'text-white border-transparent'
                      : 'bg-white border-[#e8e8e8] hover:border-[#0a0a0a]'
                  )}
                  style={
                    selectedCategory === cat.id
                      ? { backgroundColor: cat.color, color: cat.textColor }
                      : { color: '#666' }
                  }
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Tags"
            placeholder="brand, identity, systems"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              ← Back
            </Button>
            <Button onClick={() => setStep(3)}>Continue →</Button>
          </div>
        </div>
      )}

      {/* Step 3: Pricing */}
      {step === 3 && (
        <div>
          <div className="flex gap-1 bg-[#f5f5f5] p-1 rounded-[10px] mb-5">
            {(['paid', 'free', 'donate'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setPricingType(t)}
                className={cn(
                  'flex-1 py-2 rounded-[8px] border-none font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em] cursor-pointer transition-all',
                  pricingType === t
                    ? 'bg-[#0a0a0a] text-white'
                    : 'bg-transparent text-[#999]'
                )}
              >
                {t === 'donate' ? 'Pay What You Want' : t}
              </button>
            ))}
          </div>

          {pricingType === 'paid' && (
            <>
              <div className="relative mb-4">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999] font-[family-name:var(--font-dm-mono)] text-[16px]">
                  $
                </span>
                <input
                  type="text"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ''))}
                  className="w-full pl-8 pr-4 py-3 border-[1.5px] border-[#e8e8e8] rounded-[10px] font-[family-name:var(--font-dm-mono)] text-[20px] text-[#111] outline-none focus:border-[#0a0a0a] transition-all"
                />
              </div>

              {price && (
                <div className="bg-[#fafafa] rounded-[10px] p-4 mb-4">
                  <div className="flex justify-between text-[12px] text-[#888] mb-1">
                    <span>Platform fee ({PLATFORM_FEE_PERCENT}%)</span>
                    <span>${platformFee}</span>
                  </div>
                  <div className="flex justify-between font-[family-name:var(--font-syne)] text-[14px] font-bold">
                    <span>Your earnings</span>
                    <span className="text-[#2ec66d]">${earnings}</span>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setStep(2)}>
              ← Back
            </Button>
            <Button variant="outline">Save Draft</Button>
            <Button>Publish →</Button>
          </div>
        </div>
      )}
    </div>
  );
}
