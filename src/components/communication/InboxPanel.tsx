import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { Send, Loader2, MailOpen, Reply } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { useMessages, useMarkMessageRead, type Message } from "@/lib/communication/hooks";
import { ComposeMessageDialog } from "./ComposeMessageDialog";

interface Props {
  schoolId: string;
  userId: string;
  isAdmin?: boolean;
}

export function InboxPanel({ schoolId, userId, isAdmin = false }: Props) {
  const { data: messages = [], isLoading } = useMessages(userId, schoolId);
  const markRead = useMarkMessageRead();
  const [selected, setSelected] = React.useState<Message | null>(null);

  const inbox = messages.filter((m) => m.recipient_id === userId);
  const sent = messages.filter((m) => m.sender_id === userId);
  const unreadCount = inbox.filter((m) => !m.is_read).length;

  async function handleOpen(msg: Message) {
    setSelected(msg);
    if (!msg.is_read && msg.recipient_id === userId) {
      try { await markRead.mutateAsync(msg.id); } catch { /* silent */ }
    }
  }

  function initials(id: string) {
    return id.slice(0, 2).toUpperCase();
  }

  function MessageRow({ msg }: { msg: Message }) {
    const isSelected = selected?.id === msg.id;
    const isUnread = !msg.is_read && msg.recipient_id === userId;
    return (
      <button
        className={cn(
          "w-full flex items-start gap-3 rounded-xl p-3 text-left transition-colors",
          "hover:bg-muted/60",
          isSelected && "bg-primary/8 ring-1 ring-primary/20",
        )}
        onClick={() => handleOpen(msg)}
      >
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-[11px] bg-gradient-to-br from-primary/20 to-accent-brand/20">
            {initials(msg.sender_id)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={cn("text-sm truncate", isUnread && "font-semibold")}>
              {msg.subject ?? "(No subject)"}
            </span>
            {isUnread && (
              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{msg.body}</p>
          <p className="text-[10px] text-muted-foreground/70 mt-0.5">
            {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
          </p>
        </div>
      </button>
    );
  }

  function MessageDetail({ msg }: { msg: Message }) {
    return (
      <div className="rounded-xl border bg-card p-4 space-y-3 animate-fade-in">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold">{msg.subject ?? "(No subject)"}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(msg.created_at).toLocaleString()}
            </p>
          </div>
          <ComposeMessageDialog
            schoolId={schoolId}
            senderId={userId}
            defaultRecipientId={msg.sender_id !== userId ? msg.sender_id : msg.recipient_id}
            defaultSubject={`Re: ${msg.subject ?? "(No subject)"}`}
          >
            <Button size="sm" variant="outline" className="gap-1.5 shrink-0">
              <Reply className="h-3.5 w-3.5" />
              Reply
            </Button>
          </ComposeMessageDialog>
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.body}</p>
      </div>
    );
  }

  function MsgList({ list }: { list: Message[] }) {
    if (isLoading) {
      return (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      );
    }
    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-muted/30 px-6 py-10 text-center">
          <MailOpen className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No messages yet</p>
        </div>
      );
    }
    return (
      <div className="space-y-1">
        {list.map((m) => <MessageRow key={m.id} msg={m} />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "All caught up"}
        </p>
        <ComposeMessageDialog schoolId={schoolId} senderId={userId}>
          <Button size="sm" className="gap-1.5">
            <Send className="h-4 w-4" />
            New Message
          </Button>
        </ComposeMessageDialog>
      </div>

      <Tabs defaultValue="inbox">
        <TabsList>
          <TabsTrigger value="inbox">
            Inbox
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-1.5 text-[10px] px-1.5 py-0 bg-primary">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          {isAdmin && <TabsTrigger value="all">All</TabsTrigger>}
        </TabsList>

        <TabsContent value="inbox" className="mt-4 space-y-3">
          <MsgList list={inbox} />
          {selected && <MessageDetail msg={selected} />}
        </TabsContent>
        <TabsContent value="sent" className="mt-4 space-y-3">
          <MsgList list={sent} />
          {selected && selected.sender_id === userId && <MessageDetail msg={selected} />}
        </TabsContent>
        {isAdmin && (
          <TabsContent value="all" className="mt-4 space-y-3">
            <MsgList list={messages} />
            {selected && <MessageDetail msg={selected} />}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
