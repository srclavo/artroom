'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const supabase = createClient();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setBio(profile.bio || '');
      setWebsite(profile.website_url || '');
      setWalletAddress(profile.wallet_address || '');
    }
  }, [profile]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName || null,
        bio: bio || null,
        website_url: website || null,
        wallet_address: walletAddress || null,
      } as never)
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      showToast('Failed to save changes');
    } else {
      showToast('Settings saved successfully');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return;
    const file = e.target.files[0];
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file);

    if (uploadError) {
      showToast('Avatar upload failed');
      return;
    }

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(path);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: urlData.publicUrl } as never)
      .eq('id', user.id);

    if (updateError) {
      showToast('Failed to update avatar');
    } else {
      showToast('Avatar updated');
    }
  };

  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-[22px] font-bold mb-6">
        Settings
      </h1>

      <div className="max-w-lg">
        <section className="mb-8">
          <h2 className="font-[family-name:var(--font-syne)] text-[14px] font-bold mb-4">
            Profile
          </h2>

          {/* Avatar upload */}
          <div className="mb-4">
            <label className="block mb-1.5 font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.12em] text-[#bbb]">
              Avatar
            </label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#f0f0f0] flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-[family-name:var(--font-syne)] text-[18px] font-bold text-[#ccc]">
                    {(displayName || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <label className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em] px-4 py-2 rounded-full border-[1.5px] border-[#e8e8e8] bg-white text-[#888] cursor-pointer hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-all">
                Upload Photo
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
          </div>

          <Input
            label="Display Name"
            placeholder="Your full name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <div className="mb-3.5">
            <label className="block mb-1.5 font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.12em] text-[#bbb]">
              Bio
            </label>
            <textarea
              className="w-full px-3.5 py-3 border-[1.5px] border-[#e8e8e8] rounded-[10px] font-[family-name:var(--font-dm-sans)] text-sm text-[#111] outline-none placeholder:text-[#ccc] focus:border-[#0a0a0a] focus:shadow-[0_0_0_3px_rgba(10,10,10,0.06)] transition-all resize-y min-h-[80px]"
              placeholder="Tell the world about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <Input
            label="Website"
            placeholder="https://yourwebsite.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </section>

        <section className="mb-8">
          <h2 className="font-[family-name:var(--font-syne)] text-[14px] font-bold mb-4">
            Payments
          </h2>
          <Input
            label="USDC Wallet Address"
            placeholder="Your wallet address for USDC payouts"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          <div className="p-4 bg-[#f5f5f5] rounded-[10px] border border-[#e8e8e8]">
            <div className="font-[family-name:var(--font-syne)] text-[11px] font-bold mb-1">
              Stripe Connect
            </div>
            <p className="text-[12px] text-[#888] mb-3">
              Connect your Stripe account to receive card payments.
            </p>
            <Button size="sm">Connect Stripe →</Button>
          </div>
        </section>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Toast */}
      <div className={`fixed bottom-7 right-7 z-[600] bg-[#0a0a0a] text-white font-[family-name:var(--font-syne)] text-[12px] font-bold px-6 py-3 rounded-full transition-all duration-300 pointer-events-none ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'}`}>
        {toast}
      </div>
    </div>
  );
}
