'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function segmentToLabel(seg: string) {
  if (!seg) return 'Home'
  return seg.replace(/[-_]/g, ' ').toUpperCase()
}

export default function Breadcrumbs() {
  const pathname = usePathname() || '/' 
  const parts = pathname.split('/').filter(Boolean)

  return (
    <div className="pt-20">
      <div className="max-w-6xl mx-auto px-4 py-2 text-sm text-on-surface-variant">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="text-cyan-300">Home</Link>
            </li>
            {parts.map((p, i) => {
              const href = '/' + parts.slice(0, i + 1).join('/')
              const last = i === parts.length - 1
              return (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-white/30">/</span>
                  {last ? (
                    <span className="font-semibold">{segmentToLabel(p)}</span>
                  ) : (
                    <Link href={href} className="text-on-surface-variant hover:text-cyan-300">{segmentToLabel(p)}</Link>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      </div>
    </div>
  )
}
