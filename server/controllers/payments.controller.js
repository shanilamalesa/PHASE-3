const axios = require("axios");
const { query } = require("../config/db");
const env = require("../config/env");

function formatPhone(phone) {
  let cleaned = phone.replace(/\s+/g, "").replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+")) cleaned = cleaned.slice(1);
  else if (cleaned.startsWith("0")) cleaned = "254" + cleaned.slice(1);
  return cleaned;
}

async function getDarajaToken() {
  const auth = Buffer.from(
    `${env.mpesaConsumerKey}:${env.mpesaConsumerSecret}`
  ).toString("base64");
  const res = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  );
  return res.data.access_token;
}

async function initiateStkPush(req, res, next) {
  try {
    const { orderId, phone, amount } = req.body;

    if (!orderId || !phone || !amount) {
      return res.status(400).json({ error: "orderId, phone, and amount are required" });
    }

    const token = await getDarajaToken();
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14);
    const password = Buffer.from(
      env.mpesaShortcode + env.mpesaPasskey + timestamp
    ).toString("base64");

    const payload = {
      BusinessShortCode: env.mpesaShortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(amount / 100),
      PartyA: formatPhone(phone),
      PartyB: env.mpesaShortcode,
      PhoneNumber: formatPhone(phone),
      CallBackURL: env.mpesaCallbackUrl,
      AccountReference: orderId.slice(0, 12),
      TransactionDesc: `Order ${orderId.slice(0, 8)}`,
    };

    const stkRes = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { CheckoutRequestID, ResponseCode } = stkRes.data;

    if (ResponseCode !== "0") {
      return res.status(400).json({ error: "STK push rejected" });
    }

    await query(
      `UPDATE orders
       SET mpesa_checkout_request_id = $1, payment_status = 'initiated', updated_at = NOW()
       WHERE id = $2`,
      [CheckoutRequestID, orderId]
    );

    res.json({ checkoutRequestId: CheckoutRequestID });
  } catch (err) {
    next(err);
  }
}

async function handleCallback(req, res, next) {
  try {
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });

    const callback = req.body.Body?.stkCallback;
    if (!callback) return;

    const { ResultCode, ResultDesc, CallbackMetadata } = callback;

    if (ResultCode !== 0) {
      console.log("Payment failed:", ResultDesc);
      // Update order payment_status to failed
      return;
    }

    const metadata = {};
    CallbackMetadata?.Item?.forEach((item) => {
      metadata[item.Name] = item.Value;
    });

    const mpesaReceipt = metadata.MpesaReceiptNumber;

    await query(
      `UPDATE orders
       SET payment_status = 'success', mpesa_receipt_number = $1,
           status = 'paid', updated_at = NOW()
       WHERE mpesa_checkout_request_id = $2`,
      [mpesaReceipt, callback.CheckoutRequestID]
    );

    console.log(`Payment success: ${mpesaReceipt}`);
  } catch (err) {
    console.error("Callback error:", err);
  }
}

async function getStatus(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT id, payment_status, status FROM orders
       WHERE mpesa_checkout_request_id = $1`,
      [req.params.checkoutRequestId]
    );
    res.json(rows[0] || null);
  } catch (err) {
    next(err);
  }
}

module.exports = { initiateStkPush, handleCallback, getStatus };