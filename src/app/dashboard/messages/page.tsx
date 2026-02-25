'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { Database } from '@/types/database';

type Notification = Database['public']['Tables']['notifications']['Row'];

interface HireRequestData {
  type: 'hire_request';
  sender_id: string;
  sender_username: string;
  portfolio_title: string;
  budget: string | null;
}

interface Conversation {
  senderId: string;
  senderUsername: string;
  messages: Notification[];
  lastMessage: Notification;
  unreadCount: number;
}

export default function DashboardMessagesPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('[Messages] Fetch error:', error.message);
          setLoading(false);
          return;
        }

        // Filter hire requests and group by sender
        const allNotifs = (data ?? []) as unknown as Notification[];
        const hireRequests = allNotifs.filter((n) => {
          try {
            const d = n.data as Record<string, unknown> | null;
            return d && d.type === 'hire_request';
          } catch {
            return false;
          }
        });

        const grouped = new Map<string, Notification[]>();
        for (const notif of hireRequests) {
          try {
            const d = notif.data as unknown as HireRequestData;
            const senderId = d?.sender_id;
            if (!senderId) continue;
            if (!grouped.has(senderId)) {
              grouped.set(senderId, []);
            }
            grouped.get(senderId)!.push(notif);
          } catch {
            continue;
          }
        }

        const convos: Conversation[] = [];
        grouped.forEach((messages, senderId) => {
          const lastMessage = messages[0];
          const d = lastMessage.data as unknown as HireRequestData;
          convos.push({
            senderId,
            senderUsername: d?.sender_username || 'Unknown',
            messages,
            lastMessage,
            unreadCount: messages.filter((m) => !m.is_read).length,
          });
        });

        setConversations(convos);
        if (convos.length > 0) {
          setSelectedId(convos[0].senderId);
        }
      } catch (err) {
        console.error('[Messages] Unexpected error:', err);
      }
      setLoading(false);
    };
    fetchMessages();
  }, [user]);

  const markRead = async (convo: Conversation) => {
    const unread = convo.messages.filter((m) => !m.is_read);
    if (unread.length === 0) return;

    for (const msg of unread) {
      await supabase
        .from('notifications')
        .update({ is_read: true } as never)
        .eq('id', msg.id);
    }

    setConversations((prev) =>
      prev.map((c) =>
        c.senderId === convo.senderId
          ? { ...c, unreadCount: 0, messages: c.messages.map((m) => ({ ...m, is_read: true })) }
          : c
      )
    );
  };

  const selectedConvo = conversations.find((c) => c.senderId === selectedId);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-[22px] font-bold mb-6">
        Messages
      </h1>

      {loading ? (
        <div className="py-12 text-center text-[13px] text-[#999]">Loading...</div>
      ) : conversations.length === 0 ? (
        <div className="py-12 text-center">
          <div className="text-[40px] mb-3 opacity-30">💬</div>
          <div className="font-[family-name:var(--font-syne)] text-[14px] font-bold text-[#999] mb-2">
            No messages yet
          </div>
          <p className="text-[12px] text-[#ccc] mb-4">
            Hire requests and messages from buyers will appear here.
          </p>
          <Link
            href="/gallery"
            className="font-[family-name:var(--font-syne)] text-[11px] font-bold text-[#0a0a0a] underline"
          >
            Explore the Gallery
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] border border-[#e8e8e8] rounded-[12px] overflow-hidden min-h-[400px]">
          {/* Conversation list */}
          <div className="border-r border-[#e8e8e8] overflow-y-auto max-h-[600px]">
            {conversations.map((convo) => (
              <button
                key={convo.senderId}
                onClick={() => {
                  setSelectedId(convo.senderId);
                  markRead(convo);
                }}
                className={cn(
                  'w-full text-left px-4 py-3.5 border-b border-[#f0f0f0] last:border-b-0 transition-colors cursor-pointer bg-transparent',
                  selectedId === convo.senderId
                    ? 'bg-[#f7f7f7]'
                    : 'hover:bg-[#fafafa]'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-[family-name:var(--font-syne)] text-[13px] font-bold text-[#0a0a0a] truncate flex-1">
                    @{convo.senderUsername}
                  </span>
                  {convo.unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-[#ff4625] flex-shrink-0" />
                  )}
                </div>
                <div className="text-[11px] text-[#999] truncate">
                  {convo.lastMessage.title}
                </div>
                <div className="text-[10px] text-[#ccc] mt-0.5">
                  {new Date(convo.lastMessage.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </button>
            ))}
          </div>

          {/* Message detail */}
          <div className="p-5 overflow-y-auto max-h-[600px]">
            {selectedConvo ? (
              <div className="space-y-4">
                <div className="mb-4">
                  <h2 className="font-[family-name:var(--font-syne)] text-[16px] font-bold">
                    @{selectedConvo.senderUsername}
                  </h2>
                  <p className="text-[11px] text-[#999]">
                    {selectedConvo.messages.length} message{selectedConvo.messages.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {[...selectedConvo.messages].reverse().map((msg) => {
                  const d = msg.data as unknown as HireRequestData;
                  return (
                    <div
                      key={msg.id}
                      className="p-4 bg-[#f9f9f9] rounded-[10px] border border-[#f0f0f0]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-[family-name:var(--font-syne)] text-[12px] font-bold text-[#0a0a0a]">
                          {msg.title}
                        </span>
                        <span className="text-[10px] text-[#ccc]">
                          {new Date(msg.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      {d.portfolio_title && (
                        <div className="text-[11px] text-[#888] mb-2">
                          Re: {d.portfolio_title}
                        </div>
                      )}
                      {d.budget && (
                        <div className="inline-block text-[10px] font-bold bg-[#f0fdf4] text-[#16a34a] px-2 py-0.5 rounded-full mb-2">
                          Budget: {d.budget}
                        </div>
                      )}
                      {msg.message && (
                        <p className="text-[13px] text-[#333] leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-[13px] text-[#ccc]">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
