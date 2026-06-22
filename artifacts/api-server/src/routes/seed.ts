import { Router } from "express";
import { db } from "@workspace/db";
import { menuItemsTable } from "@workspace/db";

const router = Router();

router.post("/seed", async (req, res) => {
  try {
    const existing = await db.select().from(menuItemsTable);
    if (existing.length > 0) {
      res.json({ message: "Already seeded", count: existing.length });
      return;
    }
    await db.insert(menuItemsTable).values([
      { name: "Espresso", nameAr: "اسبريسو", price: "15.00", category: "hot-drinks", available: true },
      { name: "Americano", nameAr: "امريكانو", price: "18.00", category: "hot-drinks", available: true },
      { name: "Cappuccino", nameAr: "كابتشينو", price: "22.00", category: "hot-drinks", available: true },
      { name: "Latte", nameAr: "لاتيه", price: "25.00", category: "hot-drinks", available: true },
      { name: "Mocha", nameAr: "موكا", price: "28.00", category: "hot-drinks", available: true },
      { name: "Turkish Coffee", nameAr: "قهوة تركية", price: "15.00", category: "hot-drinks", available: true },
      { name: "Hot Chocolate", nameAr: "شوكولاتة ساخنة", price: "22.00", category: "hot-drinks", available: true },
      { name: "Iced Latte", nameAr: "لاتيه بارد", price: "28.00", category: "cold-drinks", available: true },
      { name: "Iced Americano", nameAr: "امريكانو بارد", price: "22.00", category: "cold-drinks", available: true },
      { name: "Frappuccino", nameAr: "فرابتشينو", price: "32.00", category: "cold-drinks", available: true },
      { name: "Croissant", nameAr: "كرواسان", price: "18.00", category: "food", available: true },
      { name: "Cheesecake", nameAr: "تشيز كيك", price: "35.00", category: "food", available: true },
    ]);
    res.json({ message: "Seeded successfully!", count: 12 });
  } catch (err: any) {
    res.status(500).json({ error: "Seed failed", details: err.message });
  }
});

export default router;
