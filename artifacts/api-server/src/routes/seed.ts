import { Router } from "express";
import { db } from "@workspace/db";
import { menuItemsTable } from "@workspace/db";

const router = Router();

router.post("/seed", async (req, res) => {
  try {
    const existing = await db.select().from(menuItemsTable);
    if (existing.length > 0) {
      res.json({ message: "Database already seeded", count: existing.length });
      return;
    }
    const items = [
      { name: "Espresso", nameAr: "إسبريسو", price: "15.00", category: "hot-drinks", description: "قهوة مركزة بنكهة قوية", available: true },
      { name: "Americano", nameAr: "أمريكانو", price: "18.00", category: "hot-drinks", description: "إسبريسو ممزوج بالماء الساخن", available: true },
      { name: "Cappuccino", nameAr: "كابتشينو", price: "22.00", category: "hot-drinks", description: "إسبريسو مع رغوة الحليب", available: true },
      { name: "Latte", nameAr: "لاتيه", price: "25.00", category: "hot-drinks", description: "إسبريسو مع حليب مبخر", available: true },
      { name: "Mocha", nameAr: "موكا", price: "28.00", category: "hot-drinks", description: "إسبريسو مع شوكولاتة وحليب", available: true },
      { name: "Turkish Coffee", nameAr: "قهوة تركية", price: "15.00", category: "hot-drinks", description: "قهوة تركية أصيلة", available: true },
      { name: "Hot Chocolate", nameAr: "شوكولاتة ساخنة", price: "22.00", category: "hot-drinks", description: "شوكولاتة ساخنة كريمية", available: true },
      { name: "Iced Latte", nameAr: "لاتيه بارد", price: "28.00", category: "cold-drinks", description: "لاتيه على الثلج", available: true },
      { name: "Iced Americano", nameAr: "أمريكانو بارد", price: "22.00", category: "cold-drinks", description: "أمريكانو على الثلج", available: true },
      { name: "Frappuccino", nameAr: "فرابتشينو", price: "32.00", category: "cold-drinks", description: "مشروب كريمي بارد", available: true },
      { name: "Croissant", nameAr: "كروا
