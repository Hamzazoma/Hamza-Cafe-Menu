import { MainLayout } from "@/components/layout/MainLayout";
import { useListMenuItems, useListCategories } from "@workspace/api-client-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  const { data: categories, isLoading: isLoadingCategories } = useListCategories();
  const { data: items, isLoading: isLoadingItems } = useListMenuItems(
    activeCategory !== "All" ? { category: activeCategory } : undefined,
    { query: { queryKey: activeCategory !== "All" ? ["/api/menu", { category: activeCategory }] : ["/api/menu"] } }
  );

  const { addItem, items: cartItems } = useCart();

  const handleAddToCart = (item: any) => {
    addItem(item);
    toast.success(`تمت إضافة ${item.nameAr} إلى السلة`);
  };

  const getCartQuantity = (id: number) => {
    const item = cartItems.find((ci) => ci.menuItem.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <MainLayout>
      <div className="bg-primary/5 py-12 md:py-20 border-b">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">قائمة المشروبات</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            نقدم تشكيلة واسعة من المشروبات الباردة والساخنة المحضرة بعناية من أجود أنواع البن.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Categories Filter */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Button
            variant={activeCategory === "All" ? "default" : "outline"}
            className="rounded-full px-6"
            onClick={() => setActiveCategory("All")}
          >
            الكل
          </Button>
          {isLoadingCategories ? (
            <>
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-32 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </>
          ) : (
            categories?.map((cat) => (
              <Button
                key={cat.name}
                variant={activeCategory === cat.name ? "default" : "outline"}
                className="rounded-full px-6"
                onClick={() => setActiveCategory(cat.name)}
              >
                {cat.nameAr}
              </Button>
            ))
          )}
        </div>

        {/* Menu Grid */}
        {isLoadingItems ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-2xl p-6 flex flex-col gap-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-12 w-full mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items?.map((item) => {
              const qty = getCartQuantity(item.id);
              return (
                <div 
                  key={item.id} 
                  className={`group relative border rounded-3xl p-6 transition-all duration-300 hover:shadow-lg bg-card overflow-hidden ${!item.available ? 'opacity-60 grayscale' : ''}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl mb-1">{item.nameAr}</h3>
                      <p className="text-sm text-muted-foreground uppercase tracking-widest">{item.name}</p>
                    </div>
                    <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg text-lg">
                      {item.price} <span className="text-xs font-normal">ريال</span>
                    </div>
                  </div>
                  
                  {item.description && (
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-auto pt-6">
                    <Button 
                      className="w-full rounded-xl h-12" 
                      variant={qty > 0 ? "secondary" : "default"}
                      disabled={!item.available}
                      onClick={() => handleAddToCart(item)}
                    >
                      {qty > 0 ? (
                        <>
                          <Check className="w-4 h-4 ml-2" />
                          <span>في السلة ({qty})</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 ml-2" />
                          <span>إضافة للسلة</span>
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {!item.available && (
                    <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                      نفذت الكمية
                    </div>
                  )}
                </div>
              );
            })}
            
            {items?.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                لا توجد مشروبات في هذا التصنيف حالياً.
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
