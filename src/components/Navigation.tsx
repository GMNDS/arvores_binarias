import { motion } from 'framer-motion'
import { useState } from 'react'

interface Props {
  sections: string[]
  currentSection: number
  onNavigate: (index: number) => void
}

export const Navigation = ({ sections, currentSection, onNavigate }: Props) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const sectionNames = {
    intro: '🏠 Introdução',
    prerequisites: '📋 Requisitos',
    concepts: '📖 Conceitos',
    types: '🔍 Tipos',
    operations: '⚙️ Operações',
    applications: '🌍 Aplicações',
    interactive: '🖥️ Interativo',
    dungeon: '🏰 Masmorra',
    errors: '⚠️ Erros',
    complexity: '📊 Complexidade',
    conclusion: '🎯 Conclusão'
  }

  const handleNavigate = (index: number) => {
    onNavigate(index)
    // Garantir que o indicador seja atualizado imediatamente
    setTimeout(() => {
      const targetElement = document.getElementById(sections[index])
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }
  return (
    <div 
      className="fixed top-0 left-0 z-50 w-80 h-24"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Indicador visual quando recolhido */}
      {!isHovered && (
        <motion.div
          className="absolute top-4 left-4 bg-white/20 backdrop-blur-lg rounded-full p-3 border border-white/30 shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-white text-lg">☰</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white">
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
              {currentSection + 1}
            </span>
          </div>
        </motion.div>
      )}

      <motion.nav 
        className="absolute top-4 left-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl max-h-[calc(100vh-2rem)] overflow-y-auto"
        initial={{ opacity: 0, y: -100 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          y: isHovered ? 0 : -60,
          scale: isHovered ? 1 : 0.9,
          pointerEvents: isHovered ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      ><div className="p-4 min-w-[200px]">
        <motion.h3 
          className="text-lg font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Navegação
        </motion.h3>
        
        <ul className="space-y-2">
          {sections.map((section, index) => (
            <motion.li 
              key={section}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <button
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium hover:scale-105 ${
                  currentSection === index 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
                onClick={() => handleNavigate(index)}
              >
                {sectionNames[section as keyof typeof sectionNames] || section}
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.nav>
    </div>
  )
}
