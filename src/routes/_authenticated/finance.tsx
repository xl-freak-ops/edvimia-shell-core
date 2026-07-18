import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Wallet, Receipt, Layers, Settings2, TrendingDown, Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useSessions, useTerms, useSchool } from "@/lib/school/hooks";
import {
  useInvoices, useRecentPayments, useExpenses,
} from "@/lib/finance/hooks";
import { FinanceStats } from "@/components/finance/FinanceStats";
import { FinanceInsights } from "@/components/finance/FinanceInsights";
import { FeeCategoriesPanel } from "@/components/finance/FeeCategoriesPanel";
import { FeeStructuresPanel } from "@/components/finance/FeeStructuresPanel";
import { InvoicesPanel } from "@/components/finance/InvoicesPanel";
import { PaymentsList } from "@/components/finance/PaymentsList";
import { ExpensesPanel } from "@/components/finance/ExpensesPanel";
import { ReceiptDialog } from "@/components/finance/ReceiptDialog";

function FinanceError({ error }: { error: Error }) {
  return (
    <div className="m-8 rounded-lg border border-destructive/40 bg-destructive/10 p-6">
      <p className="font-semibold text-destructive">Finance page error (debug)</p>
      <pre className="mt-2 whitespace-pre-wrap text-xs text-destructive/80">{error?.message}{"\n"}{error?.stack}</pre>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/finance")({
  head: () => ({ meta: [{ title: "Finance · Edvimia" }] }),
  component: FinancePage,
  errorComponent: FinanceError,
});

const FINANCE_ROLES = new Set(["school_admin", "super_admin", "principal", "vice_principal"]);

function FinancePage() {
  const { school, roles } = useAuth();
  const canViewFinance = roles.some((r) => FINANCE_ROLES.has(r));
  const schoolId = school?.id ?? null;
  const schoolQ = useSchool(schoolId);
  const currency = (schoolQ.data as { currency?: string } | null)?.currency ?? "NGN";
  const sessions = useSessions(schoolId);
  const terms = useTerms(schoolId);
  const currentTerm = terms.data?.find((t) => t.is_current) ?? terms.data?.[0] ?? null;
  const [termId, setTermId] = React.useState<string>("");
  React.useEffect(() => { if (!termId && currentTerm) setTermId(currentTerm.id); }, [currentTerm, termId]);

  const invoices = useInvoices(schoolId, termId || null);
  const payments = useRecentPayments(schoolId, 200);
  const expenses = useExpenses(schoolId);
  const [receiptId, setReceiptId] = React.useState<string | null>(null);

  if (!canViewFinance) {
    return (
      <AppShell>
        <div className="flex h-[70vh] flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
            <Lock className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Access Restricted</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Finance information is only visible to school administrators.
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
            <p className="text-sm text-muted-foreground">
              Fees, invoices, payments, receipts and expenses for {school?.name ?? "your school"}.
            </p>
          </div>
          <Select value={termId} onValueChange={setTermId}>
            <SelectTrigger className="h-9 w-56"><SelectValue placeholder="All terms" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All terms</SelectItem>
              {(terms.data ?? []).map((t) => {
                const ses = sessions.data?.find((s) => s.id === t.session_id);
                return <SelectItem key={t.id} value={t.id}>{ses ? `${ses.name} · ` : ""}{t.name}</SelectItem>;
              })}
            </SelectContent>
          </Select>
        </div>

        <FinanceStats
          invoices={(invoices.data ?? []) as Array<Record<string, unknown>> as never}
          payments={(payments.data ?? []) as Array<Record<string, unknown>> as never}
          expenses={(expenses.data ?? []) as Array<Record<string, unknown>> as never}
          currency={currency}
        />

        <FinanceInsights
          invoices={(invoices.data ?? []) as Array<Record<string, unknown>> as never}
          payments={(payments.data ?? []) as Array<Record<string, unknown>> as never}
          currency={currency}
        />

        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="invoices"><Receipt className="mr-1.5 h-3.5 w-3.5" /> Invoices</TabsTrigger>
            <TabsTrigger value="payments"><Wallet className="mr-1.5 h-3.5 w-3.5" /> Payments</TabsTrigger>
            <TabsTrigger value="expenses"><TrendingDown className="mr-1.5 h-3.5 w-3.5" /> Expenses</TabsTrigger>
            <TabsTrigger value="fees"><Layers className="mr-1.5 h-3.5 w-3.5" /> Fee structure</TabsTrigger>
            <TabsTrigger value="setup"><Settings2 className="mr-1.5 h-3.5 w-3.5" /> Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            {schoolId && (
              <InvoicesPanel schoolId={schoolId} termId={termId || null} currency={currency} />
            )}
          </TabsContent>
          <TabsContent value="payments">
            <PaymentsList
              payments={(payments.data ?? []) as Array<Record<string, unknown>> as never}
              currency={currency}
              onOpenReceipt={setReceiptId}
            />
          </TabsContent>
          <TabsContent value="expenses">
            {schoolId && <ExpensesPanel schoolId={schoolId} currency={currency} />}
          </TabsContent>
          <TabsContent value="fees">
            {schoolId && <FeeStructuresPanel schoolId={schoolId} currency={currency} />}
          </TabsContent>
          <TabsContent value="setup">
            {schoolId && <FeeCategoriesPanel schoolId={schoolId} />}
          </TabsContent>
        </Tabs>

        <ReceiptDialog
          paymentId={receiptId}
          open={!!receiptId}
          onOpenChange={(v) => !v && setReceiptId(null)}
          currency={currency}
        />
      </div>
    </AppShell>
  );
}