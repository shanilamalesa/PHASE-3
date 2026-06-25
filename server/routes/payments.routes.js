const express = require("express");
const router = express.Router();
const paymentsController = require("../controllers/payments.controller");

router.post("/stk", paymentsController.initiateStkPush);
router.post("/callback", paymentsController.handleCallback);
router.get("/order-status/:checkoutRequestId", paymentsController.getStatus);

module.exports = router;