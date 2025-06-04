import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodeDisplay } from './CodeDisplay'

interface CollapsibleCodeDisplayProps {
  code: string
  language: string
  title?: string
}

export const CollapsibleCodeDisplay = ({ code, language, title }: CollapsibleCodeDisplayProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="mb-4">
      <button
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold shadow transition-all duration-200 mb-2"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{open ? '▼' : '▶'}</span>
        <span>{title || 'Código'}</span>
        <span className="ml-2 text-xs text-slate-300">(C)</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <CodeDisplay code={code} language={language} title={title} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
