import  { useState } from 'react';
import { motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Props {
  section: string
}

interface ShowCodeState {
  insert: boolean;
  search: boolean;
  traversal: boolean;
  delete: boolean;
  height: boolean;
  balance: boolean;
  allC: boolean;
  memoryLeak: boolean;
  nullPointer: boolean;
  incorrectRecursion: boolean;
  bstViolation: boolean;
}

export const LectureSlides = ({ section }: Props) => {
  const [showCode, setShowCode] = useState<ShowCodeState>({
    insert: false,
    search: false,
    traversal: false,
    delete: false,
    height: false,
    balance: false,
    allC: false,
    memoryLeak: false,
    nullPointer: false,
    incorrectRecursion: false,
    bstViolation: false,
  })
  const [hoveredTerm, setHoveredTerm] = useState<string | null>(null); // State for hovered term

  const toggleCode = (operation: keyof ShowCodeState) => {
    setShowCode(prev => ({
      ...prev,
      [operation]: !prev[operation]
    }));
  }

  const implementationCodes = {
    insert: `// Função para criar um novo nó
Node* createNode(int value) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    newNode->data = value;
    newNode->left = newNode->right = NULL;
    return newNode;
}

// Inserção
Node* insert(Node* root, int value) {
    if (root == NULL) return createNode(value);
    if (value < root->data)
        root->left = insert(root->left, value);
    else if (value > root->data)
        root->right = insert(root->right, value);
    return root;
}`,
    search: `// Busca em Árvore Binária de Busca
Node* search(Node* root, int value) {
    // Caso base: nó não encontrado ou árvore vazia
    if (root == NULL || root->data == value) {
        return root;
    }
    
    // Buscar na subárvore apropriada
    if (value < root->data) {
        return search(root->left, value);
    } else {
        return search(root->right, value);
    }
}`,
    traversal: `// Percursos em Árvore Binária
void inorder(Node* root) {
    if (root != NULL) {
        inorder(root->left);      // Esquerda
        printf("%d ", root->data); // Raiz
        inorder(root->right);     // Direita
    }
}

void preorder(Node* root) {
    if (root != NULL) {
        printf("%d ", root->data); // Raiz
        preorder(root->left);      // Esquerda
        preorder(root->right);     // Direita
    }
}

void postorder(Node* root) {
    if (root != NULL) {
        postorder(root->left);     // Esquerda
        postorder(root->right);    // Direita
        printf("%d ", root->data); // Raiz
    }
}`,
    delete: `// Remoção em Árvore Binária de Busca
Node* delete(Node* root, int value) {
    if (root == NULL) return root;
    
    if (value < root->data) {
        root->left = delete(root->left, value);
    } else if (value > root->data) {
        root->right = delete(root->right, value);
    } else {
        // Nó a ser removido encontrado
        
        // Caso 1: Nó folha (sem filhos)
        if (root->left == NULL && root->right == NULL) {
            free(root);
            return NULL;
        }
        
        // Caso 2: Nó com um filho
        if (root->left == NULL) {
            Node* temp = root->right;
            free(root);
            return temp;
        } else if (root->right == NULL) {
            Node* temp = root->left;
            free(root);
            return temp;
        }
        
        // Caso 3: Nó com dois filhos
        Node* successor = findMin(root->right);
        root->data = successor->data;
        root->right = delete(root->right, successor->data);
    }
    
    return root;
}`,
    height: `// Cálculo da Altura da Árvore
int height(Node* root) {
    // Caso base: árvore vazia
    if (root == NULL) {
        return -1; // ou 0, dependendo da convenção
    }
    
    // Calcular altura das subárvores
    int leftHeight = height(root->left);
    int rightHeight = height(root->right);
    
    // Retornar a maior altura + 1
    return 1 + (leftHeight > rightHeight ? leftHeight : rightHeight);
}`,
    balance: `// Verificação de Balanceamento
bool isBalanced(Node* root) {
    if (root == NULL) return true;
    
    // Calcular alturas das subárvores
    int leftHeight = height(root->left);
    int rightHeight = height(root->right);
    
    // Verificar se é balanceada
    if (abs(leftHeight - rightHeight) <= 1 && 
        isBalanced(root->left) && 
        isBalanced(root->right)) {
        return true;
    }
    
    return false;
}`,
    memoryLeakIncorrect: `
// Incorreto: Nós alocados não são liberados
void createTree() {
    Node* root = createNode(10);
    root->left = createNode(5);
    root->right = createNode(15);
    // ... mais nós ...
    // A função termina, mas a memória não foi liberada
}`,
    memoryLeakCorrect: `
// Correto: Função para liberar a árvore (pós-ordem)
void freeTree(Node* root) {
    if (root == NULL) return;
    freeTree(root->left);
    freeTree(root->right);
    free(root);
}

void usageExample() {
    Node* root = createNode(10);
    root->left = createNode(5);
    // ...
    freeTree(root); // Libera a memória ao final
}`,
    nullPointerIncorrect: `
// Incorreto: Acessar root->left->data sem verificar se root->left é NULL
void printLeftChildData(Node* root) {
    if (root != NULL) {
        // Erro se root->left for NULL
        printf("Left child data: %d\\n", root->left->data);
    }
}`,
    nullPointerCorrect: `
// Correto: Verificar se o ponteiro é NULL antes de desreferenciar
void printLeftChildDataSafe(Node* root) {
    if (root != NULL && root->left != NULL) {
        printf("Left child data: %d\\n", root->left->data);
    } else {
        printf("Left child does not exist or root is NULL.\\n");
    }
}`,
    incorrectRecursionIncorrect: `
// Incorreto: Caso base ausente ou incorreto para altura
int calculateHeightIncorrect(Node* root) {
    // Sem caso base para root == NULL, levará a erro de segmentação
    int leftHeight = calculateHeightIncorrect(root->left);
    int rightHeight = calculateHeightIncorrect(root->right);
    return 1 + (leftHeight > rightHeight ? leftHeight : rightHeight);
}`,
    incorrectRecursionCorrect: `
// Correto: Caso base definido para recursão da altura
int calculateHeightCorrect(Node* root) {
    if (root == NULL) {
        return -1; // Ou 0, dependendo da convenção (altura de árvore vazia)
    }
    int leftHeight = calculateHeightCorrect(root->left);
    int rightHeight = calculateHeightCorrect(root->right);
    return 1 + (leftHeight > rightHeight ? leftHeight : rightHeight);
}`,
    bstViolationIncorrect: `
// Incorreto: Inserção que pode violar a propriedade BST
Node* insertIncorrect(Node* root, int value) {
    if (root == NULL) return createNode(value);
    // Exemplo: sempre insere à esquerda, quebrando a BST
    if (root->left == NULL) {
        root->left = createNode(value);
    } else {
        root->left = insertIncorrect(root->left, value);
    }
    return root;
}`,
    bstViolationCorrect: `
// Correto: Inserção que mantém a propriedade BST
Node* insertCorrect(Node* root, int value) {
    if (root == NULL) return createNode(value);
    if (value < root->data) {
        root->left = insertCorrect(root->left, value);
    } else if (value > root->data) {
        root->right = insertCorrect(root->right, value);
    }
    // Se value == root->data, pode ignorar, atualizar ou permitir duplicados
    // dependendo da política da BST. Aqui, ignoramos.
    return root;
}
`, // Make sure there's a comma here if it was missing
  };

  const syntaxHighlighterStyle = {
    margin: 0,
    padding: '1rem',
    background: 'transparent',
    fontSize: '12px',
    lineHeight: '1.5'
  };

  const slideVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  }


  // Mapeamento de termos para nós destacados e explicações
  const termNodeMapping: Record<string, string[]> = {
    'Raiz': ['n10'],
    'Folha': ['n3', 'n7', 'n20'],
    'Altura': ['n10', 'n15', 'n20'], // Exemplo de caminho para altura
    'Nível': ['n5', 'n15'], // Exemplo de nós no nível 1
    'Nó Interno': ['n10', 'n5', 'n15'],
    'Subárvore': ['n5', 'n3', 'n7'], // Exemplo de subárvore com raiz em 5
    'Grau de um Nó': ['n10'], // Exemplo para o nó 10
    'Caminho': ['n10', 'n5', 'n7'], // Exemplo de caminho
    'Ancestral/Descendente': ['n10', 'n7'], // n10 ancestral, n7 descendente
  };

  const explanationMap: Record<string, string> = {
    'Raiz': "A raiz (10) é o nó no topo da árvore, sem pai.",
    'Folha': "As folhas (3, 7, 20) são nós que não possuem filhos.",
    'Altura': "Altura da árvore (2): o maior caminho da raiz (10) até uma folha (20).",
    'Nível': "Nível 1: Nós (5, 15) estão a uma distância de 1 da raiz.",
    'Nó Interno': "Nós internos (10, 5, 15) possuem pelo menos um filho.",
    'Subárvore': "Subárvore com raiz em 5: inclui o nó 5 e todos os seus descendentes (3, 7).",
    'Grau de um Nó': "Grau do nó 10 é 2, pois ele tem dois filhos (5, 15).",
    'Caminho': "Caminho de 10 para 7: sequência de nós 10 -> 5 -> 7.",
    'Ancestral/Descendente': "O nó 10 é ancestral do nó 7, e o nó 7 é descendente do nó 10.",
  };

  const treeNodes = [
    { id: 'n10', value: 10, style: { top: '5%', left: '50%' }, cx: 160, cy: 27.6 }, // Assuming max-w-xs (320px) and h-48 (192px) for container
    { id: 'n5', value: 5, style: { top: '25%', left: '30%' }, cx: 96, cy: 66 },
    { id: 'n15', value: 15, style: { top: '25%', left: '70%' }, cx: 224, cy: 66 },
    { id: 'n3', value: 3, style: { top: '45%', left: '20%' }, cx: 64, cy: 104.4 },
    { id: 'n7', value: 7, style: { top: '45%', left: '40%' }, cx: 128, cy: 104.4 },
    { id: 'n20', value: 20, style: { top: '45%', left: '80%' }, cx: 256, cy: 104.4 },
  ];

  const edges = [
    { from: 'n10', to: 'n5' },
    { from: 'n10', to: 'n15' },
    { from: 'n5', to: 'n3' },
    { from: 'n5', to: 'n7' },
    { from: 'n15', to: 'n20' },
  ];

  const getNodeById = (id: string) => treeNodes.find(node => node.id === id);

  const getHighlightStyle = (nodeId: string) => {
    if (hoveredTerm && termNodeMapping[hoveredTerm]?.includes(nodeId)) {
      return {
        background: 'rgba(16, 185, 129, 0.8)', // Tailwind green-500 with opacity
        border: '2px solid rgb(16, 185, 129)',
        color: 'white',
        transform: 'scale(1.1)', // Only scale here
        zIndex: '10',
      };
    }
    return {
      background: 'rgba(51, 65, 85, 0.7)', // Tailwind slate-700 with opacity
      border: '1px solid rgb(71, 85, 105)', // Tailwind slate-600
      color: 'white',
      // No transform here by default, base transform is applied separately
    };
  };
  
  const renderCurrentSlide = () => {
    switch (section) {
      case 'intro':
        return (
          <div className="p-8 text-center min-h-screen flex flex-col justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
            <motion.h1
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.8 }}
              className="text-6xl font-bold text-white mb-4"
            >
              🌳 Árvores Binárias em C
            </motion.h1>
            <motion.h2
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl text-gray-200 mb-8"
            >
              Estruturas de Dados para Desenvolvimento Multiplataforma
            </motion.h2>
            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Uma abordagem prática e envolvente para o aprendizado de árvores binárias,
                combinando conceitos fundamentais com aplicações do mundo real.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-600/20 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-blue-400/30 hover:bg-blue-600/30 transition-all duration-300 hover:scale-105">
                  <span className="text-white font-semibold">🎯 Conceitos Fundamentais</span>
                </div>
                <div className="bg-green-600/20 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-green-400/30 hover:bg-green-600/30 transition-all duration-300 hover:scale-105">
                  <span className="text-white font-semibold">💻 Implementação em C</span>
                </div>
                <div className="bg-purple-600/20 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-purple-400/30 hover:bg-purple-600/30 transition-all duration-300 hover:scale-105">
                  <span className="text-white font-semibold">🎮 Aprendizado Interativo</span>
                </div>
                <div className="bg-orange-600/20 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-orange-400/30 hover:bg-orange-600/30 transition-all duration-300 hover:scale-105">
                  <span className="text-white font-semibold">🏰 Masmorra Binária</span>
                </div>
              </div>
            </motion.div>
          </div>
        );

      case 'concepts':
        return (
          <div className="p-8 min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
            <motion.h2
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl font-bold text-white mb-8 text-center"
            >
              📖 Conceitos Fundamentais
            </motion.h2>
            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-full mx-auto"
            >
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-green-400/40 hover:bg-slate-700/80 transition-all duration-300 hover:scale-105 h-full min-h-[220px] lg:min-h-[440px] lg:min-w-[340px] flex flex-col justify-center items-center text-center">
                <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-green-300 mb-4">🌳 Definição</h3>
                <p className="text-gray-100 leading-relaxed text-base lg:text-lg xl:text-xl">
                  Estrutura hierárquica onde cada nó pode ter no máximo dois filhos: esquerdo e direita.
                </p>
              </div>
              {/* Terminologia Card - MODIFIED */}
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-green-400/40 hover:bg-slate-700/80 transition-all duration-300 h-full min-h-[220px] lg:min-h-[440px] lg:min-w-[340px] flex flex-col text-center">
                <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-green-300 mb-4">🔑 Terminologia</h3>
                {/* ... list of terms ... */}
                <ul className="text-gray-100 space-y-1 leading-relaxed text-left text-sm lg:text-base xl:text-lg mb-auto">
                  {Object.keys(termNodeMapping).map(term => (
                    <li 
                      key={term}
                      onMouseEnter={() => setHoveredTerm(term)}
                      onMouseLeave={() => setHoveredTerm(null)}
                      className="p-1 rounded hover:bg-green-500/20 cursor-pointer transition-colors"
                    >
                      <strong className="text-green-200">{term}:</strong> {explanationMap[term].split(':')[0].replace(term, '').trim()}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-green-400/30">
                  <h4 className="text-md font-semibold text-green-100 mb-2">
                    {hoveredTerm ? `Visualizando: ${hoveredTerm}` : "Passe o mouse sobre um termo"}
                  </h4>
                  <div className="relative h-48 w-full max-w-xs mx-auto bg-slate-900/50 rounded p-2 border border-slate-700">
                    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                      {edges.map(edge => {
                        const fromNode = getNodeById(edge.from);
                        const toNode = getNodeById(edge.to);
                        if (!fromNode || !toNode) return null;
                        return (
                          <line
                            key={`${edge.from}-${edge.to}`}
                            x1={fromNode.cx}
                            y1={fromNode.cy}
                            x2={toNode.cx}
                            y2={toNode.cy}
                            stroke="rgb(71, 85, 105)" // Tailwind slate-600
                            strokeWidth="2"
                          />
                        );
                      })}
                    </svg>
                    {treeNodes.map(node => {
                      const highlightStyle = getHighlightStyle(node.id);
                      return (
                        <div
                          key={node.id}
                          className="absolute flex items-center justify-center w-9 h-9 rounded-full text-xs font-semibold transition-all duration-200"
                          style={{
                            left: `${(node.cx / 320) * 100}%`,
                            top: `${(node.cy / 192) * 100}%`,
                            transform: `translate(-50%, -50%) ${highlightStyle.transform || ''}`.trim(), // Combine transforms
                            background: highlightStyle.background,
                            border: highlightStyle.border,
                            color: highlightStyle.color,
                            zIndex: highlightStyle.zIndex,
                            // Removed individual style assignments here, they are now part of highlightStyle or base
                          }}
                        >
                          {node.value}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-green-200/80 mt-2 h-10">
                    {hoveredTerm ? explanationMap[hoveredTerm] : "A árvore acima ilustra os conceitos."}
                  </p>
                </div>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-green-400/40 hover:bg-slate-700/80 transition-all duration-300 h-full min-h-[220px] lg:min-h-[440px] lg:min-w-[340px] flex flex-col justify-center items-center text-center">
                <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-green-300 mb-4">💾 Estrutura em C</h3>
                <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                  <SyntaxHighlighter
                    language="c"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      background: 'transparent',
                      fontSize: '15px',
                      lineHeight: '2'
                    }}
                  >
                    {`typedef struct node {
    int data;
    struct node *left;
    struct node *right;
} Node;`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </motion.div>
          </div>
        );

      case 'types':
        return (
          <div className="p-8 min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
            <motion.h2
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl font-bold text-white mb-8 text-center"
            >
              🔍 Tipos de Árvores Binárias
            </motion.h2>
            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h3 className="text-xl font-semibold text-purple-300 mb-4">🎯 Árvore Binária de Busca (BST)</h3>
                  <p className="text-gray-100 mb-4 leading-relaxed">Propriedade: valores menores à esquerda, maiores à direita</p>
                  <div className="bg-gray-900/80 p-4 rounded font-mono text-sm text-center text-cyan-300 border border-gray-600">
                    <div className="mb-2">15</div>
                    <div className="mb-2">/ \</div>
                    <div className="mb-2">10 20</div>
                    <div className="mb-2">/ \ / \</div>
                    <div>5 12 18 25</div>
                  </div>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-green-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h3 className="text-xl font-semibold text-green-300 mb-4">⚖️ Árvore Balanceada</h3>
                  <p className="text-gray-100 mb-4 leading-relaxed">Altura das subárvores difere por no máximo 1</p>
                  <div className="bg-green-900/60 p-3 rounded border border-green-500/30">
                    <span className="text-green-200 font-semibold">✅ Busca eficiente: O(log n)</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-blue-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h3 className="text-xl font-semibold text-blue-300 mb-4">📏 Árvore Completa</h3>
                  <p className="text-gray-100 mb-4 leading-relaxed">Todos os níveis preenchidos, exceto possivelmente o último</p>
                  <div className="bg-blue-900/60 p-3 rounded border border-blue-500/30">
                    <span className="text-blue-200">Folhas concentradas à esquerda</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-yellow-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h3 className="text-xl font-semibold text-yellow-300 mb-4">🏆 Árvore Cheia (Full)</h3>
                  <p className="text-gray-100 mb-4 leading-relaxed">Cada nó tem 0 ou 2 filhos (nunca apenas 1)</p>
                  <div className="bg-yellow-900/60 p-3 rounded border border-yellow-500/30">
                    <span className="text-yellow-200">Estrutura binária pura</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-indigo-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h3 className="text-xl font-semibold text-indigo-300 mb-4">💎 Árvore Perfeita</h3>
                  <p className="text-gray-100 mb-4 leading-relaxed">Árvore cheia E completa simultaneamente</p>
                  <div className="bg-indigo-900/60 p-3 rounded border border-indigo-500/30">
                    <span className="text-indigo-200">Todas as folhas no mesmo nível</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-red-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h3 className="text-xl font-semibold text-red-300 mb-4">📉 Árvore Degenerada</h3>
                  <p className="text-gray-100 mb-4 leading-relaxed">Cada nó tem apenas um filho (lista encadeada)</p>
                  <div className="bg-red-900/60 p-3 rounded border border-red-500/30">
                    <span className="text-red-200 font-semibold">❌ Pior caso: O(n)</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-400/40">
                <h4 className="text-2xl font-semibold text-white mb-4">⚡ Comparação de Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-900/60 p-4 rounded-lg border border-green-500/40">
                    <strong className="text-green-200">Balanceada</strong>
                    <div className="text-green-100">Busca: O(log n)</div>
                  </div>
                  <div className="bg-red-900/60 p-4 rounded-lg border border-red-500/40">
                    <strong className="text-red-200">Degenerada</strong>
                    <div className="text-red-100">Busca: O(n)</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );

      case 'operations':
        return (
          <div className="p-8 min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
            <motion.h2
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl font-bold text-white mb-8 text-center"
            >
              ⚙️ Operações Fundamentais
            </motion.h2>
            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-orange-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h3 className="text-xl font-semibold text-orange-300 mb-4">➕ Inserção</h3>
                  <p className="text-gray-100 mb-2"><strong className="text-orange-200">Complexidade:</strong> O(log n)</p>
                  <p className="text-gray-100 mb-4 leading-relaxed">Compara valor com nó atual e insere recursivamente na subárvore apropriada</p>
                  <div className="bg-orange-900/40 p-4 rounded-lg mb-4 border border-orange-500/30">
                    <strong className="text-orange-200">Algoritmo:</strong>
                    <div className="mt-2 space-y-1 text-sm text-gray-100">
                      <div>1. Se árvore vazia → criar novo nó</div>
                      <div>2. Se valor &lt; nó atual → ir à esquerda</div>
                      <div>3. Se valor &gt; nó atual → ir à direita</div>
                      <div>4. Repetir até encontrar posição</div>
                    </div>
                  </div>
                  <button
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded transition-colors"
                    onClick={() => toggleCode('insert')}
                  >
                    {showCode.insert ? '👁️ Ocultar Código' : '📋 Ver Implementação'}
                  </button>
                  {showCode.insert && (
                    <div className="mt-4">
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter
                          language="c"
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            background: 'transparent',
                            fontSize: '12px',
                            lineHeight: '1.5'
                          }}
                          showLineNumbers
                        >
                          {implementationCodes.insert}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-blue-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h3 className="text-xl font-semibold text-blue-300 mb-4">🔍 Busca</h3>
                  <p className="text-gray-100 mb-2"><strong className="text-blue-200">Complexidade:</strong> O(log n)</p>
                  <p className="text-gray-100 mb-4 leading-relaxed">Elimina metade dos nós a cada comparação</p>
                  <div className="bg-blue-900/40 p-4 rounded-lg mb-4 border border-blue-500/30">
                    <strong className="text-blue-200">Algoritmo:</strong>
                    <div className="mt-2 space-y-1 text-sm text-gray-100">
                      <div>1. Se valor = nó atual → encontrado</div>
                      <div>2. Se valor &lt; nó atual → buscar à esquerda</div>
                      <div>3. Se valor &gt; nó atual → buscar à direita</div>
                      <div>4. Se NULL → não encontrado</div>
                    </div>
                  </div>
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                    onClick={() => toggleCode('search')}
                  >
                    {showCode.search ? '👁️ Ocultar Código' : '📋 Ver Implementação'}
                  </button>
                  {showCode.search && (
                    <div className="mt-4">
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter
                          language="c"
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            background: 'transparent',
                            fontSize: '12px',
                            lineHeight: '1.5'
                          }}
                          showLineNumbers
                        >
                          {implementationCodes.search}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-green-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h3 className="text-xl font-semibold text-green-300 mb-4">🚶 Percursos</h3>
                  <p className="text-gray-100 mb-2"><strong className="text-green-200">Complexidade:</strong> O(n)</p>
                  <p className="text-gray-100 mb-4 leading-relaxed">Visita todos os nós seguindo diferentes ordens</p>
                  <div className="bg-green-900/40 p-4 rounded-lg mb-4 border border-green-500/30">
                    <strong className="text-green-200">Tipos:</strong>
                    <div className="mt-2 space-y-1 text-sm text-gray-100">
                      <div>• <strong>Pré-ordem:</strong> Raiz → Esquerda → Direita</div>
                      <div>• <strong>Em-ordem:</strong> Esquerda → Raiz → Direita</div>
                      <div>• <strong>Pós-ordem:</strong> Esquerda → Direita → Raiz</div>
                    </div>
                  </div>
                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
                    onClick={() => toggleCode('traversal')}
                  >
                    {showCode.traversal ? '👁️ Ocultar Código' : '📋 Ver Implementação'}
                  </button>
                  {showCode.traversal && (
                    <div className="mt-4">
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter
                          language="c"
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            background: 'transparent',
                            fontSize: '12px',
                            lineHeight: '1.5'
                          }}
                          showLineNumbers
                        >
                          {implementationCodes.traversal}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-red-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h3 className="text-xl font-semibold text-red-300 mb-4">🗑️ Remoção</h3>
                  <p className="text-gray-100 mb-2"><strong className="text-red-200">Complexidade:</strong> O(log n)</p>
                  <p className="text-gray-100 mb-4 leading-relaxed">Remove nó mantendo propriedade BST</p>
                  <div className="bg-red-900/40 p-4 rounded-lg mb-4 border border-red-500/30">
                    <strong className="text-red-200">Casos:</strong>
                    <div className="mt-2 space-y-1 text-sm text-gray-100">
                      <div>1. <strong>Folha:</strong> Remove diretamente</div>
                      <div>2. <strong>1 filho:</strong> Substitui pelo filho</div>
                      <div>3. <strong>2 filhos:</strong> Substitui pelo sucessor</div>
                    </div>
                  </div>
                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
                    onClick={() => toggleCode('delete')}
                  >
                    {showCode.delete ? '👁️ Ocultar Código' : '📋 Ver Implementação'}
                  </button>
                  {showCode.delete && (
                    <div className="mt-4">
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter
                          language="c"
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            background: 'transparent',
                            fontSize: '12px',
                            lineHeight: '1.5'
                          }}
                          showLineNumbers
                        >
                          {implementationCodes.delete}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h3 className="text-xl font-semibold text-purple-300 mb-4">📏 Altura</h3>
                  <p className="text-gray-100 mb-2"><strong className="text-purple-200">Complexidade:</strong> O(n)</p>
                  <p className="text-gray-100 mb-4 leading-relaxed">Calcula a maior distância da raiz às folhas</p>
                  <div className="bg-purple-900/40 p-4 rounded-lg mb-4 border border-purple-500/30">
                    <strong className="text-purple-200">Algoritmo:</strong>
                    <div className="mt-2 space-y-1 text-sm text-gray-100">
                      <div>1. Se nó é NULL → altura = -1</div>
                      <div>2. Altura = 1 + max(altura_esq, altura_dir)</div>
                      <div>3. Recursão em ambas subárvores</div>
                    </div>
                  </div>
                  <button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors"
                    onClick={() => toggleCode('height')}
                  >
                    {showCode.height ? '👁️ Ocultar Código' : '📋 Ver Implementação'}
                  </button>
                  {showCode.height && (
                    <div className="mt-4">
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter
                          language="c"
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            background: 'transparent',
                            fontSize: '12px',
                            lineHeight: '1.5'
                          }}
                          showLineNumbers
                        >
                          {implementationCodes.height}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-indigo-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h3 className="text-xl font-semibold text-indigo-300 mb-4">⚖️ Verificar Balanceamento</h3>
                  <p className="text-gray-100 mb-2"><strong className="text-indigo-200">Complexidade:</strong> O(n)</p>
                  <p className="text-gray-100 mb-4 leading-relaxed">Verifica se diferença de alturas ≤ 1</p>
                  <div className="bg-indigo-900/40 p-4 rounded-lg mb-4 border border-indigo-500/30">
                    <strong className="text-indigo-200">Algoritmo:</strong>
                    <div className="mt-2 space-y-1 text-sm text-gray-100">
                      <div>1. Calcular altura esquerda e direita</div>
                      <div>2. Se |alt_esq - alt_dir| ≤ 1 → balanceada</div>
                      <div>3. Verificar recursivamente subárvores</div>
                    </div>
                  </div>
                  <button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors"
                    onClick={() => toggleCode('balance')}
                  >
                    {showCode.balance ? '👁️ Ocultar Código' : '📋 Ver Implementação'}
                  </button>
                  {showCode.balance && (
                    <div className="mt-4">
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter
                          language="c"
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            background: 'transparent',
                            fontSize: '12px',
                            lineHeight: '1.5'
                          }}
                          showLineNumbers
                        >
                          {implementationCodes.balance}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Bloco colapsável centralizado para todas as implementações em C */}
              <div className="flex justify-center mt-12">
                <div className="w-full max-w-5xl">
                  <div className="mb-4 flex flex-col items-center">
                    <button
                      className={`flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-semibold shadow-lg transition-all duration-200 text-lg mb-2 focus:outline-none focus:ring-2 focus:ring-teal-400`}
                      aria-expanded={showCode.allC || false}
                      onClick={() => toggleCode('allC')}
                    >
                      <span className={`transition-transform duration-200 ${showCode.allC ? 'rotate-90' : ''}`}>▶</span>
                      <span>Implementações Fundamentais em C</span>
                      <span className="ml-2 text-xs text-slate-300">(C)</span>
                    </button>
                  </div>
                  {showCode.allC && (
                    <div className="bg-slate-900/95 border border-slate-600 rounded-2xl p-8 shadow-xl mt-2 animate-fade-in">
                      <h5 className="text-center text-2xl font-bold text-teal-300 mb-6">Exemplo de Árvore Binária em C</h5>
                      <SyntaxHighlighter language="c" style={vscDarkPlus} customStyle={{ margin: 0, padding: '1rem', background: 'transparent', fontSize: '14px', lineHeight: '1.5' }} showLineNumbers>{`
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

// Definição do nó da árvore
typedef struct node {
    int data;
    struct node *left;
    struct node *right;
} Node;

// Função para criar um novo nó
Node* createNode(int value) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    newNode->data = value;
    newNode->left = newNode->right = NULL;
    return newNode;
}

// Inserção
Node* insert(Node* root, int value) {
    if (root == NULL) return createNode(value);
    if (value < root->data)
        root->left = insert(root->left, value);
    else if (value > root->data)
        root->right = insert(root->right, value);
    return root;
}

// Busca
Node* search(Node* root, int value) {
    if (root == NULL || root->data == value) return root;
    if (value < root->data)
        return search(root->left, value);
    else
        return search(root->right, value);
}

// Remoção
Node* findMin(Node* node) {
    while (node && node->left != NULL)
        node = node->left;
    return node;
}
Node* delete(Node* root, int value) {
    if (root == NULL) return root;
    if (value < root->data)
        root->left = delete(root->left, value);
    else if (value > root->data)
        root->right = delete(root->right, value);
    else {
        if (root->left == NULL) {
            Node* temp = root->right;
            free(root);
            return temp;
        } else if (root->right == NULL) {
            Node* temp = root->left;
            free(root);
            return temp;
        }
        Node* temp = findMin(root->right);
        root->data = temp->data;
        root->right = delete(root->right, temp->data);
    }
    return root;
}

// Percursos
void inorder(Node* root) {
    if (root) {
        inorder(root->left);
        printf("%d ", root->data);
        inorder(root->right);
    }
}
void preorder(Node* root) {
    if (root) {
        printf("%d ", root->data);
        preorder(root->left);
        preorder(root->right);
    }
}
void postorder(Node* root) {
    if (root) {
        postorder(root->left);
        postorder(root->right);
        printf("%d ", root->data);
    }
}

// Altura
int height(Node* root) {
    if (root == NULL) return -1;
    int left = height(root->left);
    int right = height(root->right);
    return 1 + (left > right ? left : right);
}

// Balanceamento
bool isBalanced(Node* root) {
    if (root == NULL) return true;
    int lh = height(root->left);
    int rh = height(root->right);
    return abs(lh - rh) <= 1 && isBalanced(root->left) && isBalanced(root->right);
}

// Função principal
int main() {
    Node* root = NULL;
    int valores[] = {8, 3, 10, 1, 6, 14, 4, 7, 13};
    int n = sizeof(valores) / sizeof(valores[0]);
    for (int i = 0; i < n; i++) {
        root = insert(root, valores[i]);
    }

    printf("Percurso em ordem: ");
    inorder(root);
    printf("\\n");
    printf("Percurso pre-ordem: ");
    preorder(root);
    printf("\\n");
    printf("Percurso pos-ordem: ");
    postorder(root);
    printf("\\n");

    int busca = 6;
    printf("Busca por %d: %s\\n", busca, search(root, busca) ? "Encontrado" : "Nao encontrado");

    printf("Altura da arvore: %d\\n", height(root));
    printf("Arvore balanceada? %s\\n", isBalanced(root) ? "Sim" : "Nao");

    root = delete(root, 6);
    printf("\\nApos remover 6, percurso em ordem: ");
    inorder(root);
    printf("\\n");
    return 0;
}
`}</SyntaxHighlighter>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        );

      case 'applications':
        return (
          <div className="p-8 min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
            <motion.h2
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl font-bold text-white mb-8 text-center"
            >
              🌍 Aplicações Exclusivas de Árvores Binárias
            </motion.h2>
            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-full mx-auto h-full min-h-[60vh] lg:min-h-[70vh]"
            >
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-orange-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105 h-full min-h-[220px] lg:min-h-[440px] lg:min-w-[340px] flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-orange-300 mb-4">🧮 Representação de Expressões Aritméticas</h3>
                <p className="text-gray-100 leading-relaxed">Árvores binárias são usadas para representar expressões matemáticas, onde cada nó interno é um operador e cada folha é um operando. Permite avaliar e manipular expressões de forma eficiente.</p>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105 h-full min-h-[220px] lg:min-h-[440px] lg:min-w-[340px] flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-purple-300 mb-4">🗜️ Codificação de Huffman (Compressão de Dados)</h3>
                <p className="text-gray-100 leading-relaxed">O algoritmo de Huffman utiliza árvores binárias para criar códigos de compressão ótimos, reduzindo o tamanho de arquivos ao atribuir códigos menores para símbolos mais frequentes.</p>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-blue-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105 h-full min-h-[220px] lg:min-h-[440px] lg:min-w-[340px] flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-blue-300 mb-4">🤖 Árvores de Decisão (Machine Learning)</h3>
                <p className="text-gray-100 leading-relaxed">Modelos de decisão, como Decision Trees, usam árvores binárias para classificar dados, tomar decisões e construir algoritmos como Random Forest.</p>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-teal-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105 h-full min-h-[220px] lg:min-h-[440px] lg:min-w-[340px] flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-teal-300 mb-4">🌳 Busca Binária em Estruturas Ordenadas</h3>
                <p className="text-gray-100 leading-relaxed">Árvores binárias de busca (BST) permitem buscas, inserções e remoções eficientes em dados ordenados, sendo fundamentais em algoritmos e estruturas de dados.</p>
              </div>
            </motion.div>
          </div>
        );

      case 'dungeon':
        return (
          <div className="p-8 min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
            <motion.h2
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl font-bold text-white mb-8 text-center"
            >
              🏰 O Explorador de Masmorras Binárias
            </motion.h2>
            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-400/40">
                <h3 className="text-2xl font-semibold text-amber-300 mb-4">🗺️ A Aventura</h3>
                <p className="text-gray-100 leading-relaxed">
                  Imagine uma masmorra misteriosa onde cada sala segue regras específicas.
                  Cada sala pode ter no máximo duas saídas: esquerda e direita.
                  O arquiteto genial organizou as salas de forma que você nunca se perde!
                </p>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-orange-400/40">
                <h3 className="text-2xl font-semibold text-orange-300 mb-4">🧭 A Regra Mágica</h3>
                <p className="text-gray-100 leading-relaxed">
                  Se você procura o tesouro 45 e está na sala 30, vá para a direita.
                  Se procura o tesouro 15, vá para a esquerda.
                  Esta organização permite encontrar qualquer tesouro rapidamente!
                </p>
              </div>
              <div className="bg-gradient-to-r from-yellow-900/60 to-amber-900/60 rounded-lg p-6 shadow-lg border border-yellow-400/40">
                <h3 className="text-2xl font-semibold text-yellow-200 mb-4">✨ A Revelação</h3>
                <p className="text-gray-100 leading-relaxed">
                  Esta masmorra aparentemente mágica segue os princípios de uma
                  <strong className="text-yellow-200"> árvore binária de busca</strong>!
                </p>
              </div>
            </motion.div>
          </div>
        );

      case 'errors':
        return (
          <div className="p-8 min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
            <motion.h2
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl font-bold text-white mb-8 text-center"
            >
              ⚠️ Erros Comuns e Como Evitá-los
            </motion.h2>
            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
            >
              {/* Vazamento de Memória */}
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-red-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-red-300 mb-4">💾 Vazamento de Memória</h3>
                <p className="text-gray-100 mb-2 leading-relaxed">Não liberar nós alocados dinamicamente (usando `malloc`) quando não são mais necessários.</p>
                <p className="text-gray-100 mb-4 leading-relaxed"><strong className="text-red-200">Consequência:</strong> Consumo excessivo de memória, podendo levar a falhas no programa.</p>
                <button
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors mb-3"
                  onClick={() => toggleCode('memoryLeak')}
                >
                  {showCode.memoryLeak ? '👁️ Ocultar Implementações' : '📋 Ver Implementações'}
                </button>
                {showCode.memoryLeak && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-md font-semibold text-red-200 mb-2">❌ Incorreto:</h4>
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter language="c" style={vscDarkPlus} customStyle={syntaxHighlighterStyle} showLineNumbers>
                          {implementationCodes.memoryLeakIncorrect}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-green-300 mb-2">✅ Correto:</h4>
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter language="c" style={vscDarkPlus} customStyle={syntaxHighlighterStyle} showLineNumbers>
                          {implementationCodes.memoryLeakCorrect}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Ponteiros Nulos */}
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-orange-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-orange-300 mb-4">🚫 Acesso a Ponteiros Nulos</h3>
                <p className="text-gray-100 mb-2 leading-relaxed">Tentar acessar membros de um ponteiro que é `NULL` (por exemplo, `node-&gt;data` quando `node` é `NULL`).</p>
                <p className="text-gray-100 mb-4 leading-relaxed"><strong className="text-orange-200">Consequência:</strong> Erro de segmentação (segmentation fault) e crash do programa.</p>
                <button
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded transition-colors mb-3"
                  onClick={() => toggleCode('nullPointer')}
                >
                  {showCode.nullPointer ? '👁️ Ocultar Implementações' : '📋 Ver Implementações'}
                </button>
                {showCode.nullPointer && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-md font-semibold text-red-200 mb-2">❌ Incorreto:</h4>
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter language="c" style={vscDarkPlus} customStyle={syntaxHighlighterStyle} showLineNumbers>
                          {implementationCodes.nullPointerIncorrect}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-green-300 mb-2">✅ Correto:</h4>
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter language="c" style={vscDarkPlus} customStyle={syntaxHighlighterStyle} showLineNumbers>
                          {implementationCodes.nullPointerCorrect}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Recursão Incorreta */}
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-blue-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-blue-300 mb-4">🔄 Recursão Mal Definida</h3>
                <p className="text-gray-100 mb-2 leading-relaxed">Caso base da recursão ausente, incorreto ou inalcançável.</p>
                <p className="text-gray-100 mb-4 leading-relaxed"><strong className="text-blue-200">Consequência:</strong> Estouro de pilha (stack overflow) ou comportamento incorreto do algoritmo.</p>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors mb-3"
                  onClick={() => toggleCode('incorrectRecursion')}
                >
                  {showCode.incorrectRecursion ? '👁️ Ocultar Implementações' : '📋 Ver Implementações'}
                </button>
                {showCode.incorrectRecursion && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-md font-semibold text-red-200 mb-2">❌ Incorreto:</h4>
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter language="c" style={vscDarkPlus} customStyle={syntaxHighlighterStyle} showLineNumbers>
                          {implementationCodes.incorrectRecursionIncorrect}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-green-300 mb-2">✅ Correto:</h4>
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter language="c" style={vscDarkPlus} customStyle={syntaxHighlighterStyle} showLineNumbers>
                          {implementationCodes.incorrectRecursionCorrect}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Violação de Propriedade BST */}
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-purple-300 mb-4">📏 Violação da Propriedade BST</h3>
                <p className="text-gray-100 mb-2 leading-relaxed">Inserir ou remover nós de forma que a propriedade da Árvore Binária de Busca (valores menores à esquerda, maiores à direita) seja quebrada.</p>
                <p className="text-gray-100 mb-4 leading-relaxed"><strong className="text-purple-200">Consequência:</strong> Perda da eficiência nas operações (busca pode se tornar O(n)) e resultados incorretos.</p>
                <button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors mb-3"
                  onClick={() => toggleCode('bstViolation')}
                >
                  {showCode.bstViolation ? '👁️ Ocultar Implementações' : '📋 Ver Implementações'}
                </button>
                {showCode.bstViolation && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-md font-semibold text-red-200 mb-2">❌ Incorreto:</h4>
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter language="c" style={vscDarkPlus} customStyle={syntaxHighlighterStyle} showLineNumbers>
                          {implementationCodes.bstViolationIncorrect}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-green-300 mb-2">✅ Correto:</h4>
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter language="c" style={vscDarkPlus} customStyle={syntaxHighlighterStyle} showLineNumbers>
                          {implementationCodes.bstViolationCorrect}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        );

      case 'prerequisites':
        return (
          <div className="p-8 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
            <motion.h2
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl font-bold text-white mb-8 text-center"
            >
              🔑 Conhecimentos Essenciais
            </motion.h2>
            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto space-y-4"
            >              <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-600 hover:shadow-xl hover:border-slate-500 transition-all flex items-center">
                <span className="text-4xl mr-4">📍</span>
                <div>
                  <strong className="text-indigo-400 text-lg">Ponteiros em C</strong>
                  <p className="text-gray-300">Fundamentais para navegação na árvore</p>
                </div>
              </div>              <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-600 hover:shadow-xl hover:border-slate-500 transition-all flex items-center">
                <span className="text-4xl mr-4">🧠</span>
                <div>
                  <strong className="text-blue-400 text-lg">Alocação Dinâmica</strong>
                  <p className="text-gray-300">malloc/free para gerenciar nós</p>
                </div>
              </div>              <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-600 hover:shadow-xl hover:border-slate-500 transition-all flex items-center">
                <span className="text-4xl mr-4">🏗️</span>
                <div>
                  <strong className="text-green-400 text-lg">Estruturas (struct)</strong>
                  <p className="text-gray-300">Representação dos nós</p>
                </div>
              </div>              <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-600 hover:shadow-xl hover:border-slate-500 transition-all flex items-center">
                <span className="text-4xl mr-4">🔄</span>
                <div>
                  <strong className="text-purple-400 text-lg">Recursão</strong>
                  <p className="text-gray-300">Crucial para operações em árvores</p>
                </div>
              </div>              <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-600 hover:shadow-xl hover:border-slate-500 transition-all flex items-center">
                <span className="text-4xl mr-4">📊</span>
                <div>
                  <strong className="text-orange-400 text-lg">Big O Notation</strong>
                  <p className="text-gray-300">Para análise de complexidade</p>
                </div>
              </div>
            </motion.div>
          </div>
        )

      case 'complexity':
        return (
          <div className="p-8 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
            <motion.h2
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl font-bold text-white mb-8 text-center"
            >
              📊 Análise de Complexidade
            </motion.h2>
            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="max-w-6xl mx-auto"
            >              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-600">
                  <h3 className="text-2xl font-semibold text-green-400 mb-6">🌳 Árvore Balanceada</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-700 p-3 rounded">
                      <span className="font-medium text-gray-300">Busca:</span>
                      <span className="font-mono text-green-400 font-bold">O(log n)</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-700 p-3 rounded">
                      <span className="font-medium text-gray-300">Inserção:</span>
                      <span className="font-mono text-green-400 font-bold">O(log n)</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-700 p-3 rounded">
                      <span className="font-medium text-gray-300">Remoção:</span>
                      <span className="font-mono text-green-400 font-bold">O(log n)</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-700 p-3 rounded">
                      <span className="font-medium text-gray-300">Percurso:</span>
                      <span className="font-mono text-green-400 font-bold">O(n)</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-600">
                  <h3 className="text-2xl font-semibold text-red-400 mb-6">📏 Árvore Desbalanceada</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-700 p-3 rounded">
                      <span className="font-medium text-gray-300">Busca:</span>
                      <span className="font-mono text-red-400 font-bold">O(n)</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-700 p-3 rounded">
                      <span className="font-medium text-gray-300">Inserção:</span>
                      <span className="font-mono text-red-400 font-bold">O(n)</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-700 p-3 rounded">
                      <span className="font-medium text-gray-300">Remoção:</span>
                      <span className="font-mono text-red-400 font-bold">O(n)</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-700 p-3 rounded">
                      <span className="font-medium text-gray-300">Percurso:</span>
                      <span className="font-mono text-gray-400 font-bold">O(n)</span>
                    </div>
                  </div>
                </div>
              </div>              <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-600">
                <h4 className="text-2xl font-semibold text-blue-400 mb-4">💡 Exemplo Prático</h4>
                <p className="text-gray-300 mb-4">Com 1 milhão de elementos:</p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                    <strong className="text-green-400">Árvore balanceada:</strong> ~20 comparações
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                    <strong className="text-red-400">Árvore desbalanceada:</strong> até 1.000.000 comparações
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        )

      case 'conclusion':
        return (
          <div className="p-8 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
                       <motion.h2
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl font-bold text-white mb-8 text-center"
            >
              🎯 Conclusão
            </motion.h2>
            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="max-w-6xl mx-auto"
            >              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-600">
                  <h3 className="text-2xl font-semibold text-emerald-400 mb-6">🌟 Pontos Principais</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Árvores binárias são fundamentais na ciência da computação
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Organização hierárquica permite buscas extremamente eficientes
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Implementação em C oferece controle total sobre performance
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Aplicações vão desde bancos de dados até inteligência artificial
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-600">
                  <h3 className="text-2xl font-semibold text-teal-400 mb-6">🚀 Próximos Passos</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Explorar árvores auto-balanceáveis (AVL, Red-Black)
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Estudar implementações em sistemas reais
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Praticar com diferentes casos de uso
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Aplicar em projetos de desenvolvimento multiplataforma
                    </li>
                  </ul>
                </div>
              </div>              <div className="bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg p-8 shadow-lg border border-slate-500">
                <h4 className="text-2xl font-semibold text-white mb-4">💪 Continue Aprendendo!</h4>
                <p className="text-gray-300 leading-relaxed text-lg">
                  O domínio de árvores binárias abre portas para algoritmos mais avançados
                  e prepara você para desafios complexos no desenvolvimento de software multiplataforma.
                </p>
              </div>
            </motion.div>
          </div>
        )

      default:
        return <div className="p-8 text-center text-white">Seção não encontrada</div>
    }
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      {renderCurrentSlide()}
    </div>
  )
}
