'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICONS: Record<string, string> = {
  sale: '$',
  purchase: '\u2193',
  follow: '\u2795',
  like: '\u2764',
  system: '\u2699',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[550]" onClick={onClose} />

      {/* Dropdown */}
      <div className="absolute top-full right-0 mt-2 w-[340px] max-h-[420px] bg-white rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[#e8e8e8] z-[551] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f0f0]">
          <span className="font-[family-name:var(--font-syne)] text-[12px] font-bold">
            Notifications
          </span>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="font-[family-name:var(--font-syne)] text-[9px] font-bold text-[#999] bg-transparent border-none cursor-pointer hover:text-[#0a0a0a] transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-10 text-center">
              <div className="text-[11px] text-[#bbb]">No notifications yet</div>
            </div>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  if (!n.is_read) markAsRead(n.id);
                }}
                className={cn(
                  'w-full flex items-start gap-3 px-4 py-3 text-left bg-transparent border-none cursor-pointer hover:bg-[#f9f9f9] transition-colors border-b border-[#f5f5f5]',
                  !n.is_read && 'bg-[#f7f5ff]'
                )}
              >
                <div className="w-7 h-7 rounded-full bg-[#f0f0f0] flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5">
                  {ICONS[n.type] || '\u2022'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-[family-name:var(--font-syne)] text-[11px] font-bold text-[#111]">
                    {n.title}
                  </div>
                  {n.message && (
                    <div className="text-[10px] text-[#888] mt-0.5 truncate">
                      {n.message}
                    </div>
                  )}
                  <div className="text-[9px] text-[#ccc] mt-1">
                    {timeAgo(n.created_at)}
                  </div>
                </div>
                {!n.is_read && (
                  <span className="w-2 h-2 rounded-full bg-[#635BFF] mt-2 flex-shrink-0" />
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
