/**
 * Admin-only dashboard — placeholder for moderation, user management, reports.
 */
export default function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {['Users', 'Turfs', 'Bookings', 'Payments', 'Tournaments', 'Audit Logs'].map((section) => (
          <div key={section} className="glass rounded-2xl p-5">
            <h2 className="font-semibold mb-2">{section}</h2>
            <p className="text-gray-500 text-sm">Manage {section.toLowerCase()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
