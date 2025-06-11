import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BinaryTreeVisualizer } from './components/BinaryTreeVisualizer-new'
import { LectureSlides } from './components/LectureSlides'
import { ControlPanel } from './components/ControlPanel'
import { Navigation } from './components/Navigation'

export interface TreeNodeData {
  id: number
  value: number
  left?: TreeNodeData
  right?: TreeNodeData
  x?: number
  y?: number
  level?: number
}

function App() {
  const [highlightCommand, setHighlightCommand] = useState<{ type: 'root' | 'leaves' | 'level' | 'subtree' | 'path' | 'ancestors' | 'descendants' | null, value?: number }>({ type: null })
  const [currentSection, setCurrentSection] = useState(0)
  const [treeRoot, setTreeRoot] = useState<TreeNodeData | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'inorder' | 'preorder' | 'postorder'>('inorder')
  const [searchingValue, setSearchingValue] = useState<number | undefined>(undefined)
  const [deletingValue, setDeletingValue] = useState<number | undefined>(undefined)

  const sections = useMemo(() => [
    'intro',
    'recap',
    'concepts',
    'types',
    'operations',
    'applications',
    'interactive',
    'errors',
    'complexity',
    'conclusion'
  ], [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + window.innerHeight / 2

          // Encontrar qual seção está mais próxima do centro da tela
          let closestSection = 0
          let minDistance = Number.POSITIVE_INFINITY

          sections.forEach((sectionId, index) => {
            const element = document.getElementById(sectionId)
            if (element) {
              const elementTop = element.offsetTop
              const elementBottom = elementTop + element.offsetHeight
              const elementCenter = elementTop + element.offsetHeight / 2

              // Se o scroll está dentro da seção
              if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
                closestSection = index
                return
              }

              // Caso contrário, encontrar a seção mais próxima
              const distance = Math.abs(scrollPosition - elementCenter)
              if (distance < minDistance) {
                minDistance = distance
                closestSection = index
              }
            }
          })

          setCurrentSection(closestSection)
          ticking = false;
        });
        
        ticking = true;
      }
    }

    // Executar imediatamente e depois no scroll
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  const insertNode = (value: number) => {
    setIsAnimating(true)
    setTreeRoot(prev => insertIntoTree(prev, value))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const insertIntoTree = (root: TreeNodeData | null, value: number): TreeNodeData => {
    if (!root) {
      return { id: Date.now(), value }
    }

    if (value < root.value) {
      root.left = insertIntoTree(root.left || null, value)
    } else if (value > root.value) {
      root.right = insertIntoTree(root.right || null, value)
    }

    return root
  }

  const clearTree = () => {
    setTreeRoot(null)
    setHighlightCommand({ type: null })
  }

  const generateRandomTree = () => {
    clearTree()
    const values = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1)
    values.forEach((value, index) => {
      setTimeout(() => insertNode(value), index * 200)
    })
  }

  // Utility functions for tree manipulation
  const countNodes = (root: TreeNodeData | null): number => {
    if (!root) return 0
    return 1 + countNodes(root.left || null) + countNodes(root.right || null)
  }

  const calculateHeight = (root: TreeNodeData | null): number => {
    if (!root) return -1 // Altura em arestas: árvore vazia = -1
    return 1 + Math.max(
      calculateHeight(root.left || null),
      calculateHeight(root.right || null)
    )
  }

  const isTreeBalanced = (root: TreeNodeData | null): boolean => {
    if (!root) return true

    const leftHeight = calculateHeight(root.left || null)
    const rightHeight = calculateHeight(root.right || null)

    return Math.abs(leftHeight - rightHeight) <= 1 &&
      isTreeBalanced(root.left || null) &&
      isTreeBalanced(root.right || null)
  }

  const exportTree = () => {
    if (!treeRoot) {
      alert('Árvore vazia! Adicione alguns valores primeiro.')
      return
    }

    const exportData = {
      timestamp: new Date().toISOString(),
      algorithm: selectedAlgorithm,
      tree: treeRoot,
      statistics: {
        nodeCount: countNodes(treeRoot),
        height: calculateHeight(treeRoot),
        isBalanced: isTreeBalanced(treeRoot)
      }
    }

    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `binary-tree-${Date.now()}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const balanceTree = () => {
    if (!treeRoot) {
      alert('Árvore vazia! Adicione alguns valores primeiro.')
      return
    }

    // Collect all values in order
    const values: number[] = []
    const collectValues = (node: TreeNodeData | null) => {
      if (node) {
        collectValues(node.left || null)
        values.push(node.value)
        collectValues(node.right || null)
      }
    }
    collectValues(treeRoot)

    // Build balanced tree from sorted values
    const buildBalanced = (arr: number[], start: number, end: number): TreeNodeData | null => {
      if (start > end) return null

      const mid = Math.floor((start + end) / 2)
      const node: TreeNodeData = {
        id: Date.now() + Math.random(),
        value: arr[mid]
      }

      node.left = buildBalanced(arr, start, mid - 1) || undefined
      node.right = buildBalanced(arr, mid + 1, end) || undefined

      return node
    }

    setIsAnimating(true)
    setTreeRoot(buildBalanced(values, 0, values.length - 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const generateDemo = (type: 'balanced' | 'unbalanced') => {
    clearTree()

    if (type === 'unbalanced') {
      // Create a completely unbalanced tree (like a linked list)
      const values = [50, 25, 75, 12, 6, 3, 1]
      values.forEach((value, index) => {
        setTimeout(() => insertNode(value), index * 300)
      })
    } else {
      // Create a balanced tree
      const values = [50, 25, 75, 12, 37, 62, 87, 6, 18, 31, 43]
      const sortedValues = [...values].sort((a, b) => a - b)

      // Build balanced tree by inserting middle elements first
      const buildBalancedDemo = (arr: number[], start: number, end: number, delay: number): number => {
        if (start > end) return delay

        const mid = Math.floor((start + end) / 2)
        setTimeout(() => insertNode(arr[mid]), delay)

        let nextDelay = delay + 300
        nextDelay = buildBalancedDemo(arr, start, mid - 1, nextDelay)
        nextDelay = buildBalancedDemo(arr, mid + 1, end, nextDelay)

        return nextDelay
      }

      buildBalancedDemo(sortedValues, 0, sortedValues.length - 1, 0)
    }
  }

  const searchNode = (value: number) => {
    if (!treeRoot) {
      alert('Árvore vazia! Adicione alguns valores primeiro.')
      return
    }

    // Iniciar busca visual
    setSearchingValue(value)
  }

  const handleSearchComplete = (_found: boolean) => {
    // Limpar o valor de busca após completar
    setTimeout(() => {
      setSearchingValue(undefined)
    }, 2000) // Manter o resultado visível por 2 segundos
  }

  const searchInTree = (root: TreeNodeData | null, value: number): boolean => {
    if (!root) return false

    if (value === root.value) return true
    if (value < root.value) return searchInTree(root.left || null, value)
    return searchInTree(root.right || null, value)
  }

  const deleteNode = (value: number) => {
    if (!treeRoot) {
      alert('Árvore vazia! Não há nada para remover.')
      return
    }

    // Iniciar visualização de remoção
    setDeletingValue(value)
  }

  const handleDeleteComplete = (deleted: boolean) => {
    const valueToDelete = deletingValue;
    setDeletingValue(undefined)

    if (deleted && valueToDelete !== undefined) {
      // Executar a remoção real da árvore após a visualização
      setIsAnimating(true)
      setTreeRoot(deleteFromTree(treeRoot, valueToDelete))
      setTimeout(() => setIsAnimating(false), 500)
    }
  }

  const deleteFromTree = (root: TreeNodeData | null, value: number): TreeNodeData | null => {
    if (!root) return null

    if (value < root.value) {
      root.left = deleteFromTree(root.left || null, value) || undefined
    } else if (value > root.value) {
      root.right = deleteFromTree(root.right || null, value) || undefined
    } else {
      // Node to be deleted found

      // Case 1: No children (leaf node)
      if (!root.left && !root.right) {
        return null
      }

      // Case 2: One child
      if (!root.left) return root.right || null
      if (!root.right) return root.left || null

      // Case 3: Two children
      // Find inorder successor (smallest in the right subtree)
      const successor = findMinValue(root.right)
      root.value = successor.value
      root.id = Date.now() + Math.random() // Update ID for re-render
      root.right = deleteFromTree(root.right, successor.value) || undefined
    }

    return root
  }

  const findMinValue = (root: TreeNodeData): TreeNodeData => {
    let current = root
    while (current.left) {
      current = current.left
    }
    return root
  }

  return (
    <div className="w-full min-h-screen bg-gradient-main text-white relative prevent-horizontal-scroll">
      <Navigation
        sections={sections}
        currentSection={currentSection}
        onNavigate={(index: number) => {
          // Atualizar o estado imediatamente
          setCurrentSection(index)

          // Fazer o scroll suave para a seção
          setTimeout(() => {
            const targetElement = document.getElementById(sections[index])
            if (targetElement) {
              // Usar scrollTo com offset para evitar que o header cubra o conteúdo
              const elementTop = targetElement.offsetTop - 100
              window.scrollTo({
                top: Math.max(0, elementTop),
                behavior: 'smooth'
              })
            }
          }, 150)
        }}
      />

      <motion.section
        id="intro"
        className="min-h-screen px-8 pt-24 pb-16 flex flex-col justify-center items-center relative bg-gradient-intro text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <LectureSlides section="intro" />
      </motion.section>

      <motion.section
        id="recap"
        className="min-h-screen px-8 pt-24 pb-16 flex flex-col justify-center items-center relative"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <LectureSlides section="recap" />
      </motion.section>

      <motion.section
        id="concepts"
        className="min-h-screen px-8 pt-24 pb-16 flex flex-col justify-center items-center relative bg-gradient-concepts"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <LectureSlides section="concepts" />
      </motion.section>

      <motion.section
        id="types"
        className="min-h-screen px-8 pt-24 pb-16 flex flex-col justify-center items-center relative bg-gradient-types text-gray-800"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <LectureSlides section="types" />
      </motion.section>

      <motion.section
        id="operations"
        className="min-h-screen px-8 pt-24 pb-16 flex flex-col justify-center items-center relative"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <LectureSlides section="operations" />
        <motion.div
          className="mt-8 w-full max-w-6xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
        </motion.div>
      </motion.section>

      <motion.section
        id="applications"
        className="min-h-screen px-8 pt-24 pb-16 flex flex-col justify-center items-center relative"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <LectureSlides section="applications" />
      </motion.section>

      <motion.section
        id="interactive"
        className="min-h-screen px-4 pt-20 pb-16 flex flex-col relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="w-full max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-8 gradient-text"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Visualizador Interativo de Árvore Binária
          </motion.h2>

          {/* Painel de Controle no Topo */}
          <motion.div
            className="mb-2"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <ControlPanel
              onInsert={insertNode}
              onClear={clearTree}
              onRandomGenerate={generateRandomTree}
              onAlgorithmChange={setSelectedAlgorithm}
              selectedAlgorithm={selectedAlgorithm}
              onExportTree={exportTree}
              onBalanceTree={balanceTree}
              treeData={treeRoot}
              onGenerateDemo={generateDemo}
              onSearch={searchNode}
              onDelete={deleteNode}
              onHighlightCommand={setHighlightCommand}
              onResetHighlight={() => setHighlightCommand({ type: null })}
            />
          </motion.div>

          <div className="flex flex-col space-y-6">
            <motion.div
              className="w-full bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                {/* Painel de Estatísticas Flutuante */}
                {treeRoot && (
                  <motion.div
                    className="absolute top-2 right-2 z-10 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 p-2 shadow-md"
                    style={{ minWidth: '120px', maxWidth: '180px' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex flex-col gap-1 text-center">
                      <div className="flex items-center justify-between text-xs text-gray-300">
                        <span>📊 Nós</span>
                        <span className="font-bold text-blue-400">{countNodes(treeRoot)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-300">
                        <span>📏 Altura</span>
                        <span className="font-bold text-green-400">{calculateHeight(treeRoot)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-300">
                        <span>⚖️ Balanceada </span>
                        <span className={`font-bold ${isTreeBalanced(treeRoot) ? 'text-emerald-400' : 'text-red-400'}`}>{isTreeBalanced(treeRoot) ? '✅' : '❌'}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <BinaryTreeVisualizer
                  root={treeRoot}
                  algorithm={selectedAlgorithm}
                  isAnimating={isAnimating}
                  searchValue={searchingValue}
                  deleteValue={deletingValue}
                  onSearchComplete={handleSearchComplete}
                  onDeleteComplete={handleDeleteComplete}
                  highlightCommand={highlightCommand}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="errors"
        className="min-h-screen px-8 pt-24 pb-16 flex flex-col justify-center items-center relative"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <LectureSlides section="errors" />
      </motion.section>

      <motion.section
        id="complexity"
        className="min-h-screen px-8 pt-24 pb-16 flex flex-col justify-center items-center relative"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <LectureSlides section="complexity" />
      </motion.section>

<motion.section
  id="conclusion"
  className="min-h-screen px-8 pt-24 pb-16 flex flex-col justify-center items-center relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  viewport={{ once: true }}
>
   <LectureSlides section="conclusion" />
  
</motion.section>
    </div>
  )
}

export default App
