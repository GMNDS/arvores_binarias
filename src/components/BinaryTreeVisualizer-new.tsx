import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export interface TreeNode {
  id: number
  value: number
  left?: TreeNode
  right?: TreeNode
  x?: number
  y?: number
  level?: number
}

interface Props {
  root: TreeNode | null
  algorithm: 'inorder' | 'preorder' | 'postorder'
  isAnimating: boolean
  searchValue?: number
  deleteValue?: number
  onSearchComplete?: (found: boolean) => void
  onDeleteComplete?: (deleted: boolean) => void
}

interface HighlightCommand {
  type: 'root' | 'leaves' | 'level' | 'subtree' | 'path' | 'ancestors' | 'descendants' | null
  value?: number
}

export const BinaryTreeVisualizer = ({
  root,
  algorithm,
  searchValue,
  deleteValue,
  onSearchComplete,
  onDeleteComplete,
  highlightCommand
}: Props & {
  highlightCommand?: HighlightCommand
}) => {
  // Estados para destaques visuais
  const [highlightedNodes, setHighlightedNodes] = useState<Set<number>>(new Set())

  // Efeito para comandos de destaque
  useEffect(() => {
    if (!highlightCommand || !root) {
      setHighlightedNodes(new Set())
      return
    }
    switch (highlightCommand.type) {
      case 'root':
        setHighlightedNodes(new Set([root.id]))
        break
      case 'leaves': {
        const leaves: number[] = []
        const dfs = (n: TreeNode | null) => {
          if (!n) return
          if (!n.left && !n.right) leaves.push(n.id)
          dfs(n.left || null)
          dfs(n.right || null)
        }
        dfs(root)
        setHighlightedNodes(new Set(leaves))
        break
      }
      case 'level': {
        const found: number[] = []
        let targetLevel = -1
        const findLevel = (n: TreeNode | null, level = 0): boolean => {
          if (!n) return false
          if (n.value === highlightCommand.value) {
            targetLevel = level
            return true
          }
          return findLevel(n.left || null, level + 1) || findLevel(n.right || null, level + 1)
        }
        findLevel(root)
        const collect = (n: TreeNode | null, l = 0) => {
          if (!n) return
          if (l === targetLevel) found.push(n.id)
          collect(n.left || null, l + 1)
          collect(n.right || null, l + 1)
        }
        if (targetLevel >= 0) collect(root, 0)
        setHighlightedNodes(new Set(found))
        break
      }
      case 'subtree': {
        const found: number[] = []
        const find = (n: TreeNode | null): TreeNode | null => {
          if (!n) return null
          if (n.value === highlightCommand.value) return n
          return find(n.left || null) || find(n.right || null)
        }
        const subtree = find(root)
        const collect = (n: TreeNode | null) => {
          if (!n) return
          found.push(n.id)
          collect(n.left || null)
          collect(n.right || null)
        }
        collect(subtree)
        setHighlightedNodes(new Set(found))
        break
      }
      case 'path': {
        const path: number[] = []
        const dfs = (n: TreeNode | null): boolean => {
          if (!n) return false
          path.push(n.id)
          if (n.value === highlightCommand.value) return true
          if (dfs(n.left || null) || dfs(n.right || null)) return true
          path.pop()
          return false
        }
        dfs(root)
        setHighlightedNodes(new Set(path))
        break
      }
      case 'ancestors': {
        const path: number[] = []
        const dfs = (n: TreeNode | null): boolean => {
          if (!n) return false
          path.push(n.id)
          if (n.value === highlightCommand.value) return true
          if (dfs(n.left || null) || dfs(n.right || null)) return true
          path.pop()
          return false
        }
        if (dfs(root)) path.pop()
        setHighlightedNodes(new Set(path))
        break
      }
      case 'descendants': {
        const found: number[] = []
        const find = (n: TreeNode | null): TreeNode | null => {
          if (!n) return null
          if (n.value === highlightCommand.value) return n
          return find(n.left || null) || find(n.right || null)
        }
        const node = find(root)
        const collect = (n: TreeNode | null) => {
          if (!n) return
          found.push(n.id)
          collect(n.left || null)
          collect(n.right || null)
        }
        collect(node)
        found.shift()
        setHighlightedNodes(new Set(found))
        break
      }
      default:
        setHighlightedNodes(new Set())
    }
  }, [highlightCommand, root])
  const [visitedNodes, setVisitedNodes] = useState<Set<number>>(new Set())
  const [currentNode, setCurrentNode] = useState<number | null>(null)
  const [isTraversing, setIsTraversing] = useState(false)
  const [traversalPath, setTraversalPath] = useState<number[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchPath, setSearchPath] = useState<number[]>([])
  const [foundNode, setFoundNode] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletePath, setDeletePath] = useState<number[]>([])
  const [nodeToDelete, setNodeToDelete] = useState<number | null>(null)
  const [deletedNode, setDeletedNode] = useState<number | null>(null)
    // Estados para tela infinita e navegação
  const [scale, setScale] = useState(1)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })// Algoritmo robusto para posicionamento adaptado para tela infinita
  const calculatePositions = (node: TreeNode | null): TreeNode | null => {
    if (!node) return null

    // Para tela infinita, usamos espaço mais compacto mas flexível
    const baseWidth = 1200  // Largura base reduzida
    const baseHeight = 1000 // Altura base reduzida
    
    // Primeiro, vamos calcular a altura da árvore
    const getTreeHeight = (n: TreeNode | null): number => {
      if (!n) return -1 // Altura em arestas: árvore vazia = -1
      return 1 + Math.max(getTreeHeight(n.left || null), getTreeHeight(n.right || null))
    }    // Calcular largura da árvore (número máximo de nós em um nível)
    const getTreeWidth = (n: TreeNode | null, level: number = 0, widths: Map<number, number> = new Map()): number => {
      if (!n) return 0
      widths.set(level, (widths.get(level) || 0) + 1)
      getTreeWidth(n.left || null, level + 1, widths)
      getTreeWidth(n.right || null, level + 1, widths)
      return Math.max(...Array.from(widths.values()))
    }

    const treeHeight = getTreeHeight(node)
    const treeWidth = getTreeWidth(node)
    
    // Espaçamento mais compacto e adaptável
    const levelHeight = Math.max(80, Math.min(120, baseHeight / Math.max(1, treeHeight - 1)))
    const nodeSpacing = Math.max(60, Math.min(100, baseWidth / Math.max(1, treeWidth * 2)))

    // Função para obter todas as folhas em um nível
    const getLeavesAtLevel = (n: TreeNode | null, targetLevel: number, currentLevel = 0): TreeNode[] => {
      if (!n) return []
      if (currentLevel === targetLevel) return [n]
      
      return [
        ...getLeavesAtLevel(n.left || null, targetLevel, currentLevel + 1),
        ...getLeavesAtLevel(n.right || null, targetLevel, currentLevel + 1)
      ]
    }    // Calcular posições usando algoritmo melhorado para árvores desbalanceadas
    const positionNode = (n: TreeNode | null, minX: number, maxX: number, level: number): TreeNode | null => {
      if (!n) return null

      const centerX = (minX + maxX) / 2
      const y = 80 + level * levelHeight

      // Para folhas, usar posição centralizada
      if (!n.left && !n.right) {
        return {
          ...n,
          x: centerX,
          y,
          level
        }
      }

      // Para nós internos, calcular recursivamente com melhor distribuição
      const totalWidth = maxX - minX
      const midpoint = (minX + maxX) / 2
      
      let left: TreeNode | undefined
      let right: TreeNode | undefined

      if (n.left && n.right) {
        // Dividir espaço de forma mais inteligente para árvores desbalanceadas
        const leftSubtreeSize = getTreeWidth(n.left)
        const rightSubtreeSize = getTreeWidth(n.right)
        const totalSubtreeSize = leftSubtreeSize + rightSubtreeSize
          if (totalSubtreeSize > 0) {
          const leftRatio = leftSubtreeSize / totalSubtreeSize
          const splitPoint = minX + (totalWidth * leftRatio)
          const spacing = Math.min(nodeSpacing * 0.6, totalWidth * 0.03) // Reduzido
          
          left = positionNode(n.left, minX, splitPoint - spacing/2, level + 1) || undefined
          right = positionNode(n.right, splitPoint + spacing/2, maxX, level + 1) || undefined
        } else {
          const spacing = Math.min(nodeSpacing * 0.5, totalWidth * 0.05) // Reduzido
          left = positionNode(n.left, minX, midpoint - spacing/2, level + 1) || undefined
          right = positionNode(n.right, midpoint + spacing/2, maxX, level + 1) || undefined
        }      } else if (n.left) {
        // Só subárvore esquerda - centralizar melhor
        const spacing = Math.min(nodeSpacing * 0.4, totalWidth * 0.05) // Reduzido
        left = positionNode(n.left, minX, maxX - spacing, level + 1) || undefined
      } else if (n.right) {        // Só subárvore direita - centralizar melhor  
        const spacing = Math.min(nodeSpacing * 0.4, totalWidth * 0.05) // Reduzido
        right = positionNode(n.right, minX + spacing, maxX, level + 1) || undefined
      }

      return {
        ...n,
        x: centerX,
        y,
        level,
        left,
        right
      }
    }

    return positionNode(node, 0, baseWidth, 0)
  }  // Funções para navegação na tela infinita
  // handleWheel removido: zoom pelo scroll desabilitado
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Botão esquerdo do mouse
      setIsDragging(true)
      setLastMousePos({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - lastMousePos.x
      const deltaY = e.clientY - lastMousePos.y
      
      setTranslateX(prev => prev + deltaX / scale)
      setTranslateY(prev => prev + deltaY / scale)
      setLastMousePos({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Função para resetar a visualização para o centro
  const resetView = () => {
    setScale(1)
    setTranslateX(0)
    setTranslateY(0)
  }

  // Função para centralizar a árvore automaticamente
  const centerTree = () => {
    if (!root) return
    
    const positionedRoot = calculateCenteredPositions(root)
    if (!positionedRoot) return
    
    // Calcular bounds da árvore
    const bounds = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
    
    const updateBounds = (node: TreeNode | null) => {
      if (!node || node.x === undefined || node.y === undefined) return
      bounds.minX = Math.min(bounds.minX, node.x)
      bounds.maxX = Math.max(bounds.maxX, node.x)
      bounds.minY = Math.min(bounds.minY, node.y)
      bounds.maxY = Math.max(bounds.maxY, node.y)
      
      if (node.left) updateBounds(node.left)
      if (node.right) updateBounds(node.right)
    }
      updateBounds(positionedRoot)
    
    if (bounds.minX !== Infinity) {
      // Centralizar na viewport (800x600)
      const treeCenterX = (bounds.minX + bounds.maxX) / 2
      const treeCenterY = (bounds.minY + bounds.maxY) / 2
      
      const viewportCenterX = 400
      const viewportCenterY = 300
      
      // Calcular tamanho da árvore
      const treeWidth = bounds.maxX - bounds.minX
      const treeHeight = bounds.maxY - bounds.minY
      
      // Calcular zoom ideal para caber na tela com padding
      const viewportWidth = 700
      const viewportHeight = 500
      
      let optimalScale = 1
      if (treeWidth > 0 && treeHeight > 0) {
        const scaleX = viewportWidth / (treeWidth + 100)
        const scaleY = viewportHeight / (treeHeight + 100)
        optimalScale = Math.min(2, Math.max(0.3, Math.min(scaleX, scaleY)))
      }
      
      // Definir escala primeiro
      setScale(optimalScale)
      
      // Calcular translação para centralizar
      const translateX = viewportCenterX - (treeCenterX * optimalScale)
      const translateY = viewportCenterY - (treeCenterY * optimalScale)
      
      setTranslateX(translateX)
      setTranslateY(translateY)
    }
  }
  // Função simplificada para usar diretamente
  const calculateCenteredPositions = (node: TreeNode | null): TreeNode | null => {
    return calculatePositions(node)
  }

  const renderConnections = (node: TreeNode | null): React.JSX.Element[] => {
    if (!node || node.x === undefined || node.y === undefined) return []

    const connections: React.JSX.Element[] = []

    if (node.left && node.left.x !== undefined && node.left.y !== undefined) {
      connections.push(
        <motion.line
          key={`line-${node.id}-left`}
          x1={node.x}
          y1={node.y}
          x2={node.left.x}
          y2={node.left.y}
          stroke="rgb(148 163 184)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
        />
      )
      connections.push(...renderConnections(node.left))
    }

    if (node.right && node.right.x !== undefined && node.right.y !== undefined) {
      connections.push(
        <motion.line
          key={`line-${node.id}-right`}
          x1={node.x}
          y1={node.y}
          x2={node.right.x}
          y2={node.right.y}
          stroke="rgb(148 163 184)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
        />
      )
      connections.push(...renderConnections(node.right))
    }

    return connections
  }
  const renderNodes = (node: TreeNode | null): React.JSX.Element[] => {
    if (!node || node.x === undefined || node.y === undefined) return []


    const isVisited = visitedNodes.has(node.id)
    const isCurrent = currentNode === node.id
    const isInSearchPath = searchPath.includes(node.value)
    const isFound = foundNode === node.id
    const isInDeletePath = deletePath.includes(node.value)
    const isMarkedForDeletion = nodeToDelete === node.id
    const isDeleted = deletedNode === node.id
    const isHighlighted = highlightedNodes.has(node.id)

    // Determinar cores baseadas no estado
    let circleColor = "rgb(71 85 105)" // default slate-600
    let textColor = "rgb(255 255 255)" // white
    let strokeColor = "rgb(148 163 184)" // slate-400

    if (isHighlighted) {
      circleColor = "rgb(250 204 21)" // yellow-400
      strokeColor = "rgb(202 138 4)" // yellow-700
    } else if (isDeleted) {
      circleColor = "rgb(239 68 68)" // red-500
      strokeColor = "rgb(220 38 38)" // red-600
    } else if (isMarkedForDeletion) {
      circleColor = "rgb(251 146 60)" // orange-400
      strokeColor = "rgb(234 88 12)" // orange-600
    } else if (isFound) {
      circleColor = "rgb(34 197 94)" // green-500
      strokeColor = "rgb(22 163 74)" // green-600
    } else if (isCurrent) {
      circleColor = "rgb(59 130 246)" // blue-500
      strokeColor = "rgb(37 99 235)" // blue-600
    } else if (isInSearchPath || isInDeletePath) {
      circleColor = "rgb(168 85 247)" // purple-500
      strokeColor = "rgb(147 51 234)" // purple-600
    } else if (isVisited) {
      circleColor = "rgb(16 185 129)" // emerald-500
      strokeColor = "rgb(5 150 105)" // emerald-600
    }

    const nodeElements = [
      <motion.g key={`node-${node.id}`}>
        <motion.circle
          cx={node.x}
          cy={node.y}
          r="25"
          fill={circleColor}
          stroke={strokeColor}
          strokeWidth="3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`${isCurrent ? 'animate-pulse' : ''}`}
        />
        <motion.text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={textColor}
          fontSize="16"
          fontWeight="bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {node.value}
        </motion.text>
      </motion.g>
    ]

    if (node.left) {
      nodeElements.push(...renderNodes(node.left))
    }
    if (node.right) {
      nodeElements.push(...renderNodes(node.right))
    }

    return nodeElements
  }

  const traverseTree = async (node: TreeNode | null, order: 'inorder' | 'preorder' | 'postorder') => {
    if (!node) return

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    if (order === 'preorder') {
      setCurrentNode(node.id)
      await delay(800)
      setVisitedNodes(prev => new Set([...prev, node.id]))
      setTraversalPath(prev => [...prev, node.value])
      await delay(400)
      
      if (node.left) await traverseTree(node.left, order)
      if (node.right) await traverseTree(node.right, order)
    } else if (order === 'inorder') {
      if (node.left) await traverseTree(node.left, order)
      
      setCurrentNode(node.id)
      await delay(800)
      setVisitedNodes(prev => new Set([...prev, node.id]))
      setTraversalPath(prev => [...prev, node.value])
      await delay(400)
      
      if (node.right) await traverseTree(node.right, order)
    } else if (order === 'postorder') {
      if (node.left) await traverseTree(node.left, order)
      if (node.right) await traverseTree(node.right, order)
      
      setCurrentNode(node.id)
      await delay(800)
      setVisitedNodes(prev => new Set([...prev, node.id]))
      setTraversalPath(prev => [...prev, node.value])
      await delay(400)
    }
  }

  const searchInTree = async (node: TreeNode | null, value: number): Promise<boolean> => {
    if (!node) return false

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    // Marcar o nó atual como sendo visitado na busca
    setCurrentNode(node.id)
    setSearchPath(prev => [...prev, node.value])
    await delay(1000)

    if (value === node.value) {
      // Valor encontrado!
      setFoundNode(node.id)
      await delay(1500)
      return true
    } else if (value < node.value) {
      // Buscar na subárvore esquerda
      if (node.left) {
        return await searchInTree(node.left, value)
      } else {
        return false
      }
    } else {
      // Buscar na subárvore direita
      if (node.right) {
        return await searchInTree(node.right, value)
      } else {
        return false
      }
    }
  }

  const startSearch = async (value: number) => {
    if (!root || isSearching || isTraversing) return
    
    setIsSearching(true)
    setSearchPath([])
    setFoundNode(null)
    setCurrentNode(null)
    // Limpar dados de percurso anterior
    setVisitedNodes(new Set())
    setTraversalPath([])
    
    const found = await searchInTree(root, value)
    
    setCurrentNode(null)
    setIsSearching(false)
    if (onSearchComplete) {
      onSearchComplete(found)
    }
  }

  const searchForDeletion = async (node: TreeNode | null, value: number): Promise<boolean> => {
    if (!node) return false

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    // Marcar o nó atual como sendo visitado na busca para remoção
    setCurrentNode(node.id)
    setDeletePath(prev => [...prev, node.value])
    await delay(1000)

    if (value === node.value) {
      // Valor encontrado para remoção!
      setNodeToDelete(node.id)
      await delay(1500) // Destacar o nó que será removido
      
      // Simular a remoção com animação
      setDeletedNode(node.id)
      await delay(1000)
      return true
    } else if (value < node.value) {
      // Buscar na subárvore esquerda
      if (node.left) {
        return await searchForDeletion(node.left, value)
      } else {
        return false
      }
    } else {
      // Buscar na subárvore direita
      if (node.right) {
        return await searchForDeletion(node.right, value)
      } else {
        return false
      }
    }
  }

  const startDeletion = async (value: number) => {
    if (!root || isDeleting || isTraversing || isSearching) return
    
    setIsDeleting(true)
    setDeletePath([])
    setNodeToDelete(null)
    setDeletedNode(null)
    setCurrentNode(null)
    // Limpar dados anteriores
    setVisitedNodes(new Set())
    setTraversalPath([])
    setSearchPath([])
    setFoundNode(null)
    
    const found = await searchForDeletion(root, value)
    
    setCurrentNode(null)
    setIsDeleting(false)
    
    if (onDeleteComplete) {
      onDeleteComplete(found)
    }
  }

  const startTraversal = async () => {
    if (!root || isTraversing) return
    
    setIsTraversing(true)
    setVisitedNodes(new Set())
    setCurrentNode(null)
    setTraversalPath([])
    
    await traverseTree(root, algorithm)
    
    setCurrentNode(null)
    setIsTraversing(false)
  }

  const resetVisualization = () => {
    setVisitedNodes(new Set())
    setCurrentNode(null)
    setTraversalPath([])
    setIsTraversing(false)
    setSearchPath([])
    setFoundNode(null)
    setIsSearching(false)
    setIsDeleting(false)
    setDeletePath([])
    setNodeToDelete(null)
    setDeletedNode(null)
    setHighlightedNodes(new Set())
  }

  // Detectar quando o valor de busca é fornecido
  useEffect(() => {
    if (searchValue !== undefined) {
      startSearch(searchValue)
    }
  }, [searchValue])
  // Detectar quando o valor de remoção é fornecido
  useEffect(() => {
    if (deleteValue !== undefined) {
      startDeletion(deleteValue)
    }
  }, [deleteValue])
  // Centralizar automaticamente quando a árvore muda
  useEffect(() => {
    if (root) {
      // Delay para permitir que o layout seja calculado
      const timer = setTimeout(() => {
        centerTree()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [root])
  
  const positionedRoot = root ? calculateCenteredPositions(root) : null

  return (
    <div className="tree-visualizer w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 shadow-2xl border border-slate-700">{/* Controles */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button 
          onClick={startTraversal} 
          disabled={isTraversing || !root}
          className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 ${
            isTraversing || !root 
              ? 'bg-slate-600 cursor-not-allowed opacity-50' 
              : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-lg hover:shadow-blue-500/25'
          }`}
        >
          {isTraversing ? '🔄 Percorrendo...' : `▶️ Iniciar ${algorithm.toUpperCase()}`}
        </button>
        <button 
          onClick={resetVisualization} 
          className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
        >
          🔄 Resetar
        </button>
        
        {/* Controles de navegação */}
        <div className="flex gap-2 ml-4 border-l border-slate-600 pl-4">
          <button 
            onClick={centerTree} 
            disabled={!root}
            className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 ${
              !root
                ? 'bg-slate-600 cursor-not-allowed opacity-50' 
                : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-105 shadow-lg hover:shadow-emerald-500/25'
            }`}
          >
            🎯 Centralizar
          </button>
          <button 
            onClick={() => setScale(prev => Math.min(4, prev + 0.1))}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            title="Aumentar Zoom"
          >
            ＋
          </button>
          <button 
            onClick={() => setScale(prev => Math.max(0.1, prev - 0.1))}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            title="Diminuir Zoom"
          >
            －
          </button>
          <button 
            onClick={resetView} 
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            🔍 Reset Zoom
          </button>
        </div>
        
        {/* Indicadores de navegação */}
        <div className="flex items-center gap-4 ml-4 border-l border-slate-600 pl-4 text-slate-300">
          <span className="text-sm">
            Zoom: {(scale * 100).toFixed(0)}%
          </span>
          <span className="text-sm">
            Pan: ({translateX.toFixed(0)}, {translateY.toFixed(0)})
          </span>
        </div>
      </div>
      
      {/* Instruções de uso */}
      <div className="mb-4 p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg">
        <p className="text-slate-300 text-sm">
          💡 <strong>Navegação:</strong> Use o scroll do mouse para zoom, clique e arraste para mover a visualização. 
          Ideal para árvores desbalanceadas!
        </p>
      </div>
      
      {/* Informações de busca */}
      {isSearching && (
        <div className="mb-6 p-4 bg-blue-900/50 border border-blue-500/30 rounded-lg backdrop-blur-sm">
          <h4 className="text-lg font-bold text-blue-200 mb-2 flex items-center gap-2">
            🔍 Buscando...
          </h4>
          <div className="text-blue-100">
            <p className="mb-2">Caminho percorrido:</p>
            <div className="flex flex-wrap gap-2">
              {searchPath.map((value, index) => (
                <span key={index} className="inline-flex items-center">
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                    {value}
                  </span>
                  {index < searchPath.length - 1 && (
                    <span className="mx-2 text-blue-300">→</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Resultado da busca - encontrado */}
      {foundNode !== null && !isSearching && (
        <div className="mb-6 p-4 bg-green-900/50 border border-green-500/30 rounded-lg backdrop-blur-sm">
          <h4 className="text-lg font-bold text-green-200 mb-2 flex items-center gap-2">
            ✅ Valor encontrado!
          </h4>
          <p className="text-green-100">
            O valor foi localizado seguindo o caminho: {' '}
            <span className="font-mono bg-green-800/50 px-2 py-1 rounded">
              {searchPath.join(' → ')}
            </span>
          </p>
        </div>
      )}
      
      {/* Resultado da busca - não encontrado */}
      {searchPath.length > 0 && foundNode === null && !isSearching && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500/30 rounded-lg backdrop-blur-sm">
          <h4 className="text-lg font-bold text-red-200 mb-2 flex items-center gap-2">
            ❌ Valor não encontrado
          </h4>
          <p className="text-red-100">
            Caminho percorrido: {' '}
            <span className="font-mono bg-red-800/50 px-2 py-1 rounded">
              {searchPath.join(' → ')}
            </span>
          </p>
        </div>
      )}
      
      {/* Informações de remoção */}
      {isDeleting && (
        <div className="mb-6 p-4 bg-orange-900/50 border border-orange-500/30 rounded-lg backdrop-blur-sm">
          <h4 className="text-lg font-bold text-orange-200 mb-2 flex items-center gap-2">
            🗑️ Removendo...
          </h4>
          <div className="text-orange-100">
            <p className="mb-2">Caminho percorrido:</p>
            <div className="flex flex-wrap gap-2">
              {deletePath.map((value, index) => (
                <span key={index} className="inline-flex items-center">
                  <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm font-medium">
                    {value}
                  </span>
                  {index < deletePath.length - 1 && (
                    <span className="mx-2 text-orange-300">→</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Resultado da remoção - removido */}
      {deletedNode !== null && !isDeleting && (
        <div className="mb-6 p-4 bg-green-900/50 border border-green-500/30 rounded-lg backdrop-blur-sm">
          <h4 className="text-lg font-bold text-green-200 mb-2 flex items-center gap-2">
            ✅ Valor removido!
          </h4>
          <p className="text-green-100">
            O valor foi removido seguindo o caminho: {' '}
            <span className="font-mono bg-green-800/50 px-2 py-1 rounded">
              {deletePath.join(' → ')}
            </span>
          </p>
        </div>
      )}
      
      {/* Resultado da remoção - não encontrado */}
      {deletePath.length > 0 && deletedNode === null && !isDeleting && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500/30 rounded-lg backdrop-blur-sm">
          <h4 className="text-lg font-bold text-red-200 mb-2 flex items-center gap-2">
            ❌ Valor não encontrado para remoção
          </h4>
          <p className="text-red-100">
            Caminho percorrido: {' '}
            <span className="font-mono bg-red-800/50 px-2 py-1 rounded">
              {deletePath.join(' → ')}
            </span>
          </p>
        </div>
      )}
      
      {/* Sequência de percurso */}
      {traversalPath.length > 0 && (
        <div className="mb-6 p-4 bg-purple-900/50 border border-purple-500/30 rounded-lg backdrop-blur-sm">
          <h4 className="text-lg font-bold text-purple-200 mb-2">
            Sequência de Percurso:
          </h4>
          <div className="flex flex-wrap gap-2">
            {traversalPath.map((value, index) => (
              <span key={index} className="inline-flex items-center">
                <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
                  {value}
                </span>
                {index < traversalPath.length - 1 && (
                  <span className="mx-2 text-purple-300">→</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}      {/* SVG da árvore com tela infinita */}
      <div 
        className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm border border-slate-600/50"
        tabIndex={0}
        style={{ outline: 'none' }}
      >
        <svg 
          className="w-full h-[600px] border border-slate-700 rounded-lg cursor-move" 
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid meet"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            touchAction: 'none' // Previne gestos de zoom nativo em touch devices
          }}
        >
          {/* Background pattern para indicar tela infinita */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgb(71 85 105)" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          
          {/* Grid de fundo */}
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Grupo principal com transformações */}
          <g transform={`translate(${translateX}, ${translateY}) scale(${scale})`}>
            {positionedRoot && (
              <>
                {renderConnections(positionedRoot)}
                {renderNodes(positionedRoot)}
              </>
            )}
          </g>
          
          {/* Overlay de instruções quando não há árvore */}
          {!root && (
            <g>
              <rect x="0" y="0" width="800" height="600" fill="rgba(15, 23, 42, 0.8)" />
              <text 
                x="400" 
                y="280" 
                textAnchor="middle" 
                fill="rgb(148 163 184)" 
                fontSize="18"
                className="select-none"
              >
                Árvore vazia - Insira alguns valores para começar
              </text>
              <text 
                x="400" 
                y="320" 
                textAnchor="middle" 
                fill="rgb(100 116 139)" 
                fontSize="14"
                className="select-none"
              >
                Use scroll para zoom e arraste para navegar
              </text>
            </g>
          )}
          
          {/* Indicador de zoom no canto */}
          <g transform="translate(10, 10)">
            <rect x="0" y="0" width="120" height="30" fill="rgba(15, 23, 42, 0.8)" stroke="rgb(71 85 105)" strokeWidth="1" rx="4" />
            <text x="60" y="20" textAnchor="middle" fill="rgb(148 163 184)" fontSize="12">
              Zoom: {(scale * 100).toFixed(0)}%
            </text>
          </g>
        </svg>
      </div>
    </div>
  )
}
