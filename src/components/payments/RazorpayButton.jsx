/**
 * Drop-in payment button.
 *
 * Props:
 *   - orderData: { turfId, date, startTime, endTime, amountPaise }
 *   - onSuccess: () => void — called after backend verifies payment
 *   - label: string — button text (default "Pay & Confirm")
 *   - className: string — extra Tailwind classes
 */
import { useBooking } from '@/hooks/useBooking'
import { formatCurrency } from '@/utils/formatters'

export default function RazorpayButton({
  orderData,
  onSuccess,
  label,
  className = '',
}) {
  const { initiateBooking, step, isLoading } = useBooking()

  const stepLabels = {
    idle:      label ?? `Pay ${formatCurrency(orderData?.amountPaise)} & Confirm`,
    ordering:  'Creating order…',
    checkout:  'Opening checkout…',
    verifying: 'Verifying payment…',
    done:      'Confirmed!',
  }

  return (
    <button
      disabled={isLoading || step === 'done'}
      onClick={() => initiateBooking(orderData, onSuccess)}
      className={`flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700
                  disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold
                  px-6 py-3 rounded-xl transition-colors w-full ${className}`}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      )}
      {stepLabels[step]}
    </button>
  )
}
