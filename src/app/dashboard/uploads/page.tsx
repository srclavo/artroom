'use client';

import { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CATEGORIES } from '@/constants/categories';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { PLATFORM_FEE_PERCENT } from '@/constants/platform';

interface UploadedFile {
  name: string;
  size: string;
  type: string;
  icon: string;
  file: File;
}

const FILE_ICONS: Record<string, string> = {
  PNG: '🖼', JPG: '📷', JPEG: '📷', SVG: '✏️', PDF: '📄', ZIP: '📦', FIG: '🎨',
};

export default function UploadsPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tags, setTags] = useState('');
  const [pricingType, setPricingType] = useState<'paid' | 'free' | 'donate'>('paid');
  const [price, setPrice] = useState('49');
  const [licenseType, setLicenseType] = useState('personal');
  const [isDragging, setIsDragging] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishedDesignId, setPublishedDesignId] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).map((f) => {
      const ext = f.name.split('.').pop()?.toUpperCase() ?? 'FILE';
      return {
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        type: ext,
        icon: FILE_ICONS[ext] ?? '📁',
        file: f,
      };
    });
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleSaveDraft = async () => {
    if (!user || !title) {
      setError('Please enter a title before saving.');
      return;
    }

    setIsSavingDraft(true);
    setError(null);

    try {
      // Upload thumbnail if files exist
      let thumbnailUrl: string | null = null;
      if (files.length > 0) {
        const thumbnailFile = files[0].file;
        const thumbnailExt = thumbnailFile.name.split('.').pop();
        const thumbnailPath = `${user.id}/${Date.now()}-draft-thumb.${thumbnailExt}`;

        const { error: uploadError } = await supabase.storage
          .from('thumbnails')
          .upload(thumbnailPath, thumbnailFile);

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('thumbnails')
            .getPublicUrl(thumbnailPath);
          thumbnailUrl = urlData.publicUrl;
        }
      }

      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);

      const { error: insertError } = await supabase
        .from('designs')
        .insert({
          creator_id: user.id,
          title,
          description: description || null,
          price: pricingType === 'free' ? 0 : parseFloat(price) || 0,
          category: selectedCategory,
          tags: tagList,
          thumbnail_url: thumbnailUrl,
          license_type: licenseType as 'personal' | 'commercial' | 'extended',
          status: 'draft',
        } as never)
        .select()
        .single();

      if (insertError) throw new Error(`Failed to save draft: ${insertError.message}`);

      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handlePublish = async () => {
    if (!user || !files.length || !title || !selectedCategory) {
      setError('Please fill in all required fields (title, category, and at least one file).');
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      // Upload thumbnail (first file) to Supabase Storage
      const thumbnailFile = files[0].file;
      const thumbnailExt = thumbnailFile.name.split('.').pop();
      const thumbnailPath = `${user.id}/${Date.now()}-thumbnail.${thumbnailExt}`;

      const { error: uploadError } = await supabase.storage
        .from('thumbnails')
        .upload(thumbnailPath, thumbnailFile);

      if (uploadError) throw new Error(`Thumbnail upload failed: ${uploadError.message}`);

      const { data: urlData } = supabase.storage
        .from('thumbnails')
        .getPublicUrl(thumbnailPath);

      const thumbnailUrl = urlData.publicUrl;

      // Upload design files (all files) to private storage
      let fileUrl: string | null = null;
      let fileSize: number | null = null;
      let fileFormat: string | null = null;

      if (files.length > 1 || files[0].file.size > 0) {
        const designFile = files[files.length > 1 ? 1 : 0].file;
        const designExt = designFile.name.split('.').pop();
        const designPath = `${user.id}/${Date.now()}-design.${designExt}`;

        const { error: fileError } = await supabase.storage
          .from('design-files')
          .upload(designPath, designFile);

        if (!fileError) {
          fileUrl = designPath;
          fileSize = designFile.size;
          fileFormat = designExt?.toUpperCase() ?? null;
        }
      }

      // Create design row in database
      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);

      const { data: design, error: insertError } = await supabase
        .from('designs')
        .insert({
          creator_id: user.id,
          title,
          description: description || null,
          price: pricingType === 'free' ? 0 : parseFloat(price) || 0,
          category: selectedCategory,
          tags: tagList,
          thumbnail_url: thumbnailUrl,
          file_url: fileUrl,
          file_size: fileSize,
          file_format: fileFormat,
          license_type: licenseType as 'personal' | 'commercial' | 'extended',
          status: 'published',
        } as never)
        .select()
        .single();

      if (insertError) throw new Error(`Failed to create listing: ${insertError.message}`);

      const created = design as unknown as { id: string } | null;
      setPublishedDesignId(created?.id ?? null);
      setIsPublished(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsPublishing(false);
    }
  };

  const priceNum = parseFloat(price) || 0;
  const creatorShare = (100 - PLATFORM_FEE_PERCENT) / 100;
  const earnings = pricingType === 'paid' ? (priceNum * creatorShare).toFixed(2) : '0';
  const displayPrice = pricingType === 'free' ? 'Free' : `$${price || '0'}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px]">
      {/* Left Panel - Form */}
      <div className="pr-0 lg:pr-8 lg:border-r border-[#e8e8e8]">
        <h1 className="font-[family-name:var(--font-syne)] text-[clamp(22px,3vw,36px)] font-extrabold tracking-[-0.03em] mb-1">
          Upload Work
        </h1>
        <p className="text-[14px] font-light text-[#999] leading-[1.75] mb-6">
          List your design work in the ArtRoom Gallery.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#ff4625]/20 rounded-lg text-[12px] text-[#ff4625]">
            {error}
          </div>
        )}

        {/* Steps */}
        <div className="flex border-b border-[#e8e8e8] mb-6">
          {[
            { n: 1, label: 'Files' },
            { n: 2, label: 'Details' },
            { n: 3, label: 'Pricing' },
          ].map((s) => (
            <button
              key={s.n}
              onClick={() => setStep(s.n)}
              className={cn(
                'flex items-center gap-2 pr-5 py-2.5 border-b-2 -mb-px transition-all cursor-pointer bg-transparent',
                step === s.n
                  ? 'border-[#0a0a0a] text-[#0a0a0a]'
                  : step > s.n
                    ? 'border-transparent text-[#2ec66d]'
                    : 'border-transparent text-[#ccc]'
              )}
            >
              <span
                className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-[1.5px]',
                  step > s.n
                    ? 'bg-[#2ec66d] text-white border-[#2ec66d]'
                    : step === s.n
                      ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                      : 'bg-transparent text-[#ccc] border-[#e8e8e8]'
                )}
              >
                {step > s.n ? '✓' : s.n}
              </span>
              <span className="font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.08em]">
                {s.label}
              </span>
            </button>
          ))}
        </div>

        {/* Step 1: Files */}
        {step === 1 && !isPublished && (
          <div>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput')?.click()}
              className={cn(
                'border-2 border-dashed rounded-[12px] py-16 px-6 text-center cursor-pointer transition-all',
                isDragging
                  ? 'border-[#0a0a0a] bg-[#fafafa]'
                  : 'border-[#e8e8e8] hover:border-[#0a0a0a] hover:bg-[#fafafa]'
              )}
            >
              <div className="text-[36px] mb-2">📁</div>
              <div className="font-[family-name:var(--font-syne)] text-[16px] font-bold mb-1">
                Drop your files here
              </div>
              <div className="text-[13px] text-[#999] mb-4">or click to browse...</div>
              <div className="flex flex-wrap justify-center gap-2">
                {['PNG', 'JPG', 'SVG', 'PDF', 'ZIP', 'Fig'].map((t) => (
                  <span key={t} className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full border border-[#e8e8e8] text-[#999]">
                    {t}
                  </span>
                ))}
              </div>
              <input
                id="fileInput"
                type="file"
                multiple
                accept="image/*,.pdf,.zip,.fig"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    const newFiles = Array.from(e.target.files).map((f) => {
                      const ext = f.name.split('.').pop()?.toUpperCase() ?? 'FILE';
                      return { name: f.name, size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`, type: ext, icon: FILE_ICONS[ext] ?? '📁', file: f };
                    });
                    setFiles((prev) => [...prev, ...newFiles]);
                  }
                }}
              />
            </div>

            {files.length > 0 && (
              <div className="mt-4 flex flex-col gap-2.5">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3.5 p-3 px-4 border border-[#e8e8e8] rounded-lg bg-[#fafafa]">
                    <div className="w-11 h-11 rounded-[6px] bg-[#f0f0f0] flex items-center justify-center text-[18px]">
                      {f.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-[#111] truncate">{f.name}</div>
                      <div className="text-[11px] text-[#bbb]">{f.size} · {f.type}</div>
                    </div>
                    <button
                      onClick={() => removeFile(i)}
                      className="text-[#bbb] hover:text-[#ff4625] cursor-pointer bg-transparent border-none transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-5">
              <Button onClick={() => setStep(2)}>Continue →</Button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && !isPublished && (
          <div>
            <Input label="Title" placeholder="e.g. Lumis Brand Identity System" value={title} onChange={(e) => setTitle(e.target.value)} />
            <div className="mb-3.5">
              <label className="block mb-1.5 font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.12em] text-[#999]">Description</label>
              <textarea
                className="w-full px-3.5 py-3 border border-[#e8e8e8] rounded-[8px] font-[family-name:var(--font-dm-sans)] text-[13px] font-light text-[#111] outline-none placeholder:text-[#ccc] focus:border-[#0a0a0a] focus:shadow-[0_0_0_3px_rgba(10,10,10,0.06)] transition-all resize-y min-h-[100px] leading-[1.65]"
                placeholder="What's included? Who is it for? What makes it special?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="mb-3.5">
              <label className="block mb-2 font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.12em] text-[#999]">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      'font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em]',
                      'px-4 py-[7px] rounded-full border-[1.5px] cursor-pointer transition-all',
                      selectedCategory === cat.id
                        ? 'border-transparent'
                        : 'bg-white border-[#e8e8e8] text-[#999] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'
                    )}
                    style={selectedCategory === cat.id ? { backgroundColor: cat.color, color: cat.textColor, borderColor: 'transparent' } : undefined}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <Input label="Tags" placeholder="brand, identity, minimal, dark" value={tags} onChange={(e) => setTags(e.target.value)} />
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
              <Button onClick={() => setStep(3)}>Continue →</Button>
            </div>
          </div>
        )}

        {/* Step 3: Pricing */}
        {step === 3 && !isPublished && (
          <div>
            <div className="flex border border-[#e8e8e8] rounded-full overflow-hidden mb-5">
              {(['paid', 'free', 'donate'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setPricingType(t)}
                  className={cn(
                    'flex-1 py-[9px] px-4 border-none font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.06em] cursor-pointer transition-all',
                    pricingType === t ? 'bg-[#0a0a0a] text-white' : 'bg-white text-[#999]'
                  )}
                >
                  {t === 'donate' ? 'Pay What You Want' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className={cn(pricingType === 'free' && 'opacity-40 pointer-events-none')}>
              <div className="grid grid-cols-2 gap-3.5 mb-4">
                <div>
                  <label className="block mb-1.5 font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.12em] text-[#999]">Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#bbb] pointer-events-none">$</span>
                    <input type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-8 pr-3 py-[11px] border border-[#e8e8e8] rounded-[8px] font-[family-name:var(--font-dm-sans)] text-[13px] font-light text-[#111] outline-none focus:border-[#0a0a0a] focus:shadow-[0_0_0_3px_rgba(10,10,10,0.06)] transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5 font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.12em] text-[#999]">License</label>
                  <select
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value)}
                    className="w-full py-[11px] px-3 border border-[#e8e8e8] rounded-[8px] font-[family-name:var(--font-dm-sans)] text-[13px] text-[#111] outline-none focus:border-[#0a0a0a] transition-all bg-white appearance-none cursor-pointer"
                  >
                    <option value="personal">Personal Use</option>
                    <option value="commercial">Commercial Use</option>
                    <option value="extended">Extended License</option>
                  </select>
                </div>
              </div>
              <div className="bg-[#fafafa] rounded-[8px] p-3.5 border border-[#e8e8e8]">
                <div className="flex justify-between text-[12px] text-[#888] mb-1">
                  <span>ArtRoom platform fee</span><span>{PLATFORM_FEE_PERCENT}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-[#888]">You receive</span>
                  <span className="font-[family-name:var(--font-syne)] text-[16px] font-extrabold text-[#2ec66d]">${earnings}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <Button variant="outline" onClick={() => setStep(2)}>← Back</Button>
              <Button variant="outline" onClick={handleSaveDraft} disabled={isSavingDraft}>
                {draftSaved ? '✓ Saved!' : isSavingDraft ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button onClick={handlePublish} disabled={isPublishing}>
                {isPublishing ? 'Publishing...' : 'Publish →'}
              </Button>
            </div>
          </div>
        )}

        {/* Success Screen */}
        {isPublished && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-[48px] mb-4">🎉</div>
            <h2 className="font-[family-name:var(--font-syne)] text-[28px] font-extrabold tracking-[-0.02em] mb-2">You&apos;re live!</h2>
            <p className="text-[13px] text-[#888] leading-[1.65] max-w-[340px] mb-6">Your listing is now live in the ArtRoom Gallery. Share it with the world!</p>
            <div className="flex gap-2">
              {publishedDesignId ? (
                <Link href={ROUTES.design(publishedDesignId)}>
                  <Button>View in Gallery</Button>
                </Link>
              ) : (
                <Link href={ROUTES.home}>
                  <Button>View Gallery</Button>
                </Link>
              )}
              <Link href={ROUTES.dashboard}>
                <Button variant="outline">Open My Studio</Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Preview */}
      <div className="hidden lg:block pl-7 sticky top-0 self-start">
        <div className="flex items-center gap-3.5 mb-4">
          <span className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.2em] text-[#bbb]">Preview</span>
          <span className="flex-1 h-px bg-[#f0f0f0]" />
        </div>
        <div className="rounded-[10px] border border-[#e8e8e8] overflow-hidden mb-5">
          <div className="h-[220px] bg-[#f7f7f7] flex items-center justify-center">
            {files.length > 0 ? (
              <span className="text-[32px]">{files[0].icon}</span>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <span className="text-[32px]">🖼</span>
                <span className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.12em] text-[#ccc]">Upload to preview</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="text-[14px] text-[#111] mb-2">{title || 'Untitled Listing'}</div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#bbb]">you.artroom</span>
              <span className="font-[family-name:var(--font-syne)] text-[16px] font-bold">{displayPrice}</span>
            </div>
          </div>
        </div>
        <div className="bg-[#fafafa] rounded-[10px] border border-[#e8e8e8] p-5">
          <div className="font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.1em] text-[#bbb] mb-3.5">Tips</div>
          {[
            { icon: '✦', text: 'High-quality preview images increase sales by 3×' },
            { icon: '$', text: 'Listings priced between $29–$99 have highest conversion rate' },
            { icon: '🏷', text: 'Add 5–8 tags to improve search visibility' },
            { icon: '📦', text: 'Bundles sell 60% more than single items' },
          ].map((tip, i) => (
            <div key={i} className="flex gap-2.5 mb-3 last:mb-0">
              <div className="w-5 h-5 rounded-full bg-[#f0f0f0] flex items-center justify-center text-[10px] flex-shrink-0">{tip.icon}</div>
              <p className="text-[12px] leading-[1.6] text-[#555]">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
