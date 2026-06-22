import { MainLayout } from "@/components/layout/MainLayout";
import { useGetOrder } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, FileText, Phone, User, Clock } from "lucide-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";

export default function OrderConfirm() {
  const params = useParams();
  const orderId = Number(params.id);

  const { data: order, isLoading, isError } = useGetOrder(orderId, {
    query: {
      enabled: !!orderId,
    }
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 max-w-3xl">
          <Skeleton className="h-64 w-full rounded-3xl mb-8" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </MainLayout>
    );
  }

  if (isError || !order) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 text-center max-w-md flex flex-col items-center">
          <div className="w-24 h-24 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">!</span>
          </div>
          <h2 className="font-serif text-3xl font-bold mb-4">الطلب غير موجود</h2>
          <p className="text-muted-foreground mb-8">
            عذراً، لم نتمكن من العثور على تفاصيل الطلب المطلوب.
          </p>
          <Link href="/">
            <Button size="lg" className="rounded-full px-8">
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 md:px-6 py-16 max-w-3xl">
        
        {/* Success Header */}
        <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 text-center mb-8 relative overflow-hidden shadow-xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white text-primary rounded-full flex items-center justify-center mb-6 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">تم تأكيد طلبك!</h1>
            <p className="text-primary-foreground/90 text-lg max-w-md mx-auto mb-2">
              شكراً لك {order.customerName}، لقد استلمنا طلبك بنجاح وجاري تحضيره بكل حب.
            </p>
            <div className="inline-flex items-center bg-black/20 px-6 py-3 rounded-full mt-6 text-xl font-bold backdrop-blur-sm border border-white/10">
              رقم الطلب: #{order.id}
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 md:p-8 border-b">
            <h2 className="text-2xl font-bold mb-6">تفاصيل الفاتورة</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">الاسم</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">الجوال</p>
                  <p className="font-medium" dir="ltr">{order.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">وقت الطلب</p>
                  <p className="font-medium">
                    {format(new Date(order.createdAt), 'hh:mm a - dd MMMM', { locale: arSA })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">الحالة</p>
                  <div className="inline-flex px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold">
                    {order.status === 'pending' ? 'قيد التحضير' : order.status}
                  </div>
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="bg-muted/50 p-4 rounded-xl mb-2">
                <p className="text-sm text-muted-foreground mb-1 font-bold">ملاحظات الطلب:</p>
                <p className="text-sm">{order.notes}</p>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8 bg-muted/20">
            <h3 className="font-bold text-lg mb-6">المشروبات</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.menuItemId} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {item.quantity}x
                    </div>
                    <div>
                      <p className="font-bold">{item.menuItemNameAr}</p>
                      <p className="text-xs text-muted-foreground uppercase">{item.menuItemName}</p>
                    </div>
                  </div>
                  <div className="font-bold">
                    {item.subtotal} <span className="text-xs font-normal">ريال</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t flex justify-between items-center text-xl">
              <span className="font-bold">الإجمالي النهائي</span>
              <span className="font-bold text-primary text-3xl">
                {order.total} <span className="text-base font-normal">ريال</span>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/">
            <Button variant="outline" className="rounded-full px-8 h-12">
              العودة للرئيسية
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </MainLayout>
  );
}
