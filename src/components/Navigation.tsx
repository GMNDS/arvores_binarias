import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface Props {
  sections: string[]
  currentSection: number
  onNavigate: (index: number) => void
}

export const Navigation = ({ sections, currentSection, onNavigate }: Props) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  const sectionNames = {
    intro: '🏠 Introdução',
    recap: '📚 Recapitulação',
    concepts: '📖 Conceitos',
    types: '🔍 Tipos',
    operations: '⚙️ Operações',
    applications: '🌍 Aplicações',
    interactive: '🖥️ Interativo',
    errors: '⚠️ Erros',
    complexity: '📊 Complexidade',
    conclusion: '🌳 Fim'
  }

  const getSectionName = (section: string) => {
    return sectionNames[section as keyof typeof sectionNames] || section
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6">
      <motion.nav 
        className="flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20 shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {sections.map((section, index) => (
          <div
            key={section}
            className="relative flex items-center"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Círculo navegável */}
            <motion.button
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 ${
                currentSection === index
                  ? 'bg-gradient-to-br from-blue-400 to-purple-500 border-blue-400 shadow-lg shadow-blue-400/30'
                  : 'border-white/60 hover:border-white/90 hover:bg-white/20'
              }`}
              onClick={() => onNavigate(index)}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.95 }}
              aria-label={getSectionName(section)}
            >
              {/* Indicador de seção ativa */}
              {currentSection === index && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"
                  layoutId="activeSection"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              )}
            </motion.button>

            {/* Tooltip */}
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div
                  className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap border border-white/20 shadow-xl"
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  {getSectionName(section)}
                  
                  {/* Seta do tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2">
                    <div className="border-4 border-transparent border-b-gray-900/95" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Indicador de progresso sutil */}
        <div className="flex items-center ml-4 pl-4 border-l border-white/30">
          <span className="text-white/70 text-xs font-medium">
            {currentSection + 1}/{sections.length}
          </span>
        </div>
      </motion.nav>
    </div>
  )
}
