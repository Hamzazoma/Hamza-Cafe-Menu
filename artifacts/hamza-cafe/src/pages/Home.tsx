import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Coffee, Star, Clock, MapPin } from "lucide-react";
import { useGetOrderStats } from "@workspace/api-client-react";

export default function Home() {
  const { data: stats } = useGetOrderStats();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(135deg, #2c1810 0%, #4a2c1a 30%, #6b3d2a 60%, #3d1f0f 100%)" }} />
        <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: "radial-gradient(ellipse at 20% 50%, #c8855a 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, #e8a87c 0%, transparent 40%)" }} />
        
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto flex flex-col items-center">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-6 animate-in slide-in-from-bottom-4 duration-700">
            تجربة قهوة استثنائية
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight drop-shadow-lg animate-in slide-in-from-bottom-8 duration-700 delay-150">
            حمزه كافيه
          </h1>
          <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-2xl font-medium drop-shadow-md animate-in slide-in-from-bottom-8 duration-700 delay-300">
            حيث يلتقي الشغف بالقهوة المختصة مع الأجواء العصرية الدافئة. اكتشف طعم القهوة الحقيقي.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-8 duration-700 delay-500">
            <Link href="/order">
              <Button size="lg" className="text-lg px-8 h-14 rounded-full bg-primary hover:bg-primary/90 text-white border-none shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                اطلب الآن
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-full bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:text-white transition-all">
                استعرض القائمة
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-primary/10 translate-x-4 translate-y-4 rounded-3xl -z-10" />
              <div className="rounded-3xl shadow-xl w-full h-[500px] flex items-center justify-center" style={{ background: "linear-gradient(160deg, #5c2f1a 0%, #8b4513 40%, #c8855a 100%)" }}>
                <Coffee className="w-32 h-32 text-white/30" />
              </div>
            </div>
            <div className="order-1 md:order-2 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 text-primary font-bold">
                <Coffee className="w-5 h-5" />
                <span className="uppercase tracking-widest text-sm">Our Philosophy</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight">
                قهوة تُصنع بحب، وعناية في كل قطرة.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                نحن في حمزه كافيه نؤمن بأن القهوة ليست مجرد مشروب، بل هي تجربة ومزاج. نختار حبوب القهوة الخاصة بنا بعناية فائقة من أفضل المزارع حول العالم، ونحمصها محلياً لنضمن لك كوباً مثالياً في كل مرة.
              </p>
              <div className="grid grid-cols-2 gap-8 mt-6">
                <div>
                  <h4 className="font-bold text-xl mb-2">حبوب مختصة</h4>
                  <p className="text-muted-foreground">أجود أنواع البن المحمص بعناية.</p>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2">باريستا محترفون</h4>
                  <p className="text-muted-foreground">خبراء في استخلاص النكهات.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items / Stats */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-serif text-4xl font-bold mb-4">أكثر المشروبات طلباً</h2>
          <p className="text-muted-foreground mb-16 max-w-2xl mx-auto">
            اكتشف المشروبات المفضلة لدى زوارنا والتي أصبحت جزءاً من يومهم.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats?.popularItems?.slice(0, 3).map((item, i) => (
              <div key={i} className="group bg-card rounded-3xl p-8 border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Star className="w-8 h-8 fill-primary/20" />
                </div>
                <h3 className="font-bold text-2xl mb-2">{item.nameAr}</h3>
                <p className="text-sm text-muted-foreground uppercase tracking-widest mb-6">{item.name}</p>
                <div className="inline-block bg-muted px-4 py-2 rounded-full text-sm font-medium">
                  طلب {item.count} مرة
                </div>
              </div>
            ))}
            
            {(!stats || !stats.popularItems || stats.popularItems.length === 0) && (
              // Fallback if no stats
              <>
                {[
                  { ar: "لاتيه إسباني", en: "Spanish Latte" },
                  { ar: "فلات وايت", en: "Flat White" },
                  { ar: "في 60", en: "V60" }
                ].map((item, i) => (
                  <div key={i} className="group bg-card rounded-3xl p-8 border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Coffee className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-2xl mb-2">{item.ar}</h3>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest mb-6">{item.en}</p>
                  </div>
                ))}
              </>
            )}
          </div>
          
          <div className="mt-16">
            <Link href="/menu">
              <Button size="lg" variant="outline" className="rounded-full px-8">
                عرض القائمة الكاملة
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Atmosphere Section */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <h2 className="font-serif text-4xl md:text-6xl font-bold leading-tight">
                مكانك المفضل للعمل، للقاء، وللاسترخاء.
              </h2>
              <p className="text-lg text-background/70 leading-relaxed max-w-lg">
                صممنا حمزه كافيه ليكون ملاذك الهادئ وسط صخب المدينة. ديكور عصري مريح، إضاءة دافئة، وموسيقى هادئة تجعل منه المكان المثالي لإنجاز أعمالك أو قضاء وقت ممتع مع الأصدقاء.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 mt-4">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="p-3 bg-primary rounded-full text-white">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50 mb-1">أوقات العمل</p>
                    <p className="font-bold" dir="ltr">9:00 AM - 12:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="p-3 bg-primary rounded-full text-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50 mb-1">الموقع</p>
                    <p className="font-bold">وسط المدينة</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[600px] rounded-3xl overflow-hidden" style={{ background: "linear-gradient(140deg, #1a0e08 0%, #3d2010 50%, #6b3d2a 100%)" }}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 70%, #e8a87c 0%, transparent 50%), radial-gradient(circle at 70% 30%, #c8855a 0%, transparent 40%)" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-24 h-24 text-white/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

    </MainLayout>
  );
}
