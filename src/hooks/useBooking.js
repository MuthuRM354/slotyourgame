/**
 * Booking flow hook — orchestrates:
 *  1. Create Razorpay order (backend)
 *  2. Open Razorpay modal (frontend)
 *  3. Verify payment signature (backend)
 *  4. Create booking record (backend)
 */
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { paymentsApi } from '@/api/payments.api'
import { bookingsApi } from '@/api/bookings.api'
import { openRazorpayCheckout, buildRazorpayOptions } from '@/utils/razorpay'
import { useAuth } from './useAuth'

export function useBooking() {
  const { user } = useAuth()
  const [step, setStep] = useState('idle') // idle | ordering | checkout | verifying | done

  const createOrderMutation = useMutation({
    mutationFn: (data) => paymentsApi.createOrder(data),
  })

  const verifyMutation = useMutation({
    mutationFn: (data) => paymentsApi.verify(data),
  })

  /**
   * Full booking flow.
   * @param {object} bookingDetails — { turfId, date, startTime, endTime, amountPaise }
   * @param {function} onSuccess — called with booking confirmation data
   */
  async function initiateBooking(bookingDetails, onSuccess) {
    try {
      setStep('ordering')

      // Step 1: create Razorpay order on backend
      const orderRes = await createOrderMutation.mutateAsync({
        amountPaise: bookingDetails.amountPaise,
        turfId: bookingDetails.turfId,
        bookingDate: bookingDetails.date,
        startTime: bookingDetails.startTime,
        endTime: bookingDetails.endTime,
      })

      const { razorpayOrderId, amountPaise } = orderRes.data.data
      setStep('checkout')

      // Step 2: open Razorpay modal
      const options = buildRazorpayOptions({
        razorpayOrderId,
        amountPaise,
        userEmail: user?.email,
        userPhone: user?.phone,
        userName: user?.fullName,
        description: `Booking at Turf #${bookingDetails.turfId}`,
      })

      openRazorpayCheckout(
        options,
        async (paymentResponse) => {
          // Step 3: verify HMAC signature on backend
          setStep('verifying')
          try {
            await verifyMutation.mutateAsync({
              razorpayOrderId: paymentResponse.razorpayOrderId,
              razorpayPaymentId: paymentResponse.razorpayPaymentId,
              razorpaySignature: paymentResponse.razorpaySignature,
              turfId: bookingDetails.turfId,
              bookingDate: bookingDetails.date,
              startTime: bookingDetails.startTime,
              endTime: bookingDetails.endTime,
            })
            setStep('done')
            toast.success('Booking confirmed!')
            onSuccess?.()
          } catch {
            setStep('idle')
            toast.error('Payment verification failed. Contact support.')
          }
        },
        (error) => {
          setStep('idle')
          if (error.message !== 'Payment cancelled by user') {
            toast.error(error.message || 'Payment failed')
          }
        },
      )
    } catch (error) {
      setStep('idle')
      toast.error(error.response?.data?.message || 'Failed to initiate payment')
    }
  }

  return {
    initiateBooking,
    step,
    isLoading: step !== 'idle' && step !== 'done',
  }
}
