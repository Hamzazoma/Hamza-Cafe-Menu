import { Link, useLocation } from "wouter";
import { Coffee, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { itemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "الرئيسية", labelEn: "Home" },
    { href: "/menu", label: "القائمة", labelEn: "Menu" },
    { href: "/order", label: "الطلب أونلاين", labelEn: "Order Online" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl">
              <Coffee className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl leading-none">حمزه كافيه</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Hamza Cafe</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className={`group flex flex-col items-center cursor-pointer ${location === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  <span className="font-medium text-base transition-colors">{link.label}</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity -mt-1">{link.labelEn}</span>
                </div>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/order">
              <Button variant="outline" className="relative group rounded-full px-5 py-6">
                <ShoppingBag className="w-5 h-5 ml-2 group-hover:text-primary transition-colors" />
                <span className="font-medium">سلة الطلبات</span>
                {itemCount > 0 && (
                  <Badge variant="default" className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center p-0 rounded-full animate-in zoom-in">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] flex flex-col">
                <div className="flex items-center gap-3 mb-10 mt-6">
                  <div className="bg-primary text-primary-foreground p-2 rounded-xl">
                    <Coffee className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif font-bold text-xl leading-none">حمزه كافيه</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Hamza Cafe</span>
                  </div>
                </div>
                <nav className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                      <div className={`flex flex-col ${location === link.href ? "text-primary" : "text-muted-foreground"}`}>
                        <span className="font-semibold text-2xl">{link.label}</span>
                        <span className="text-sm uppercase tracking-widest opacity-60">{link.labelEn}</span>
                      </div>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-foreground text-background py-16 mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-right">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6 opacity-90">
                <Coffee className="w-8 h-8" />
                <span className="font-serif font-bold text-2xl">حمزه كافيه</span>
              </div>
              <p className="text-background/70 text-lg max-w-sm mx-auto md:mx-0">
                قهوة مختصة، أجواء دافئة، وتجربة لا تُنسى في قلب المدينة.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-start gap-4">
              <h3 className="font-serif text-xl font-bold mb-2">أوقات العمل</h3>
              <div className="flex justify-between w-full max-w-[200px] text-background/80">
                <span>يومياً</span>
                <span dir="ltr">9 AM - 12 AM</span>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start gap-4">
              <h3 className="font-serif text-xl font-bold mb-2">تواصل معنا</h3>
              <p className="text-background/80" dir="ltr">+966 59 165 0659</p>
              <p className="text-background/80">المملكة العربية السعودية</p>
            </div>
          </div>
          
          <div className="border-t border-background/10 mt-16 pt-8 text-center text-background/50 text-sm">
            <p>© {new Date().getFullYear()} Hamza Cafe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
