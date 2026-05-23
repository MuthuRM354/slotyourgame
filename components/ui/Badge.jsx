import clsx from 'clsx'

const VARIANTS = {
  // Booking / generic statuses
  pending:       'bg-yellow-500/15 text-yellow-300 border-yellow-700/40',
  confirmed:     'bg-green-500/15 text-green-300 border-green-700/40',
  approved:      'bg-green-500/15 text-green-300 border-green-700/40',
  rejected:      'bg-red-500/15 text-red-300 border-red-700/40',
  cancelled:     'bg-gray-500/15 text-gray-400 border-gray-700/40',
  completed:     'bg-blue-500/15 text-blue-300 border-blue-700/40',

  // Attendance
  attending:     'bg-green-500/15 text-green-300 border-green-700/40',
  not_attending: 'bg-red-500/15 text-red-300 border-red-700/40',
  maybe:         'bg-yellow-500/15 text-yellow-300 border-yellow-700/40',

  // League
  open:          'bg-emerald-500/15 text-emerald-300 border-emerald-700/40',
  in_progress:   'bg-blue-500/15 text-blue-300 border-blue-700/40',
  draft:         'bg-gray-500/15 text-gray-400 border-gray-700/40',

  // Payments
  paid:          'bg-green-500/15 text-green-300 border-green-700/40',
  unpaid:        'bg-orange-500/15 text-orange-300 border-orange-700/40',
  refunded:      'bg-purple-500/15 text-purple-300 border-purple-700/40',

  // Fallback
  default:       'bg-gray-500/15 text-gray-400 border-gray-700/40',
}

export default function Badge({ label, variant, className }) {
  const style = VARIANTS[variant] ?? VARIANTS[label?.toLowerCase()] ?? VARIANTS.default
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize',
        style,
        className
      )}
    >
      {label?.replace(/_/g, ' ')}
    </span>
  )
}
