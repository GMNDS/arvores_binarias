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
  const [roomPositions, setRoomPositions] = useState<Map<string, Position>>(new Map())
  const [discoveredRooms, setDiscoveredRooms] = useState<Set<string>>(new Set())
  const [gameMode, setGameMode] = useState<'explore' | 'search'>('explore')
  const [maxSteps, setMaxSteps] = useState<number>(0)

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
    const calculateRoomPositions = (node: DungeonNode | null, x: number = 400, y: number = 80, level: number = 0): Map<string, Position> => {
    const positions = new Map<string, Position>()
    if (!node) return positions
    
    const horizontalSpacing = Math.max(80, 240 / (level + 1))
    const verticalSpacing = 110 // Maior espaçamento vertical para aproveitar a altura
    
    positions.set(node.id, { x, y })
    
    if (node.left) {
      const leftPositions = calculateRoomPositions(
        node.left, 
        x - horizontalSpacing, 
        y + verticalSpacing, 
        level + 1
      )
      leftPositions.forEach((pos, id) => positions.set(id, pos))
    }
    
    if (node.right) {
      const rightPositions = calculateRoomPositions(
        node.right, 
        x + horizontalSpacing, 
        y + verticalSpacing, 
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
    
    // MODO EXPLORAÇÃO: Descoberta gradual (só sala atual + adjacentes diretas)
    if (gameMode === 'explore') {
      const initialDiscovered = new Set([newDungeon.id])
      // Descobrir apenas salas diretamente conectadas
      if (newDungeon.left) initialDiscovered.add(newDungeon.left.id)
      if (newDungeon.right) initialDiscovered.add(newDungeon.right.id)
      setDiscoveredRooms(initialDiscovered)
      setMaxSteps(15) // Limite mais generoso para exploração
    } else {
      // MODO BUSCA DIRIGIDA: Visão completa da árvore
      const allNodes = new Set<string>()
      const traverseTree = (node: DungeonNode | null) => {
        if (!node) return
        allNodes.add(node.id)
        traverseTree(node.left || null)
        traverseTree(node.right || null)
      }
      traverseTree(newDungeon)
      setDiscoveredRooms(allNodes)
      setMaxSteps(8) // Desafio maior com visão completa
    }
      setVisitedRooms(new Set([newDungeon.id]))
  }

  useEffect(() => {
    initializeGame()
  }, [gameMode])
  const canMoveToRoom = (targetRoom: DungeonNode): boolean => {
    if (!currentRoom || gameStatus !== 'playing') return false
    return currentRoom.left?.id === targetRoom.id || currentRoom.right?.id === targetRoom.id
  }
  const moveToRoom = (targetRoom: DungeonNode) => {
    if (!canMoveToRoom(targetRoom)) return

    setCurrentRoom(targetRoom)
    setPath(prev => [...prev, targetRoom.id])
    setSteps(prev => prev + 1)
    
    // No modo exploração, descobrir salas adjacentes gradualmente
    if (gameMode === 'explore') {
      const newDiscovered = new Set(discoveredRooms)
      if (targetRoom.left && !discoveredRooms.has(targetRoom.left.id)) {
        newDiscovered.add(targetRoom.left.id)
      }
      if (targetRoom.right && !discoveredRooms.has(targetRoom.right.id)) {
        newDiscovered.add(targetRoom.right.id)
      }
      setDiscoveredRooms(newDiscovered)
    }
    
    setVisitedRooms(prev => new Set([...prev, targetRoom.id]))

    // Verificar se encontrou o tesouro
    if (targetRoom.value === targetTreasure) {
      setGameStatus('won')
    }

    // Verificar se excedeu o limite de passos
    if (steps + 1 >= maxSteps && targetRoom.value !== targetTreasure) {
      setGameStatus('lost')
    }
  }
  const getClueForRoom = (room: DungeonNode): string => {
    if (room.value === targetTreasure) {
      return '💰 Você encontrou o tesouro!'
    }
    
    const hints = []
    
    if (targetTreasure < room.value) {
      hints.push('🧭 O tesouro tem um valor menor que o desta sala')
      if (gameMode === 'explore') {
        if (room.left) {
          hints.push(`⬅️ Sala ${room.left.value} está à esquerda - Explore!`)
        } else {
          hints.push('🚫 Não há caminho à esquerda - você pode estar perdido!')
        }
      } else {
        hints.push('⬅️ Explore o caminho da esquerda na árvore')
      }
    } else if (targetTreasure > room.value) {
      hints.push('🧭 O tesouro tem um valor maior que o desta sala')
      if (gameMode === 'explore') {
        if (room.right) {
          hints.push(`➡️ Sala ${room.right.value} está à direita - Explore!`)
        } else {
          hints.push('🚫 Não há caminho à direita - você pode estar perdido!')
        }
      } else {
        hints.push('➡️ Explore o caminho da direita na árvore')
      }
    }
    
    // Adicionar pistas específicas por modo
    if (gameMode === 'explore') {
      hints.push(`🔍 Passos restantes: ${maxSteps - steps}`)
    } else {
      hints.push(`🎯 Use a árvore completa para planejar o caminho mais eficiente`)
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
      const canMoveTo = canMoveToRoom(node)
      
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
                : canMoveTo
                ? '#8B5CF6'
                : '#666'
            }
            stroke={
              isCurrentRoom 
                ? '#FFF' 
                : canMoveTo 
                ? '#FFF' 
                : 'none'
            }
            strokeWidth={isCurrentRoom ? "3" : canMoveTo ? "2" : "0"}
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              strokeDasharray: canMoveTo && !isCurrentRoom ? "5,5" : "0,0"
            }}
            transition={{ duration: 0.5 }}
            style={{ 
              cursor: canMoveTo ? 'pointer' : 'default',
              filter: canMoveTo && !isCurrentRoom ? 'brightness(1.2)' : 'none'
            }}
            onClick={() => canMoveTo && moveToRoom(node)}
            whileHover={canMoveTo ? { scale: 1.1 } : {}}
          />
          
          {/* Valor da sala */}
          <text
            x={position.x}
            y={position.y + 5}
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
            style={{ pointerEvents: 'none' }}
          >
            {node.value}
          </text>
            {/* Ícones especiais */}
          {hasTreasure && (
            <text x={position.x - 15} y={position.y - 30} fontSize="20" style={{ pointerEvents: 'none' }}>💰</text>
          )}
          {isCurrentRoom && (
            <text x={position.x - 15} y={position.y - 30} fontSize="20" style={{ pointerEvents: 'none' }}>👤</text>
          )}
          {canMoveTo && !isCurrentRoom && (
            <text x={position.x + 20} y={position.y - 20} fontSize="16" style={{ pointerEvents: 'none' }}>✨</text>
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
      ].filter(Boolean) as React.ReactElement[]
    }
      return (
      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            🗺️ Mapa da Masmorra
          </h4>
          <div className="text-sm text-slate-300">
            {gameMode === 'explore' ? '🗺️ Exploração Gradual' : '🔍 Visão Completa'}
          </div>
        </div>        <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/50">
          <svg width="100%" height="450" viewBox="0 0 800 450" className="overflow-visible w-full">
            {renderTree(dungeon)}
          </svg>
        </div><div className="flex flex-wrap gap-3 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">Posição atual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-300">Tesouro</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>
            <span className="text-gray-300">Clique para mover ✨</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-gray-300">Visitado</span>
          </div>
        </div>
      </div>
    )
  }
  const renderGamePanel = () => {
    if (!currentRoom) return null

    const clue = getClueForRoom(currentRoom)
    const canGoLeft = currentRoom.left !== undefined
    const canGoRight = currentRoom.right !== undefined

    return (
      <div className="bg-slate-800/50 rounded-lg p-2 backdrop-blur-sm border border-slate-600/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-md font-bold text-white flex items-center gap-1">
            🏰 Sala {currentRoom.value}
          </h3>
          <div className="flex gap-1 text-xs">
            <span className="bg-purple-600/30 px-2 py-1 rounded text-purple-200">
              🎯 {targetTreasure}
            </span>
            <span className="bg-blue-600/30 px-2 py-1 rounded text-blue-200">
              👣 {steps}
            </span>
            {gameMode === 'explore' && (
              <span className="bg-red-600/30 px-2 py-1 rounded text-red-200">
                ⏱️ {maxSteps - steps}
              </span>
            )}
          </div>
        </div>

        <div className="bg-amber-900/30 rounded p-2 mb-2 border border-amber-600/30">
          <div className="text-amber-100 text-xs">{clue}</div>
        </div>

        <div className="flex gap-2">
          <button
            className={`flex-1 py-1 px-2 rounded text-xs font-semibold transition-all duration-200 ${
              canGoLeft 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow hover:scale-105' 
                : 'bg-red-600/30 text-red-300 cursor-not-allowed'
            }`}
            onClick={() => currentRoom.left && moveToRoom(currentRoom.left)}
            disabled={!canGoLeft || gameStatus !== 'playing'}
          >
            {canGoLeft ? `⬅️ ${currentRoom.left?.value}` : '🚫 Bloqueado'}
          </button>

          <button
            className={`flex-1 py-1 px-2 rounded text-xs font-semibold transition-all duration-200 ${
              canGoRight 
                ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow hover:scale-105' 
                : 'bg-red-600/30 text-red-300 cursor-not-allowed'
            }`}
            onClick={() => currentRoom.right && moveToRoom(currentRoom.right)}
            disabled={!canGoRight || gameStatus !== 'playing'}
          >
            {canGoRight ? `➡️ ${currentRoom.right?.value}` : '🚫 Bloqueado'}
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="w-full bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 rounded-xl p-4 shadow-2xl border border-purple-700/50">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
        <h2 className="text-xl font-bold text-white mb-2 lg:mb-0 flex items-center gap-2">
          🏰 Explorador de Masmorras Binárias
        </h2>
        <div className="flex gap-2">
          <button 
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              gameMode === 'explore' 
                ? 'bg-purple-600 text-white shadow-lg scale-105' 
                : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50'
            }`}
            onClick={() => setGameMode('explore')}
          >
            🗺️ Exploração
          </button>
          <button 
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              gameMode === 'search' 
                ? 'bg-purple-600 text-white shadow-lg scale-105' 
                : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50'
            }`}
            onClick={() => setGameMode('search')}
          >
            🔍 Busca Dirigida
          </button>
          <button 
            onClick={initializeGame} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
          >
            🎮 Novo Jogo
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameStatus === 'won' && (
          <motion.div 
            className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 mb-4 text-white shadow-xl border border-green-500/30"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              🎉 Tesouro Encontrado!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-700/30 rounded-lg p-3 text-center">
                <div className="text-3xl font-bold">{targetTreasure}</div>
                <div className="text-sm">Tesouro</div>
              </div>
              <div className="bg-green-700/30 rounded-lg p-3 text-center">
                <div className="text-3xl font-bold">{steps}</div>
                <div className="text-sm">Passos</div>
              </div>
              <div className="bg-green-700/30 rounded-lg p-3 text-center">
                <div className="text-3xl font-bold">{discoveredRooms.size}</div>
                <div className="text-sm">Salas</div>
              </div>
            </div>
            <p className="text-lg mb-3">
              🏃‍♂️ Eficiência: {steps <= 5 ? 'Excelente!' : steps <= 8 ? 'Boa!' : 'Pode melhorar!'}
            </p>
          </motion.div>
        )}

        {gameStatus === 'lost' && (
          <motion.div 
            className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-4 mb-4 text-white shadow-xl border border-red-500/30"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              💀 Limite de Passos Atingido!
            </h2>
            <p className="text-lg mb-3">Você excedeu o limite de {maxSteps} passos no modo {gameMode === 'explore' ? 'Exploração' : 'Busca Dirigida'}!</p>
            <div className="bg-red-700/30 rounded-lg p-3 mb-3">
              <h4 className="text-lg font-bold mb-2">💡 Dica de Árvore Binária:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>⬅️ Esquerda = Valores <strong>menores</strong></div>
                <div>➡️ Direita = Valores <strong>maiores</strong></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>      {/* Layout Principal - Vertical com mapa ocupando todo espaço */}
      <div className="space-y-4 mb-4">
        {/* Controles de jogo em cima */}
        {gameStatus === 'playing' && (
          <div>
            {renderGamePanel()}
          </div>
        )}
        
        {/* Mapa ocupando todo espaço vertical disponível */}
        <div className="flex-1">
          {renderDungeonMap()}
        </div>
      </div>      {/* Caminho percorrido - mais compacto */}
      <div className="bg-slate-800/50 rounded-lg p-2 mb-3 backdrop-blur-sm border border-slate-600/50">
        <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1">
          🗺️ Caminho:
        </h4>
        <div className="flex flex-wrap gap-1">
          {path.map((roomId, index) => {
            const roomValue = roomId.replace('room-', '')
            return (
              <span key={index} className="inline-flex items-center">
                <span className="px-1 py-1 bg-purple-600 text-white rounded text-xs font-medium">
                  {roomValue}
                </span>
                {index < path.length - 1 && (
                  <span className="mx-1 text-purple-300 text-xs">→</span>
                )}
              </span>
            )
          })}
        </div>
      </div>      {/* Instruções mais compactas */}
      <div className="bg-slate-800/50 rounded-lg p-2 backdrop-blur-sm border border-slate-600/50">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-lg">🧭</span>
            <div>
              <strong className="text-white block text-xs">Use as Pistas</strong>
              <p className="text-slate-300 text-xs">Compare valores</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg">✨</span>
            <div>
              <strong className="text-white block text-xs">Clique no Mapa</strong>
              <p className="text-slate-300 text-xs">Mova-se clicando</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg">🌳</span>
            <div>
              <strong className="text-white block text-xs">Árvore Binária</strong>
              <p className="text-slate-300 text-xs">← Menor | Maior →</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg">⚡</span>
            <div>
              <strong className="text-white block text-xs">Seja Eficiente</strong>
              <p className="text-slate-300 text-xs">Menos passos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
