import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { motion } from 'framer-motion'

interface Props {
  code: string
  language: string
  title?: string
}

export const CodeDisplay = ({ code, language, title }: Props) => {
  return (
    <motion.div 
      className="w-full max-w-6xl bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {title && (
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 border-b border-white/10">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="text-2xl">💻</span>
            {title}
          </h3>
        </div>
      )}
      
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-2 px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs font-mono text-gray-300 border border-white/10">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            {language.toUpperCase()}
          </div>
        </div>
        
        <SyntaxHighlighter 
          language={language} 
          style={tomorrow}
          customStyle={{
            borderRadius: '0',
            fontSize: '14px',
            margin: 0,
            padding: '1.5rem',
            background: 'transparent',
            fontFamily: 'JetBrains Mono, Consolas, Monaco, "Courier New", monospace',
            lineHeight: '1.6'
          }}
          showLineNumbers
          lineNumberStyle={{
            color: '#6b7280',
            fontSize: '12px',
            marginRight: '1rem'
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </motion.div>
  )
}
