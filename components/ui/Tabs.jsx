'use client'

import { useState } from 'react'
import clsx from 'clsx'

/**
 * Simple tab bar.
 *
 * Usage:
 *   <Tabs tabs={['Upcoming', 'Past']} defaultTab="Upcoming">
 *     {(active) => (
 *       <>
 *         {active === 'Upcoming' && <UpcomingList />}
 *         {active === 'Past' && <PastList />}
 *       </>
 *     )}
 *   </Tabs>
 *
 * Or pass a controlled value:
 *   <Tabs tabs={...} value={tab} onChange={setTab} />
 */
export default function Tabs({ tabs, defaultTab, value, onChange, children, className }) {
  const [internal, setInternal] = useState(defaultTab ?? tabs[0])
  const active = value ?? internal
  const setActive = onChange ?? setInternal

  return (
    <div className={className}>
      <div className="flex gap-1 border-b border-[#1c2432] mb-5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={clsx(
              'px-4 py-2 text-sm font-medium transition -mb-px border-b-2',
              active === tab
                ? 'border-green-400 text-green-400'
                : 'border-transparent text-slate-500 hover:text-slate-200'
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      {children?.(active)}
    </div>
  )
}
