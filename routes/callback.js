const express = require("express");
const router = express.Router();
const db = require("../db/database");

router.post("/xendit", (req, res) => {
  const { external_id, status } = req.body;

  if (status === "PAID" || status === "SETTLED") {
    db.run(
      `UPDATE payments SET status = ? WHERE external_id = ?`,
      ["PAID", external_id],
      (err) => {
        if (err) {
          console.error("Webhook DB Error:", err.message);
          return res.status(500).end();
        }
        console.log(`Order ${external_id} Success pays off!`);
      }
    );
  }

  res.status(200).send("OK");
});

module.exports = router;