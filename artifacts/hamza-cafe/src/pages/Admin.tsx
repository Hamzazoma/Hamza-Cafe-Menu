import { useState } from "react";
import { useListOrders, useUpdateOrderStatus, getListOrdersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Coffee, Lock, LogOut, Clock, CheckCircle, ChefHat, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "hamza27h";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "انتظار", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: <Clock className="w-3 h-3" /> },
  preparing: { label: "قيد التحضير", color: "bg-blue-100 text-blue-800 border-blue-200", icon: <ChefHat className="w-3 h-3" /> },
  ready: { label: "جاهز", color: "bg-green-100 text-green-800 border-green-200", icon: <CheckCircle className="w-3 h-3" /> },
  cancelled: { label: "ملغي", color: "bg-red-100 text-red-800 border-red-200", icon: <XCircle className="w-3 h-3" /> },
};

const NEXT_STATUS: Record<string, string> = {
  pending: "preparing",
  preparing: "ready",
  ready: "cancelled",
  cancelled: "pending",
};

const NEXT_STATUS_LABEL: Record<string, string> = {
  pending: "ابدأ التحضير",
  preparing: "جاهز للاستلام",
  ready: "إلغاء",
  cancelled: "أعد تفعيل",
};

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setPassword("");
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a0e08 0%, #3d2010 60%, #6b3d2a 100%)" }}>
      <div className="w-full max-w-sm mx-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #5c2f1a, #c8855a)" }}>
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="font-bold text-2xl text-gray-900 mb-1">لوحة التحكم</h1>
            <p className="text-gray-500 text-sm">حمزه كافيه — أدمن فقط</p>
          </div>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4" dir="rtl">
            <Input
              type="password"
              placeholder="كلمة السر"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`h-12 text-center text-lg tracking-widest border-2 rounded-xl transition-colors ${error ? "border-red-400 bg-red-50 placeholder:text-red-300" : "border-gray-200 focus:border-amber-500"}`}
              data-testid="input-admin-password"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm text-center animate-in slide-in-from-top-2">كلمة السر غلط، حاول تاني</p>
            )}
            <Button
              type="submit"
              className="h-12 rounded-xl text-base font-bold"
              style={{ background: "linear-gradient(135deg, #5c2f1a, #c8855a)" }}
              data-testid="button-admin-login"
            >
              دخول
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading, refetch } = useListOrders({
    query: { enabled: isAuthenticated, queryKey: getListOrdersQueryKey() }
  });

  const updateStatus = useUpdateOrderStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        toast({ title: "تم تحديث الحالة" });
      },
      onError: () => {
        toast({ title: "حصل خطأ", variant: "destructive" });
      },
    },
  });

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  const sortedOrders = [...(orders ?? [])].reverse();
  const pendingCount = orders?.filter((o) => o.status === "pending").length ?? 0;
  const preparingCount = orders?.filter((o) => o.status === "preparing").length ?? 0;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #5c2f1a, #c8855a)" }}>
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-none">لوحة التحكم</h1>
              <p className="text-xs text-gray-400">حمزه كافيه</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200 font-bold px-3">
                {pendingCount} طلب جديد
              </Badge>
            )}
            {preparingCount > 0 && (
              <Badge className="bg-blue-100 text-blue-800 border border-blue-200 font-bold px-3">
                {preparingCount} قيد التحضير
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              data-testid="button-refresh-orders"
              className="text-gray-500"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAuthenticated(false)}
              data-testid="button-admin-logout"
              className="text-gray-500"
            >
              <LogOut className="w-4 h-4" />
              <span className="mr-1 text-sm">خروج</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <RefreshCw className="w-6 h-6 animate-spin ml-2" />
            <span>تحميل الطلبات...</span>
          </div>
        ) : sortedOrders.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Coffee className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">لا توجد طلبات بعد</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedOrders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG["pending"];
              const nextStatus = NEXT_STATUS[order.status];
              const nextLabel = NEXT_STATUS_LABEL[order.status];
              const isUpdating = updateStatus.isPending;

              return (
                <div
                  key={order.id}
                  data-testid={`card-order-${order.id}`}
                  className="bg-white rounded-2xl border shadow-sm p-5 flex flex-col md:flex-row md:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-bold text-lg">#{order.id}</span>
                      <span className="font-semibold text-gray-800">{order.customerName}</span>
                      <span className="text-gray-400 text-sm" dir="ltr">{order.phone}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${statusCfg.color}`}>
                        {statusCfg.icon}
                        {statusCfg.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {order.items.map((item, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-lg">
                          {item.menuItemNameAr} × {item.quantity}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>الإجمالي: <span className="font-bold text-gray-700">{order.total} ريال</span></span>
                      <span>{new Date(order.createdAt).toLocaleString("ar-SA", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}</span>
                    </div>
                    {order.notes && (
                      <p className="mt-1 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-1 border border-amber-100">
                        ملاحظة: {order.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {nextStatus && (
                      <Button
                        size="sm"
                        disabled={isUpdating}
                        data-testid={`button-update-order-${order.id}`}
                        onClick={() =>
                          updateStatus.mutate({ id: order.id, data: { status: nextStatus } })
                        }
                        className="rounded-xl font-semibold"
                        variant={order.status === "ready" ? "destructive" : "default"}
                        style={order.status !== "ready" && order.status !== "cancelled" ? { background: "linear-gradient(135deg, #5c2f1a, #c8855a)" } : {}}
                      >
                        {nextLabel}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
