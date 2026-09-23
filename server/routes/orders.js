const express = require("express");
const { pool } = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.post("/", async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];

  if (!items.length) {
    return res.status(400).json({ message: "Your cart is empty" });
  }

  const normalizedItems = items.map((item) => ({
    productId: Number(item.productId),
    productName: String(item.productName || "Product"),
    image: item.image ? String(item.image) : null,
    unitPrice: Number(item.unitPrice),
    quantity: Number(item.quantity),
  }));

  if (normalizedItems.some((item) => !Number.isInteger(item.productId) || item.unitPrice < 0 || !Number.isInteger(item.quantity) || item.quantity < 1)) {
    return res.status(400).json({ message: "Invalid cart items" });
  }

  const totalAmount = normalizedItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING *`,
      [req.user.id, totalAmount.toFixed(2)],
    );
    const order = orderResult.rows[0];

    for (const item of normalizedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, image, unit_price, quantity)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.productId, item.productName, item.image, item.unitPrice, item.quantity],
      );
    }

    await client.query("COMMIT");
    return res.status(201).json({ order: { ...order, items: normalizedItems } });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ message: "Unable to create order", error: error.message });
  } finally {
    client.release();
  }
});

router.get("/", async (req, res) => {
  const result = await pool.query(
    `SELECT o.*, COALESCE(json_agg(oi ORDER BY oi.id) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
     FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id
     WHERE o.user_id = $1 GROUP BY o.id ORDER BY o.created_at DESC`,
    [req.user.id],
  );
  res.json({ orders: result.rows });
});

router.get("/:id", async (req, res) => {
  const result = await pool.query(
    `SELECT o.*, COALESCE(json_agg(oi ORDER BY oi.id) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
     FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id
     WHERE o.id = $1 AND o.user_id = $2 GROUP BY o.id`,
    [req.params.id, req.user.id],
  );

  if (!result.rows[0]) return res.status(404).json({ message: "Order not found" });
  return res.json({ order: result.rows[0] });
});

router.patch("/:id/cancel", async (req, res) => {
  const result = await pool.query(
    `UPDATE orders SET status = 'cancelled', cancelled_at = NOW(), updated_at = NOW()
     WHERE id = $1 AND user_id = $2 AND status IN ('confirmed', 'pending') RETURNING *`,
    [req.params.id, req.user.id],
  );

  if (!result.rows[0]) return res.status(400).json({ message: "This order cannot be cancelled" });
  return res.json({ order: result.rows[0] });
});

module.exports = router;