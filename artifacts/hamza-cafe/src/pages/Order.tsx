import { MainLayout } from "@/components/layout/MainLayout";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCreateOrder } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const orderSchema = z.object({
  customerName: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  phone: z.string().min(10, "رقم الجوال غير صحيح").regex(/^[0-9]+$/, "أرقام فقط"),
  notes: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export default function Order() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const createOrder = useCreateOrder();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      notes: "",
    },
  });

  const onSubmit = (data: OrderFormValues) => {
    if (items.length === 0) {
      toast.error("السلة فارغة");
      return;
    }

    createOrder.mutate(
      {
        data: {
          customerName: data.customerName,
          phone: data.phone,
          notes: data.notes || null,
          items: items.map((item) => ({
            menuItemId: item.menuItem.id,
            quantity: item.quantity,
          })),
        },
      },
      {
        onSuccess: (order) => {
          clearCart();
          toast.success("تم تأكيد الطلب بنجاح");
          setLocation(`/order/confirm/${order.id}`);
        },
        onError: () => {
          toast.error("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.");
        },
      }
    );
  };

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 text-center max-w-md flex flex-col items-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <Trash2 className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="font-serif text-3xl font-bold mb-4">السلة فارغة</h2>
          <p className="text-muted-foreground mb-8">
            لم تقم بإضافة أي مشروبات إلى السلة بعد. تصفح قائمتنا واكتشف مشروبك المفضل.
          </p>
          <Link href="/menu">
            <Button size="lg" className="rounded-full px-8">
              الذهاب إلى القائمة
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-primary/5 py-8 md:py-12 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">إتمام الطلب</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Order Form */}
          <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
            <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="font-bold text-2xl mb-8 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
                معلومات المستلم
              </h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">الاسم الكريم</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل اسمك" className="h-12 bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">رقم الجوال</FormLabel>
                          <FormControl>
                            <Input placeholder="05XXXXXXXX" dir="ltr" className="h-12 bg-background text-right" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">ملاحظات إضافية (اختياري)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="أي تفاصيل إضافية للطلب؟" 
                            className="resize-none h-24 bg-background" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-6 mt-6 border-t flex justify-end">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full md:w-auto h-14 px-10 text-lg rounded-full"
                      disabled={createOrder.isPending}
                    >
                      {createOrder.isPending ? "جاري المعالجة..." : "تأكيد الطلب"}
                      {!createOrder.isPending && <ArrowRight className="w-5 h-5 mr-2" />}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2">
            <div className="bg-muted/50 rounded-3xl p-6 md:p-8 sticky top-28">
              <h2 className="font-bold text-2xl mb-6">ملخص الطلب</h2>
              
              <div className="space-y-4 mb-8">
                {items.map((item) => (
                  <div key={item.menuItem.id} className="flex items-center gap-4 bg-background p-4 rounded-2xl border shadow-sm">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate">{item.menuItem.nameAr}</h4>
                      <p className="text-sm text-muted-foreground">{item.menuItem.price} ريال</p>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-muted rounded-full p-1 border">
                      <button 
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-sm hover:text-primary transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-sm hover:text-primary transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-border/60">
                <div className="flex justify-between text-muted-foreground">
                  <span>المجموع الفرعي</span>
                  <span>{total} ريال</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>الضريبة (١٥٪ متضمنة)</span>
                  <span>{(total * 0.15).toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between font-bold text-2xl pt-4 border-t border-border/60 text-primary">
                  <span>الإجمالي</span>
                  <span>{total} ريال</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
