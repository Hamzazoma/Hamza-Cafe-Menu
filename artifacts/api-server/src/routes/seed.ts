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
      { name: "Cappuccino", nameAr:
