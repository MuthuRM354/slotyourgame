/**
 * Razorpay checkout helper.
 *
 * Usage:
 *   const options = buildRazorpayOptions({ orderId, amount, ... })
 *   openRazorpayCheckout(options, onSuccess, onFailure)
 *
 * IMPORTANT: The KEY_SECRET never appears here. Only KEY_ID.
 * Payment verification happens on the backend (POST /api/v1/payments/verify).
 */
import { RAZORPAY_KEY_ID, APP_NAME } from './constants'

/**
 * Build Razorpay checkout options object.
 * @param {object} params
 * @param {string} params.razorpayOrderId  — from backend POST /payments/order
 * @param {number} params.amountPaise      — total in paise (e.g. 50000 = ₹500)
 * @param {string} params.userEmail
 * @param {string} params.userPhone
 * @param {string} params.userName
 * @param {string} params.description      — shown in Razorpay modal
 */
export function buildRazorpayOptions({
  razorpayOrderId,
  amountPaise,
  userEmail,
  userPhone,
  userName,
  description = 'Turf Booking',
}) {
  return {
    key: RAZORPAY_KEY_ID,
    amount: amountPaise,
    currency: 'INR',
    name: APP_NAME,
    description,
    order_id: razorpayOrderId,
    prefill: {
      name: userName,
      email: userEmail,
      contact: userPhone,
    },
    theme: {
      color: '#3b82f6',
    },
  }
}

/**
 * Open Razorpay checkout modal.
 * Calls onSuccess({ razorpayOrderId, razorpayPaymentId, razorpaySignature })
 * Calls onFailure(error) on dismiss or failure.
 */
export function openRazorpayCheckout(options, onSuccess, onFailure) {
  // window.Razorpay is loaded by the <script> tag in index.html
  if (!window.Razorpay) {
    onFailure(new Error('Razorpay SDK not loaded'))
    return
  }
  const rzp = new window.Razorpay({
    ...options,
    handler: (response) => {
      onSuccess({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      })
    },
    modal: {
      ondismiss: () => {
        onFailure(new Error('Payment cancelled by user'))
      },
    },
  })
  rzp.on('payment.failed', (response) => {
    onFailure(new Error(response.error.description))
  })
  rzp.open()
}
