
import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  onHighlightCommand?: (cmd: { type: 'root' | 'leaves' | 'level' | 'subtree' | 'path' | 'ancestors' | 'descendants' | null, value?: number }) => void
  onInsert: (value: number) => void
  onClear: () => void
  onRandomGenerate: () => void
  onAlgorithmChange: (algorithm: 'inorder' | 'preorder' | 'postorder') => void
  selectedAlgorithm: 'inorder' | 'preorder' | 'postorder'
  onExportTree?: () => void
  onBalanceTree?: () => void
  onGenerateDemo?: (type: 'balanced' | 'unbalanced') => void
  onSearch?: (value: number) => void
  onDelete?: (value: number) => void
  treeData?: any
}

export const ControlPanel = ({
  onInsert,
  onClear,
  onRandomGenerate,
  onAlgorithmChange,
  selectedAlgorithm,
  onExportTree,
  onBalanceTree,
  onGenerateDemo,
  onSearch,
  onDelete,
  treeData,
  onHighlightCommand
}: Props) => {
  const [nodeValue, setNodeValue] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [deleteValue, setDeleteValue] = useState('')
  const [error, setError] = useState('')

  // Visual commands
  const handleNodeCommand = (type: 'level' | 'subtree' | 'path' | 'ancestors' | 'descendants') => {
    const value = parseInt(nodeValue)
    if (isNaN(value)) {
      setError('Insira um valor de nó válido')
      return
    }
    setError('')
    onHighlightCommand && onHighlightCommand({ type, value })
    setNodeValue('')
  }

  // Insert
  const handleInsert = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      setError('Por favor, insira um número válido')
      return
    }
    if (value < 1 || value > 999) {
      setError('Valor deve estar entre 1 e 999')
      return
    }
    setError('')
    onInsert(value)
    setInputValue('')
  }

  // Enter key for insert
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInsert()
    }
  }

  // Export
  const handleExportTree = () => {
    if (onExportTree) {
      onExportTree()
    } else if (treeData) {
      const exportData = {
        timestamp: new Date().toISOString(),
        algorithm: selectedAlgorithm,
        tree: treeData
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2))
      const downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute("href", dataStr)
      downloadAnchorNode.setAttribute("download", `binary-tree-${Date.now()}.json`)
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    }
  }

  // Search
  const handleSearch = () => {
    const value = parseInt(searchValue)
    if (isNaN(value)) {
      setError('Por favor, insira um número válido para buscar')
      return
    }
    setError('')
    if (onSearch) {
      onSearch(value)
    }
    setSearchValue('')
  }


  // Delete
  const handleDelete = () => {
    const value = parseInt(deleteValue)
    if (isNaN(value)) {
      setError('Por favor, insira um número válido para remover')
      return
    }
    setError('')
    if (onDelete) {
      onDelete(value)
    }
    setDeleteValue('')
  }

  return (
    <motion.div 
      className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-3 shadow-2xl border border-slate-700"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Instruções no topo */}
      <div className="mb-2 bg-slate-800/30 p-2 rounded-lg border border-slate-600/30 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2 justify-center text-xs">
          <div className="flex items-center gap-1">
            <span className="text-lg">➕</span>
            <span className="text-slate-300">Insira números para construir a árvore</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg">🔄</span>
            <span className="text-slate-300">Escolha um algoritmo e clique em "Iniciar"</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg">🎲</span>
            <span className="text-slate-300">Use "Aleatória" para gerar exemplos</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Seção de Visualização de Nó/Árvore */}
        <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-600/50 backdrop-blur-sm col-span-1 xl:col-span-4">
          <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
            🔎 Visualizar Nó/Árvore
          </h4>
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={() => onHighlightCommand && onHighlightCommand({ type: 'root' })} disabled={!treeData} className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-sm disabled:opacity-50">Raiz</button>
            <button onClick={() => onHighlightCommand && onHighlightCommand({ type: 'leaves' })} disabled={!treeData} className="px-3 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg font-semibold text-sm disabled:opacity-50">Folhas</button>
            <input type="number" value={nodeValue} onChange={e => setNodeValue(e.target.value)} placeholder="Valor do nó..." className="w-28 px-2 py-1 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <button onClick={() => handleNodeCommand('level')} disabled={!treeData} className="px-3 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold text-sm disabled:opacity-50">Nível</button>
            <button onClick={() => handleNodeCommand('subtree')} disabled={!treeData} className="px-3 py-2 bg-yellow-700 hover:bg-yellow-800 text-white rounded-lg font-semibold text-sm disabled:opacity-50">Subárvore</button>
            <button onClick={() => handleNodeCommand('path')} disabled={!treeData} className="px-3 py-2 bg-pink-700 hover:bg-pink-800 text-white rounded-lg font-semibold text-sm disabled:opacity-50">Caminho</button>
            <button onClick={() => handleNodeCommand('ancestors')} disabled={!treeData} className="px-3 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-semibold text-sm disabled:opacity-50">Ancestrais</button>
            <button onClick={() => handleNodeCommand('descendants')} disabled={!treeData} className="px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold text-sm disabled:opacity-50">Descendentes</button>
          </div>
        </div>
        {/* Seção de Entrada */}
        <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-600/50 backdrop-blur-sm">
          <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
            ➕ Inserir
          </h4>
          <div className="flex flex-col gap-1">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Número..."
              min="1"
              max="999"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              onClick={handleInsert} 
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Inserir
            </button>
          </div>
        </div>

        {/* Seção de Busca e Remoção */}
        <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-600/50 backdrop-blur-sm">
          <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
            🔍 Buscar/Remover
          </h4>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <input
                type="number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Buscar..."
                min="1"
                max="999"
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                onClick={handleSearch} 
                disabled={!treeData}
                className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  !treeData 
                    ? 'bg-slate-600 cursor-not-allowed opacity-50 text-slate-400' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg'
                }`}
              >
                🔍
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={deleteValue}
                onChange={(e) => setDeleteValue(e.target.value)}
                placeholder="Remover..."
                min="1"
                max="999"
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button 
                onClick={handleDelete} 
                disabled={!treeData}
                className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  !treeData 
                    ? 'bg-slate-600 cursor-not-allowed opacity-50 text-slate-400' 
                    : 'bg-red-600 hover:bg-red-700 text-white hover:scale-105 shadow-lg'
                }`}
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        {/* Seção de Algoritmos */}
        <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-600/50 backdrop-blur-sm">
          <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
            🔄 Percurso
          </h4>
          <div className="flex flex-col gap-1">
            {(['inorder', 'preorder', 'postorder'] as const).map((algorithm) => (
              <button
                key={algorithm}
                onClick={() => onAlgorithmChange(algorithm)}
                className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  selectedAlgorithm === algorithm 
                    ? 'bg-purple-600 text-white shadow-lg scale-105' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                }`}
              >
                {algorithm.charAt(0).toUpperCase() + algorithm.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Seção de Ações Rápidas */}
        <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-600/50 backdrop-blur-sm">
          <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
            ⚡ Ações
          </h4>
          <div className="grid grid-cols-2 gap-1">
            <button 
              onClick={onRandomGenerate} 
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-sm"
            >
              🎲 Aleatória
            </button>
            <button 
              onClick={() => onGenerateDemo && onGenerateDemo('balanced')} 
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-sm"
            >
              ⚖️ Balanced
            </button>
            <button 
              onClick={() => onGenerateDemo && onGenerateDemo('unbalanced')} 
              className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-sm"
            >
              📈 Unbalanced
            </button>
            <button 
              onClick={onClear} 
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-sm"
            >
              🗑️ Limpar
            </button>
            {onBalanceTree && (
              <button 
                onClick={onBalanceTree} 
                className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-sm"
              >
                ⚖️ Balance
              </button>
            )}
            <button 
              onClick={handleExportTree} 
              className="px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-sm"
            >
              📤 Export
            </button>
          </div>
        </div>
      </div>
      


      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-500/30 rounded-lg backdrop-blur-sm flex items-center gap-2">
          <span className="text-red-400 text-xl">⚠️</span>
          <span className="text-red-200">{error}</span>
        </div>
      )}
    </motion.div>
  )
}
