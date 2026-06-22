import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable, menuItemsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { CreateOrderBody } from "@workspace/api-zod";

const router = Router();

router.post("/orders", async (req, res) => {
  try {
    const parsed = CreateOrderBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid order data" });
      return;
    }

    const { customerName, phone, items, notes } = parsed.data;

    // Fetch menu items to get prices
    const menuItemIds = items.map((i) => i.menuItemId);
    const allMenuItems = await db.select().from(menuItemsTable);
    const menuItemMap = new Map(allMenuItems.map((m) => [m.id, m]));

    let total = 0;
    const orderItemsData: Array<{
      menuItemId: number;
      quantity: number;
      unitPrice: number;
      subtotal: number;
      notes: string | null;
    }> = [];

    for (const item of items) {
      const menuItem = menuItemMap.get(item.menuItemId);
      if (!menuItem) {
        res.status(400).json({ error: `Menu item ${item.menuItemId} not found` });
        return;
      }
      const unitPrice = Number(menuItem.price);
      const subtotal = unitPrice * item.quantity;
      total += subtotal;
      orderItemsData.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice,
        subtotal,
        notes: item.notes ?? null,
      });
    }

    // Create order
    const [order] = await db.insert(ordersTable).values({
      customerName,
      phone,
      notes: notes ?? null,
      total: String(total),
    }).returning();

    // Create order items
    const insertedItems = await db.insert(orderItemsTable).values(
      orderItemsData.map((oi) => ({
        orderId: order.id,
        menuItemId: oi.menuItemId,
        quantity: oi.quantity,
        unitPrice: String(oi.unitPrice),
        subtotal: String(oi.subtotal),
        notes: oi.notes,
      }))
    ).returning();

    // Build response
    const responseItems = insertedItems.map((oi) => {
      const menuItem = menuItemMap.get(oi.menuItemId)!;
      return {
        menuItemId: oi.menuItemId,
        menuItemName: menuItem.name,
        menuItemNameAr: menuItem.nameAr,
        quantity: oi.quantity,
        unitPrice: Number(oi.unitPrice),
        subtotal: Number(oi.subtotal),
        notes: oi.notes ?? null,
      };
    });

    res.status(201).json({
      id: order.id,
      customerName: order.customerName,
      phone: order.phone,
      status: order.status,
      total: Number(order.total),
      notes: order.notes ?? null,
      createdAt: order.createdAt.toISOString(),
      items: responseItems,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
    const allOrderItems = await db.select().from(orderItemsTable);
    const allMenuItems = await db.select().from(menuItemsTable);
    const menuItemMap = new Map(allMenuItems.map((m) => [m.id, m]));

    const result = orders.map((order) => {
      const items = allOrderItems
        .filter((oi) => oi.orderId === order.id)
        .map((oi) => {
          const menuItem = menuItemMap.get(oi.menuItemId)!;
          return {
            menuItemId: oi.menuItemId,
            menuItemName: menuItem?.name ?? "",
            menuItemNameAr: menuItem?.nameAr ?? "",
            quantity: oi.quantity,
            unitPrice: Number(oi.unitPrice),
            subtotal: Number(oi.subtotal),
            notes: oi.notes ?? null,
          };
        });

      return {
        id: order.id,
        customerName: order.customerName,
        phone: order.phone,
        status: order.status,
        total: Number(order.total),
        notes: order.notes ?? null,
        createdAt: order.createdAt.toISOString(),
        items,
      };
    });

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to list orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orders/stats", async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable);
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);

    // Popular items
    const orderItems = await db.select().from(orderItemsTable);
    const allMenuItems = await db.select().from(menuItemsTable);
    const menuItemMap = new Map(allMenuItems.map((m) => [m.id, m]));

    const popularMap = new Map<number, number>();
    for (const oi of orderItems) {
      popularMap.set(oi.menuItemId, (popularMap.get(oi.menuItemId) ?? 0) + oi.quantity);
    }

    const popularItems = Array.from(popularMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([menuItemId, count]) => {
        const m = menuItemMap.get(menuItemId);
        return {
          name: m?.name ?? "",
          nameAr: m?.nameAr ?? "",
          count,
        };
      });

    res.json({ totalOrders, totalRevenue, popularItems });
  } catch (err) {
    req.log.error({ err }, "Failed to get order stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const orderItems = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, id));
    const allMenuItems = await db.select().from(menuItemsTable);
    const menuItemMap = new Map(allMenuItems.map((m) => [m.id, m]));

    const items = orderItems.map((oi) => {
      const menuItem = menuItemMap.get(oi.menuItemId)!;
      return {
        menuItemId: oi.menuItemId,
        menuItemName: menuItem?.name ?? "",
        menuItemNameAr: menuItem?.nameAr ?? "",
        quantity: oi.quantity,
        unitPrice: Number(oi.unitPrice),
        subtotal: Number(oi.subtotal),
        notes: oi.notes ?? null,
      };
    });

    res.json({
      id: order.id,
      customerName: order.customerName,
      phone: order.phone,
      status: order.status,
      total: Number(order.total),
      notes: order.notes ?? null,
      createdAt: order.createdAt.toISOString(),
      items,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get order");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
