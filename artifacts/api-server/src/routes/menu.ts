import { Router } from "express";
import { db } from "@workspace/db";
import { menuItemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ListMenuItemsQueryParams, GetMenuItemParams } from "@workspace/api-zod";

const router = Router();

router.get("/menu", async (req, res) => {
  try {
    const parsed = ListMenuItemsQueryParams.safeParse(req.query);
    const category = parsed.success ? parsed.data.category : undefined;

    let items;
    if (category) {
      items = await db.select().from(menuItemsTable).where(eq(menuItemsTable.category, category));
    } else {
      items = await db.select().from(menuItemsTable);
    }

    const result = items.map((item) => ({
      id: item.id,
      name: item.name,
      nameAr: item.nameAr,
      price: Number(item.price),
      category: item.category,
      description: item.description ?? null,
      available: item.available,
    }));

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to list menu items");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/menu/categories", async (req, res) => {
  try {
    const items = await db.select().from(menuItemsTable);

    const categoryMap = new Map<string, { name: string; nameAr: string; count: number }>();

    const categoryNames: Record<string, string> = {
      "hot-drinks": "مشروبات ساخنة",
    };

    for (const item of items) {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, {
          name: item.category,
          nameAr: categoryNames[item.category] ?? item.category,
          count: 0,
        });
      }
      categoryMap.get(item.category)!.count++;
    }

    res.json(Array.from(categoryMap.values()));
  } catch (err) {
    req.log.error({ err }, "Failed to list categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/menu/:id", async (req, res) => {
  try {
    const parsed = GetMenuItemParams.safeParse({ id: Number(req.params.id) });
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const [item] = await db.select().from(menuItemsTable).where(eq(menuItemsTable.id, parsed.data.id));
    if (!item) {
      res.status(404).json({ error: "Menu item not found" });
      return;
    }

    res.json({
      id: item.id,
      name: item.name,
      nameAr: item.nameAr,
      price: Number(item.price),
      category: item.category,
      description: item.description ?? null,
      available: item.available,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get menu item");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
