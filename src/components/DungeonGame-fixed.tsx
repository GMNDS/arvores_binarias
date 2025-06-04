import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DungeonNode {
  id: string
  value: number
  left?: DungeonNode
  right?: DungeonNode
  hasTreasure?: boolean
  isVisited?: boolean
  hasClue?: boolean
  clueType?: 'smaller' | 'larger' | 'exact' | 'wrong-path'
  x?: number
  y?: number
  level?: number
}

interface Position {
  x: number
  y: number
}

export const DungeonGame = () => {
  const [dungeon, setDungeon] = useState<DungeonNode | null>(null)
  const [currentRoom, setCurrentRoom] = useState<DungeonNode | null>(null)
  const [targetTreasure, setTargetTreasure] = useState<number>(0)
  const [path, setPath] = useState<string[]>([])
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [steps, setSteps] = useState(0)
  const [visitedRooms, setVisitedRooms] = useState<Set<string>>(new Set())
  const [showTree, setShowTree] = useState(false)
  const [roomPositions, setRoomPositions] = useState<Map<string, Position>>(new Map())
  const [discoveredRooms, setDiscoveredRooms] = useState<Set<string>>(new Set())
  const [gameMode, setGameMode] = useState<'explore' | 'search' | 'race'>('explore')

  const createDungeon = (): DungeonNode => {
    const values = [50, 25, 75, 12, 37, 62, 87, 6, 18, 31, 43, 56, 68, 81, 93]
    let root: DungeonNode | null = null

    const insert = (node: DungeonNode | null, value: number): DungeonNode => {
      if (!node) {
        return { 
          id: `room-${value}`,
          value,
          level: 0
        }
      }
      if (value < node.value) {
        const leftNode = insert(node.left || null, value)
        leftNode.level = (node.level || 0) + 1
        node.left = leftNode
      } else if (value > node.value) {
        const rightNode = insert(node.right || null, value)
        rightNode.level = (node.level || 0) + 1
        node.right = rightNode
      }
      return node
    }

    values.forEach(value => {
      root = insert(root, value)
    })

    return root!
  }

  const calculateRoomPositions = (node: DungeonNode | null, x: number = 400, y: number = 100, level: number = 0): Map<string, Position> => {
    const positions = new Map<string, Position>()
    if (!node) return positions
    
    const horizontalSpacing = Math.max(60, 200 / (level + 1))
    
    positions.set(node.id, { x, y })
    
    if (node.left) {
      const leftPositions = calculateRoomPositions(
        node.left, 
        x - horizontalSpacing, 
        y + 80, 
        level + 1
      )
      leftPositions.forEach((pos, id) => positions.set(id, pos))
    }
    
    if (node.right) {
      const rightPositions = calculateRoomPositions(
        node.right, 
        x + horizontalSpacing, 
        y + 80, 
        level + 1
      )
      rightPositions.forEach((pos, id) => positions.set(id, pos))
    }
    
    return positions
  }

  const placeTreasure = () => {
    const possibleValues = [6, 18, 31, 43, 56, 68, 81, 93, 12, 37, 62, 87]
    return possibleValues[Math.floor(Math.random() * possibleValues.length)]
  }

  const initializeGame = () => {
    const newDungeon = createDungeon()
    const treasure = placeTreasure()
    const positions = calculateRoomPositions(newDungeon)
    
    setDungeon(newDungeon)
    setCurrentRoom(newDungeon)
    setTargetTreasure(treasure)
    setPath([newDungeon.id])
    setGameStatus('playing')
    setSteps(0)
    setRoomPositions(positions)
    setDiscoveredRooms(new Set([newDungeon.id]))
    setVisitedRooms(new Set([newDungeon.id]))
  }

  useEffect(() => {
    initializeGame()
  }, [])

  const moveToRoom = (direction: 'left' | 'right') => {
    if (!currentRoom || gameStatus !== 'playing') return

    const nextRoom = direction === 'left' ? currentRoom.left : currentRoom.right

    if (!nextRoom) {
      setGameStatus('lost')
      return
    }
    
    setCurrentRoom(nextRoom)
    setPath(prev => [...prev, nextRoom.id])
    setSteps(prev => prev + 1)
    
    // Descobrir novos caminhos
    const newDiscovered = new Set(discoveredRooms)
    newDiscovered.add(nextRoom.id)
    if (nextRoom.left) newDiscovered.add(nextRoom.left.id)
    if (nextRoom.right) newDiscovered.add(nextRoom.right.id)
    setDiscoveredRooms(newDiscovered)
    
    // Marcar como visitado
    setVisitedRooms(prev => new Set([...prev, nextRoom.id]))

    if (nextRoom.value === targetTreasure) {
      setGameStatus('won')
    }
  }

  const getClueForRoom = (room: DungeonNode): string => {
    if (room.value === targetTreasure) {
      return '💰 Você encontrou o tesouro!'
    }
    
    // Pistas baseadas na estrutura da árvore binária
    const hints = []
    
    if (targetTreasure < room.value) {
      hints.push('🧭 O tesouro tem um valor menor que o desta sala')
      if (room.left) {
        hints.push('⬅️ Explore o caminho da esquerda')
      } else {
        hints.push('🚫 Não há saída à esquerda - você pode estar no caminho errado!')
      }
    } else if (targetTreasure > room.value) {
      hints.push('🧭 O tesouro tem um valor maior que o desta sala')
      if (room.right) {
        hints.push('➡️ Explore o caminho da direita')
      } else {
        hints.push('🚫 Não há saída à direita - você pode estar no caminho errado!')
      }
    }
    
    // Adicionar pistas sobre a estrutura
    if (room.left && room.right) {
      hints.push('🔄 Esta sala tem dois caminhos - escolha com sabedoria!')
    } else if (!room.left && !room.right) {
      hints.push('🏁 Esta é uma sala sem saída - um beco sem saída!')
    }
    
    return hints.join(' ')
  }

  const renderDungeonMap = () => {
    if (!dungeon) return null

    const renderNode = (node: DungeonNode | undefined, isCurrentRoom: boolean = false) => {
      if (!node) return null
      
      const position = roomPositions.get(node.id)
      if (!position) return null
      
      const isDiscovered = discoveredRooms.has(node.id)
      const isVisited = visitedRooms.has(node.id)
      const hasTreasure = node.value === targetTreasure
      
      if (!isDiscovered) return null

      return (
        <g key={node.id}>
          {/* Linhas conectando as salas */}
          {node.left && discoveredRooms.has(node.left.id) && (
            <line
              x1={position.x}
              y1={position.y}
              x2={roomPositions.get(node.left.id)?.x}
              y2={roomPositions.get(node.left.id)?.y}
              stroke="#666"
              strokeWidth="2"
              opacity="0.6"
            />
          )}
          {node.right && discoveredRooms.has(node.right.id) && (
            <line
              x1={position.x}
              y1={position.y}
              x2={roomPositions.get(node.right.id)?.x}
              y2={roomPositions.get(node.right.id)?.y}
              stroke="#666"
              strokeWidth="2"
              opacity="0.6"
            />
          )}
          
          {/* Sala */}
          <motion.circle
            cx={position.x}
            cy={position.y}
            r="25"
            fill={
              isCurrentRoom 
                ? '#4CAF50' 
                : hasTreasure 
                ? '#FFD700' 
                : isVisited 
                ? '#2196F3' 
                : '#666'
            }
            stroke={isCurrentRoom ? '#FFF' : 'none'}
            strokeWidth="3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ cursor: 'pointer' }}
          />
          
          {/* Valor da sala */}
          <text
            x={position.x}
            y={position.y + 5}
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
          >
            {node.value}
          </text>
          
          {/* Ícones especiais */}
          {hasTreasure && (
            <text x={position.x - 15} y={position.y - 30} fontSize="20">💰</text>
          )}
          {isCurrentRoom && (
            <text x={position.x - 15} y={position.y - 30} fontSize="20">👤</text>
          )}
        </g>
      )
    }

    const renderTree = (node: DungeonNode | undefined): React.ReactElement[] => {
      if (!node) return []
      
      return [
        renderNode(node, node.id === currentRoom?.id),
        ...renderTree(node.left),
        ...renderTree(node.right)
      ].filter(Boolean) as React.ReactElement[]    }

    return (
      <div className="bg-slate-800/30 rounded-xl p-6 backdrop-blur-sm border border-slate-600/50 shadow-xl">
        <svg width="800" height="500" className="w-full h-auto max-w-4xl mx-auto">
          {renderTree(dungeon)}
        </svg>
      </div>
    )
  }
  const renderGamePanel = () => {
    if (!currentRoom) return null

    const clue = getClueForRoom(currentRoom)
    const canGoLeft = currentRoom.left !== undefined
    const canGoRight = currentRoom.right !== undefined

    return (
      <motion.div 
        className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-600/50 shadow-xl"
        key={currentRoom.id}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <h3 className="text-2xl font-bold text-white mb-4 lg:mb-0 flex items-center gap-2">
            🏰 Sala {currentRoom.value}
          </h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-purple-600/30 px-3 py-1 rounded-full text-purple-200 border border-purple-500/30">
              🎯 Procurando: {targetTreasure}
            </span>
            <span className="bg-blue-600/30 px-3 py-1 rounded-full text-blue-200 border border-blue-500/30">
              👣 Passos: {steps}
            </span>
            <span className="bg-green-600/30 px-3 py-1 rounded-full text-green-200 border border-green-500/30">
              🗺️ Salas descobertas: {discoveredRooms.size}
            </span>
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-6 mb-6 border border-slate-600/30">
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-purple-400/50">
                {currentRoom.value}
              </div>
              {currentRoom.value === targetTreasure && (
                <motion.div 
                  className="absolute -top-2 -right-2 text-4xl"
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  💰
                </motion.div>
              )}
            </div>

            <div className="flex gap-4 w-full max-w-md">
              <button
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  canGoLeft 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:scale-105 hover:shadow-blue-500/25' 
                    : 'bg-red-600/30 text-red-300 cursor-not-allowed border border-red-500/30'
                }`}
                onClick={() => moveToRoom('left')}
                disabled={!canGoLeft || gameStatus !== 'playing'}
              >
                {canGoLeft ? `⬅️ Ir para ${currentRoom.left?.value}` : '🚫 Sem saída'}
              </button>

              <button
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  canGoRight 
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:scale-105 hover:shadow-orange-500/25' 
                    : 'bg-red-600/30 text-red-300 cursor-not-allowed border border-red-500/30'
                }`}
                onClick={() => moveToRoom('right')}
                disabled={!canGoRight || gameStatus !== 'playing'}
              >
                {canGoRight ? `➡️ Ir para ${currentRoom.right?.value}` : '🚫 Sem saída'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-amber-900/30 rounded-lg p-4 mb-4 border border-amber-600/30">
          <h4 className="text-lg font-bold text-amber-200 mb-2 flex items-center gap-2">
            🔍 Pista:
          </h4>
          <div className="text-amber-100 font-medium">{clue}</div>
        </div>

        <div className="flex justify-center">
          <button 
            onClick={() => setShowTree(!showTree)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
          >
            {showTree ? '🗺️ Ocultar Mapa' : '🗺️ Mostrar Mapa'}
          </button>
        </div>
      </motion.div>
    )
  }
  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 rounded-xl p-6 shadow-2xl border border-purple-700/50">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h2 className="text-2xl font-bold text-white mb-4 lg:mb-0 flex items-center gap-2">
          🏰 Caça ao Tesouro na Árvore Binária
        </h2>
        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              gameMode === 'explore' 
                ? 'bg-purple-600 text-white shadow-lg scale-105' 
                : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50'
            }`}
            onClick={() => setGameMode('explore')}
          >
            🗺️ Exploração
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              gameMode === 'search' 
                ? 'bg-purple-600 text-white shadow-lg scale-105' 
                : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50'
            }`}
            onClick={() => setGameMode('search')}
          >
            🔍 Busca Dirigida
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameStatus === 'won' && (
          <motion.div 
            className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 mb-6 text-white shadow-xl border border-green-500/30"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
              🎉 Tesouro Encontrado!
            </h2>
            <p className="text-xl mb-2">Você encontrou o tesouro {targetTreasure} em {steps} passos!</p>
            <p className="text-lg mb-4">🗺️ Explorou {discoveredRooms.size} salas na masmorra</p>
            <div className="bg-green-700/30 rounded-lg p-4 mb-4">
              <span className="text-lg font-semibold">
                🏃‍♂️ Eficiência: {steps <= 5 ? 'Excelente!' : steps <= 8 ? 'Boa!' : 'Pode melhorar!'}
              </span>
            </div>
            <button 
              onClick={initializeGame} 
              className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              🎮 Nova Aventura
            </button>
          </motion.div>
        )}

        {gameStatus === 'lost' && (
          <motion.div 
            className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-6 mb-6 text-white shadow-xl border border-red-500/30"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
              💀 Caminho Sem Saída!
            </h2>
            <p className="text-xl mb-4">Você tentou ir para uma sala inexistente!</p>
            <div className="bg-red-700/30 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                💡 Dica de Árvore Binária:
              </h4>
              <p className="mb-2">Em uma árvore binária de busca:</p>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  ⬅️ Esquerda = Valores <strong>menores</strong>
                </li>
                <li className="flex items-center gap-2">
                  ➡️ Direita = Valores <strong>maiores</strong>
                </li>
              </ul>
            </div>
            <button 
              onClick={initializeGame} 
              className="bg-white text-red-600 hover:bg-red-50 px-6 py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              🔄 Tentar Novamente
            </button>
          </motion.div>
        )}

        {gameStatus === 'playing' && (
          <div className="space-y-6">
            {showTree && renderDungeonMap()}
            {renderGamePanel()}
          </div>
        )}
      </AnimatePresence>

      <div className="bg-slate-800/50 rounded-lg p-4 mb-6 backdrop-blur-sm border border-slate-600/50">
        <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          🗺️ Jornada:
        </h4>
        <div className="flex flex-wrap gap-2">
          {path.map((roomId, index) => {
            const roomValue = roomId.replace('room-', '')
            return (
              <span key={index} className="inline-flex items-center">
                <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
                  {roomValue}
                </span>
                {index < path.length - 1 && (
                  <span className="mx-2 text-purple-300">→</span>
                )}
              </span>
            )
          })}
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-6 backdrop-blur-sm border border-slate-600/50">
        <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          🎯 Como Jogar:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30 hover:bg-slate-700/70 transition-colors">
            <span className="text-3xl mb-3 block">🧭</span>
            <div>
              <strong className="text-white text-lg block mb-2">Use as Pistas</strong>
              <p className="text-slate-300 text-sm">Cada sala dá pistas sobre onde encontrar o tesouro</p>
            </div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30 hover:bg-slate-700/70 transition-colors">
            <span className="text-3xl mb-3 block">🌳</span>
            <div>
              <strong className="text-white text-lg block mb-2">Entenda a Árvore</strong>
              <p className="text-slate-300 text-sm">Menores à esquerda, maiores à direita</p>
            </div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30 hover:bg-slate-700/70 transition-colors">
            <span className="text-3xl mb-3 block">🗺️</span>
            <div>
              <strong className="text-white text-lg block mb-2">Explore Visualmente</strong>
              <p className="text-slate-300 text-sm">Use o mapa para ver sua posição na árvore</p>
            </div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30 hover:bg-slate-700/70 transition-colors">
            <span className="text-3xl mb-3 block">⚡</span>
            <div>
              <strong className="text-white text-lg block mb-2">Seja Eficiente</strong>
              <p className="text-slate-300 text-sm">Tente encontrar o tesouro com menos passos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
