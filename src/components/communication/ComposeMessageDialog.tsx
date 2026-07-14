import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { MESSAGE_TYPES, useSendMessage } from "@/lib/communication/hooks";

const schema = z.object({
  recipient_id: z.string().min(1, "Recipient ID is required"),
  subject: z.string().optional(),
  body: z.string().min(2, "Message body is required"),
  message_type: z.string().default("general"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  schoolId: string;
  senderId: string;
  defaultRecipientId?: string;
  defaultSubject?: string;
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export function ComposeMessageDialog({
  schoolId, senderId, defaultRecipientId, defaultSubject, onSuccess, children,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const send = useSendMessage(schoolId);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      recipient_id: defaultRecipientId ?? "",
      subject: defaultSubject ?? "",
      body: "",
      message_type: "general",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        recipient_id: defaultRecipientId ?? "",
        subject: defaultSubject ?? "",
        body: "",
        message_type: "general",
      });
    }
  }, [open, defaultRecipientId, defaultSubject]);

  async function onSubmit(values: FormValues) {
    try {
      await send.mutateAsync({
        school_id: schoolId,
        sender_id: senderId,
        recipient_id: values.recipient_id,
        subject: values.subject || null,
        body: values.body,
        message_type: values.message_type,
        parent_message_id: null,
      });
      toast.success("Message sent");
      form.reset();
      setOpen(false);
      onSuccess?.();
    } catch (err: unknown) {
      toast.error((err as Error)?.message ?? "Failed to send message");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children ?? <Button size="sm">New Message</Button>}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="msg-recipient">Recipient User ID *</Label>
            <Input
              id="msg-recipient"
              placeholder="Paste recipient's user ID…"
              {...form.register("recipient_id")}
            />
            <p className="text-[11px] text-muted-foreground">
              Ask your school admin for staff user IDs, or reply to a message to auto-fill.
            </p>
            {form.formState.errors.recipient_id && (
              <p className="text-xs text-destructive">
                {form.formState.errors.recipient_id.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="msg-subject">Subject (optional)</Label>
            <Input id="msg-subject" placeholder="Subject…" {...form.register("subject")} />
          </div>

          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select
              defaultValue="general"
              onValueChange={(v) => form.setValue("message_type", v)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MESSAGE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="msg-body">Message *</Label>
            <Textarea
              id="msg-body"
              placeholder="Write your message…"
              rows={4}
              {...form.register("body")}
            />
            {form.formState.errors.body && (
              <p className="text-xs text-destructive">{form.formState.errors.body.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={send.isPending}>
              {send.isPending && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              Send
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
