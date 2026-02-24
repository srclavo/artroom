'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useCollections } from '@/hooks/useCollections';
import { cn } from '@/lib/utils';

interface SaveToCollectionModalProps {
  designId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SaveToCollectionModal({ designId, isOpen, onClose }: SaveToCollectionModalProps) {
  const { collections, createCollection, addToCollection } = useCollections();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [saved, setSaved] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdd = async (collectionId: string) => {
    await addToCollection(collectionId, designId);
    setSaved(collectionId);
    setTimeout(() => { setSaved(null); onClose(); }, 800);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const col = await createCollection(newName.trim());
    if (col) {
      await addToCollection(col.id, designId);
      setSaved(col.id);
      setNewName('');
      setCreating(false);
      setTimeout(() => { setSaved(null); onClose(); }, 800);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[600]" onClick={onClose} />
      <div className="absolute top-full left-0 mt-1.5 w-[220px] bg-white rounded-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.14)] border border-[#e8e8e8] z-[601] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#f0f0f0]">
          <span className="font-[family-name:var(--font-syne)] text-[10px] font-bold">Save to Collection</span>
          <button onClick={onClose} className="w-5 h-5 flex items-center justify-center cursor-pointer bg-transparent border-none text-[#999] hover:text-[#0a0a0a]">
            <X size={12} />
          </button>
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => handleAdd(col.id)}
              className={cn(
                'w-full text-left px-3 py-2.5 text-[12px] bg-transparent border-none cursor-pointer hover:bg-[#f9f9f9] transition-colors flex items-center justify-between',
                saved === col.id && 'bg-[#f0fdf4]'
              )}
            >
              <span className="truncate text-[#333]">{col.name}</span>
              {saved === col.id && <span className="text-[#16a34a] text-[10px]">Added!</span>}
            </button>
          ))}
        </div>
        <div className="border-t border-[#f0f0f0]">
          {creating ? (
            <div className="flex gap-1.5 p-2">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="Collection name"
                className="flex-1 px-2 py-1.5 border border-[#e8e8e8] rounded-[6px] text-[11px] outline-none focus:border-[#0a0a0a]"
              />
              <button onClick={handleCreate} className="px-2.5 py-1.5 bg-[#0a0a0a] text-white text-[9px] font-bold rounded-[6px] border-none cursor-pointer">
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-[11px] font-[family-name:var(--font-syne)] font-bold text-[#999] bg-transparent border-none cursor-pointer hover:text-[#0a0a0a] hover:bg-[#f9f9f9] transition-colors"
            >
              <Plus size={12} /> New Collection
            </button>
          )}
        </div>
      </div>
    </>
  );
}
