# Payment Integration Architecture

## 1. Overview & Strategy
The payment module is designed around a **Provider-Independent Payment Interface (Adapter Pattern)**. This shields the core checkout logic from vendor-specific payload variations, allowing seamless switching or concurrent operation across multiple gateways (SSLCOMMERZ, bKash Direct, Nagad, AmarPay) alongside Cash on Delivery (COD).

---

## 2. Payment Adapter Contract

```typescript
export interface PaymentInitiationRequest {
  orderId: string;
  orderNumber: string;
  amount: number; // Integer minor unit or integer BDT
  currency: 'BDT';
  customer: {
    name: string;
    email?: string;
    phone: string;
    address: string;
    district: string;
  };
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
  ipnUrl: string;
}

export interface PaymentInitiationResult {
  redirectUrl: string;
  providerTransactionId: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentVerificationResult {
  success: boolean;
  orderId: string;
  transactionId: string;
  amount: number;
  currency: string;
  rawPayload: Record<string, unknown>;
  errorCode?: string;
}

export interface PaymentGatewayAdapter {
  providerName: string;
  initiatePayment(req: PaymentInitiationRequest): Promise<PaymentInitiationResult>;
  verifyPayment(payload: Record<string, unknown>): Promise<PaymentVerificationResult>;
  handleWebhook(payload: Record<string, unknown>, headers: Record<string, string>): Promise<PaymentVerificationResult>;
}
```

---

## 3. Supported Gateways

### 3.1 Cash on Delivery (COD) Adapter
* No redirect URL needed; resolves synchronously.
* Validates address eligibility and minimum/maximum threshold (e.g., maximum COD order limit of 50,000 BDT).
* Generates an immediate `PENDING_CONFIRMATION` order.

### 3.2 SSLCOMMERZ Adapter (Bangladesh Primary Gateway)
* **Initiation**: Server-to-server POST to `https://sandbox.sslcommerz.com/gwprocess/v4/api.php` (Sandbox) or live endpoint.
* **Payload requirements**: `store_id`, `store_passwd`, `total_amount`, `currency`, `tran_id`, `success_url`, `fail_url`, `cancel_url`, `ipn_url`, `cus_name`, `cus_phone`.
* **Verification (IPN)**:
  * IPN receives `val_id` from SSLCOMMERZ.
  * Server immediately queries validation API `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php` passing `val_id`, `store_id`, `store_passwd`.
  * Verifies `status = 'VALID'` or `'VALIDATED'`, matches exact order amount and BDT currency.
  * **Critical Security Rule**: The frontend success redirect never marks an order paid. Payment completion is strictly contingent on the server-to-server IPN query.

---

## 4. Idempotency & Concurrency Safeguards
1. **Webhook Idempotency**: Each incoming payment callback is logged in the `payments` table with a unique constraint on `(provider, transaction_id)`. Subsequent duplicate webhook deliveries respond with `HTTP 200 OK` without re-triggering stock adjustments or status updates.
2. **Amount Reconciliation**: If a payment returns an amount that differs by even 1 Poisha from the database order record, the order is flagged `ON_HOLD` with an alert for manual review.
