const express = require("express");
const router = express.Router();
const db = require("../db/database");
const { Xendit } = require("xendit-node");

const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY,
});

const invoiceInstance = xenditClient.Invoice;

router.post("/create", async (req, res) => {
  const { amount } = req.body;
  const externalId = "order-" + Date.now();

  if (!amount || amount < 1000) {
    return res.status(400).json({ error: "Minimum payment: Rp 1,000" });
  }

  try {
    const response = await invoiceInstance.createInvoice({
      data: {
        externalId: externalId,
        amount: Number(amount),
        description: "Order Payment #" + externalId,
        currency: "IDR",
        paymentMethods: ["QRIS", "BCA", "BNI", "MANDIRI", "PERMATA"],
        successRedirectUrl: "http://localhost:3000/success.html",
        failureRedirectUrl: "http://localhost:3000/failure.html"
      },
    });

    db.run(
      `INSERT INTO payments (external_id, amount, status) VALUES (?, ?, ?)`,
      [externalId, amount, "PENDING"],
      (err) => {
        if (err) console.error("DB Error:", err.message);
      }
    );

    res.json({
      message: "Invoice created",
      paymentUrl: response.invoiceUrl,
      externalId: externalId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;