import { useState } from 'react';
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
    traversal: `// Percursos em Árvore Binária (Traverse = Visitar TODOS os nós)
// TRAVERSE = percorrer todos os nós da árvore em uma ordem específica

void inorder(Node* root) {
    if (root != NULL) {
        inorder(root->left);      // Esquerda
        printf("%d ", root->data); // Raiz (visita o nó atual)
        inorder(root->right);     // Direita
    }
}

void preorder(Node* root) {
    if (root != NULL) {
        printf("%d ", root->data); // Raiz (visita o nó atual)
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
    memoryLeakIncorrect: `// ❌ ERRO: Aloca memória mas nunca libera
void badTreeFunction() {
    Node* root = malloc(sizeof(Node));
    root->data = 10;
    root->left = malloc(sizeof(Node));
    root->left->data = 5;
    root->right = malloc(sizeof(Node));
    root->right->data = 15;
    
    // Processamento...
    printf("Árvore criada\\n");
    
    // ERRO! Função termina sem fazer free()
    // Memória fica ocupada para sempre = VAZAMENTO
}`,
    memoryLeakCorrect: `// ✅ CORRETO: Para cada malloc(), um free()
void freeTree(Node* root) {
    if (root == NULL) return;
    
    // Liberar filhos primeiro (pós-ordem)
    freeTree(root->left);
    freeTree(root->right);
    
    // Depois liberar o nó atual
    free(root);
}

void goodTreeFunction() {
    Node* root = malloc(sizeof(Node));
    root->data = 10;
    root->left = malloc(sizeof(Node));
    root->left->data = 5;
    root->right = malloc(sizeof(Node));
    root->right->data = 15;
    
    // Processamento...
    printf("Árvore criada\\n");
    
    // CORRETO! Limpar a memória antes de sair
    freeTree(root);
}`,
    nullPointerIncorrect: `// ❌ ERRO: Não verifica se node é NULL
void printNodeData(Node* node) {
    // PERIGO! Se node for NULL, vai dar segmentation fault
    printf("Valor do nó: %d\\n", node->data);
    
    // Ainda mais perigoso - pode tentar acessar NULL->left
    if (node->left != NULL) {
        printf("Filho esquerdo: %d\\n", node->left->data);
    }
}

// Exemplo de uso que causa crash:
int main() {
    Node* root = NULL;  // Árvore vazia
    printNodeData(root); // 💥 CRASH! Tentando acessar NULL->data
    return 0;
}`,
    nullPointerCorrect: `// ✅ CORRETO: Sempre verifica NULL primeiro
void printNodeDataSafe(Node* node) {
    // SEMPRE verificar se o ponteiro é válido
    if (node == NULL) {
        printf("Nó é NULL - não pode acessar\\n");
        return;
    }
    
    // Agora é seguro acessar node->data
    printf("Valor do nó: %d\\n", node->data);
    
    // Verificar filhos também
    if (node->left != NULL) {
        printf("Filho esquerdo: %d\\n", node->left->data);
    } else {
        printf("Não tem filho esquerdo\\n");
    }
}`,
    incorrectRecursionIncorrect: `// ❌ ERRO: Recursão sem caso base
int calculateHeightBroken(Node* root) {
    // PERIGO! Não verifica se root é NULL
    // Se chamado com NULL, vai tentar acessar NULL->left e NULL->right
    
    int leftHeight = calculateHeightBroken(root->left);   // 💥 CRASH se root for NULL
    int rightHeight = calculateHeightBroken(root->right); // 💥 CRASH se root for NULL
    
    return 1 + (leftHeight > rightHeight ? leftHeight : rightHeight);
}

// Mesmo se verificasse NULL, sem return causaria loop infinito!`,
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
              className="max-w-6xl mx-auto"
            >

              {/* O que você vai aprender */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-blue-300 mb-6">🎯 O que você vai aprender</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">

                  {/* Fundamentos */}
                  <div className="bg-blue-600/20 backdrop-blur-sm rounded-lg p-4 border border-blue-400/30 hover:bg-blue-600/30 transition-all duration-300 hover:scale-105 text-left">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">📚</span>
                      <div>
                        <h4 className="text-blue-200 font-semibold mb-2">Fundamentos</h4>

                      </div>
                    </div>
                  </div>


                  {/* Operações */}
                  <div className="bg-purple-600/20 backdrop-blur-sm rounded-lg p-4 border border-purple-400/30 hover:bg-purple-600/30 transition-all duration-300 hover:scale-105 text-left">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">⚙️</span>
                      <div>
                        <h4 className="text-purple-200 font-semibold mb-2">Operações</h4>
                      </div>
                    </div>
                  </div>

                  {/* Erros */}
                  <div className="bg-red-600/20 backdrop-blur-sm rounded-lg p-4 border border-purple-400/30 hover:bg-purple-600/30 transition-all duration-300 hover:scale-105 text-left">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">❌</span>
                      <div>
                        <h4 className="text-red-200 font-semibold mb-2">Erros</h4>
                      </div>
                    </div>
                  </div>

                  {/* Análise */}
                  <div className="bg-orange-600/20 backdrop-blur-sm rounded-lg p-4 border border-orange-400/30 hover:bg-orange-600/30 transition-all duration-300 hover:scale-105 text-left">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">📊</span>
                      <div>
                        <h4 className="text-orange-200 font-semibold mb-2">Análise</h4>
      
                      </div>
                    </div>
                  </div>

                  {/* Prática */}
                  <div className="bg-red-600/20 backdrop-blur-sm rounded-lg p-4 border border-red-400/30 hover:bg-red-600/30 transition-all duration-300 hover:scale-105 text-left">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">🎮</span>
                      <div>
                        <h4 className="text-red-200 font-semibold mb-2">Visualização Prática</h4>
                      </div>
                    </div>
                  </div>

                  {/* Aplicações */}
                  <div className="bg-cyan-600/20 backdrop-blur-sm rounded-lg p-4 border border-cyan-400/30 hover:bg-cyan-600/30 transition-all duration-300 hover:scale-105 text-left">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">🌍</span>
                      <div>
                        <h4 className="text-cyan-200 font-semibold mb-2">Aplicações Reais</h4>
        
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Metodologia */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-2xl font-bold text-green-300 mb-6">Metodologia</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center border border-slate-600/50">
                    <span className="text-3xl block mb-2">1️⃣</span>
                    <strong className="text-white">Recapitulação</strong>
                    <p className="text-gray-400 text-sm mt-1">Revisão de estruturas anteriores</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center border border-slate-600/50">
                    <span className="text-3xl block mb-2">2️⃣</span>
                    <strong className="text-white">Teoria</strong>
                    <p className="text-gray-400 text-sm mt-1">Conceitos e implementação</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center border border-slate-600/50">
                    <span className="text-3xl block mb-2">3️⃣</span>
                    <strong className="text-white">Prática</strong>
                    <p className="text-gray-400 text-sm mt-1">Visualização interativa</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center border border-slate-600/50">
                    <span className="text-3xl block mb-2">4️⃣</span>
                    <strong className="text-white">Aplicação</strong>
                    <p className="text-gray-400 text-sm mt-1">Jogo e casos reais</p>
                  </div>
                </div>
              </motion.div>

              {/* Call to Action */}
              {/* ...existing code... */}
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
                    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }} >
                      <title>Binary Tree Example</title>
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
              🌳 Tipos e Formas de Árvores Binárias
            </motion.h2>

            {/* Seção 1: Tipos de Árvores Binárias */}
            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="max-w-7xl mx-auto mb-12"
            >
              <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl p-6 mb-8 border border-purple-400/30">
                <h3 className="text-3xl font-bold text-purple-200 mb-4 text-center">
                  🎯 TIPOS de Árvores Binárias
                </h3>
                <p className="text-gray-200 text-lg text-center leading-relaxed">
                  Diferentes algoritmos e estruturas especializadas com regras específicas
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h4 className="text-xl font-semibold text-purple-300 mb-4">🎯 Binary Search Tree (BST)</h4>
                  <p className="text-gray-100 mb-4 leading-relaxed">Propriedade: valores menores à esquerda, maiores à direita</p>
                  <div className="bg-gray-900/80 p-4 rounded font-mono text-sm text-center text-cyan-300 border border-gray-600 mb-3">
                    <div className="mb-2">15</div>
                    <div className="mb-2">/ \</div>
                    <div className="mb-2">10 20</div>
                    <div className="mb-2">/ \ / \</div>
                    <div className="mb-2">5 12 18 25</div>
                  </div>
                  <div className="bg-purple-900/60 p-3 rounded border border-purple-500/30">
                    <span className="text-purple-200 text-sm">⚡ Busca: O(log n) ~ O(n)</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-green-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h4 className="text-xl font-semibold text-green-300 mb-4">⚖️ Árvore AVL</h4>
                  <p className="text-gray-100 mb-4 leading-relaxed">BST auto-balanceável com fator de balanceamento ≤ 1</p>
                  <div className="bg-gray-900/80 p-4 rounded font-mono text-sm text-center text-cyan-300 border border-gray-600 mb-3">
                    <div className="mb-2">10</div>
                    <div className="mb-2">/ \</div>
                    <div className="mb-2">5 15</div>
                    <div className="mb-2">/ \ / \</div>
                    <div>3 7 12 20</div>
                  </div>
                  <div className="bg-green-900/60 p-3 rounded border border-green-500/30">
                    <span className="text-green-200 text-sm font-semibold">✅ Sempre O(log n)</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-red-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h4 className="text-xl font-semibold text-red-300 mb-4">🔴 Red-Black Tree</h4>
                  <p className="text-gray-100 mb-4 leading-relaxed">BST auto-balanceável com nós coloridos (vermelho/preto)</p>
                  <div className="bg-gray-900/80 p-4 rounded font-mono text-sm text-center text-cyan-300 border border-gray-600 mb-3">
                    <div className="mb-2 text-red-400">10(R)</div>
                    <div className="mb-2">/ \</div>
                    <div className="mb-2">5(B) 15(B)</div>
                    <div className="mb-2">/ \ / \</div>
                    <div>3(R) 7(R) 12(R) 20(R)</div>
                  </div>
                  <div className="bg-red-900/60 p-3 rounded border border-red-500/30">
                    <span className="text-red-200 text-sm">⚡ Garantido O(log n)</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Seção 2: Formas de Árvores Binárias */}
            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="max-w-7xl mx-auto mb-8"
            >
              <div className="bg-gradient-to-r from-blue-900/50 to-teal-900/50 rounded-xl p-6 mb-8 border border-blue-400/30">
                <h3 className="text-3xl font-bold text-blue-200 mb-4 text-center">
                  📐 FORMAS de Árvores Binárias
                </h3>
                <p className="text-gray-200 text-lg text-center leading-relaxed">
                  Classificações baseadas na estrutura e preenchimento dos nós
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-blue-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h4 className="text-xl font-semibold text-blue-300 mb-4">📏 Árvore Completa</h4>
                  <p className="text-gray-100 mb-4 leading-relaxed">Todos os níveis preenchidos, exceto possivelmente o último (preenchido da esquerda)</p>
                  <div className="bg-blue-900/60 p-3 rounded border border-blue-500/30">
                    <span className="text-blue-200 text-sm">📍 Ideal para heaps</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-yellow-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h4 className="text-xl font-semibold text-yellow-300 mb-4">🏆 Árvore Cheia (Full)</h4>
                  <p className="text-gray-100 mb-4 leading-relaxed">Cada nó tem exatamente 0 ou 2 filhos (nunca apenas 1)</p>
                  <div className="bg-yellow-900/60 p-3 rounded border border-yellow-500/30">
                    <span className="text-yellow-200 text-sm">🔸 Estrutura binária pura</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-indigo-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h4 className="text-xl font-semibold text-indigo-300 mb-4">💎 Árvore Perfeita</h4>
                  <p className="text-gray-100 mb-4 leading-relaxed">Cheia E completa simultaneamente - todas as folhas no mesmo nível</p>
                  <div className="bg-indigo-900/60 p-3 rounded border border-indigo-500/30">
                    <span className="text-indigo-200 text-sm">🌟 Forma ideal</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-emerald-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h4 className="text-xl font-semibold text-emerald-300 mb-4">⚖️ Árvore Balanceada</h4>
                  <p className="text-gray-100 mb-4 leading-relaxed">Altura das subárvores esquerda e direita difere por no máximo 1</p>
                  <div className="bg-emerald-900/60 p-3 rounded border border-emerald-500/30">
                    <span className="text-emerald-200 text-sm">🎯 Performance O(log n)</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-orange-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h4 className="text-xl font-semibold text-orange-300 mb-4">📉 Árvore Degenerada</h4>
                  <p className="text-gray-100 mb-4 leading-relaxed">Cada nó tem apenas um filho - equivale a uma lista encadeada</p>
                  <div className="bg-orange-900/60 p-3 rounded border border-orange-500/30">
                    <span className="text-orange-200 text-sm font-semibold">❌ Pior caso: O(n)</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-slate-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h4 className="text-xl font-semibold text-slate-300 mb-4">🌿 Árvore Esparsa</h4>
                  <p className="text-gray-100 mb-4 leading-relaxed">Muitos nós com apenas um filho ou vazios - baixa densidade</p>
                  <div className="bg-slate-900/60 p-3 rounded border border-slate-500/30">
                    <span className="text-slate-200 text-sm">📊 Baixa eficiência</span>
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
              className="w-full mx-auto"
            >
              <div className="grid grid-cols-1 gap-6">
                <div className="w-full bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-orange-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
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
                    onClick={() => toggleCode('insert')} type='button'
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

                <div className="w-full bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-blue-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
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
                    onClick={() => toggleCode('search')} type='button'
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

                <div className="w-full bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-green-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
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
                    onClick={() => toggleCode('traversal')} type='button'
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

                <div className="w-full bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-red-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
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
                    onClick={() => toggleCode('delete')} type='button'
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

                <div className="w-full bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
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
                    onClick={() => toggleCode('height')} type='button'
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

                <div className="w-full bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-indigo-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
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
                    onClick={() => toggleCode('balance')} type='button'
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
                      className={"flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-semibold shadow-lg transition-all duration-200 text-lg mb-2 focus:outline-none focus:ring-2 focus:ring-teal-400"}
                      aria-expanded={showCode.allC || false}
                      onClick={() => toggleCode('allC')} type='button'
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
              className="grid grid-cols-1 gap-6 w-full mx-auto"
            >
              {/* Erro 1: Verificação NULL */}
              <div className="w-full bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-red-400/40 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-red-300 mb-4">🚫 Verificação NULL</h3>
                <p className="text-gray-100 mb-3 leading-relaxed text-sm">
                  <strong className="text-red-200">O problema:</strong> Acessar <code className="bg-red-900/50 px-1 rounded text-xs">node-&gt;data</code>
                  quando <code className="bg-red-900/50 px-1 rounded text-xs">node</code> é NULL causa
                  <span className="text-red-400 font-bold"> Segmentation Fault</span>.
                </p>
                <p className="text-gray-100 mb-4 leading-relaxed text-sm">
                  <strong className="text-red-200">Solução:</strong> Sempre verificar <code className="bg-green-900/50 px-1 rounded text-xs">if (node != NULL)</code>
                  antes de acessar.
                </p>
                <button
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors text-sm"
                  onClick={() => toggleCode('nullPointer')} type='button'
                >
                  {showCode.nullPointer ? '👁️ Ocultar Código' : '📋 Ver Implementação'}
                </button>
                {showCode.nullPointer && (
                  <div className="mt-4 space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-red-200 mb-2">❌ Código que Falha:</h4>
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter language="c" style={vscDarkPlus} customStyle={syntaxHighlighterStyle} showLineNumbers>
                          {implementationCodes.nullPointerIncorrect}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-green-300 mb-2">✅ Código Correto:</h4>
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter language="c" style={vscDarkPlus} customStyle={syntaxHighlighterStyle} showLineNumbers>
                          {implementationCodes.nullPointerCorrect}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Erro 2: Vazamento de Memória */}
              <div className="w-full bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-orange-400/40 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-orange-300 mb-4">💾 Vazamento de Memória</h3>
                <p className="text-gray-100 mb-3 leading-relaxed text-sm">
                  <strong className="text-orange-200">O problema:</strong> Usar <code className="bg-orange-900/50 px-1 rounded text-xs">malloc()</code>
                  sem <code className="bg-orange-900/50 px-1 rounded text-xs">free()</code> deixa memória ocupada para sempre.
                </p>
                <p className="text-gray-100 mb-4 leading-relaxed text-sm">
                  <strong className="text-orange-200">Solução:</strong> Para cada <code className="bg-green-900/50 px-1 rounded text-xs">malloc()</code>
                  deve haver um <code className="bg-green-900/50 px-1 rounded text-xs">free()</code> correspondente.
                </p>
                <button
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded transition-colors text-sm"
                  onClick={() => toggleCode('memoryLeak')} type='button'
                >
                  {showCode.memoryLeak ? '👁️ Ocultar Código' : '📋 Ver Implementação'}
                </button>
                {showCode.memoryLeak && (
                  <div className="mt-4 space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-red-200 mb-2">❌ Código que Vaza:</h4>
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter language="c" style={vscDarkPlus} customStyle={syntaxHighlighterStyle} showLineNumbers>
                          {implementationCodes.memoryLeakIncorrect}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-green-300 mb-2">✅ Código Correto:</h4>
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter language="c" style={vscDarkPlus} customStyle={syntaxHighlighterStyle} showLineNumbers>
                          {implementationCodes.memoryLeakCorrect}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Erro 3: Recursão sem Caso Base */}
              <div className="w-full bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-blue-400/40 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-blue-300 mb-4">🔄 Recursão Infinita</h3>
                <p className="text-gray-100 mb-3 leading-relaxed text-sm">
                  <strong className="text-blue-200">O problema:</strong> Função recursiva sem caso base gera
                  <span className="text-blue-400 font-bold">Stack Overflow</span> em milissegundos.
                </p>
                <p className="text-gray-100 mb-4 leading-relaxed text-sm">
                  <strong className="text-blue-200">Solução:</strong> Sempre definir quando a recursão deve parar
                  com <code className="bg-green-900/50 px-1 rounded text-xs">if (condição) return;</code>
                </p>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors text-sm"
                  onClick={() => toggleCode('incorrectRecursion')} type='button'
                >
                  {showCode.incorrectRecursion ? '👁️ Ocultar Código' : '📋 Ver Implementação'}
                </button>
                {showCode.incorrectRecursion && (
                  <div className="mt-4 space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-red-200 mb-2">❌ Código que Trava:</h4>
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter language="c" style={vscDarkPlus} customStyle={syntaxHighlighterStyle} showLineNumbers>
                          {implementationCodes.incorrectRecursionIncorrect}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-green-300 mb-2">✅ Código Correto:</h4>
                      <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                        <SyntaxHighlighter language="c" style={vscDarkPlus} customStyle={syntaxHighlighterStyle} showLineNumbers>
                          {implementationCodes.incorrectRecursionCorrect}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        );

      case 'recap':
        return (
          <div className="p-8 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 overflow-y-auto">
            <motion.h2
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl font-bold text-white mb-6 text-center"
            >
              Recapitulando: A Jornada das Estruturas de Dados
            </motion.h2>

            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="max-w-7xl mx-auto space-y-4"
            >

              {/* Layout em Grid - Primeira Linha */}
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Tipos Primitivos */}
                <div className="bg-gradient-to-r from-blue-900/40 to-blue-800/40 rounded-lg p-4 border border-blue-400/30 backdrop-blur-sm">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🧱</span>
                    <h3 className="text-xl font-bold text-blue-300">Tipos Primitivos</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-blue-800/30 rounded p-2 text-center">
                      <strong className="text-blue-200 text-sm">int, float</strong>
                      <p className="text-gray-300 text-xs">Números</p>
                    </div>
                    <div className="bg-blue-800/30 rounded p-2 text-center">
                      <strong className="text-blue-200 text-sm">char</strong>
                      <p className="text-gray-300 text-xs">Caracteres</p>
                    </div>
                    <div className="bg-blue-800/30 rounded p-2 text-center">
                      <strong className="text-blue-200 text-sm">boolean</strong>
                      <p className="text-gray-300 text-xs">V ou F</p>
                    </div>
                  </div>
                </div>

                {/* Tipos Compostos */}
                <div className="bg-gradient-to-r from-green-900/40 to-green-800/40 rounded-lg p-4 border border-green-400/30 backdrop-blur-sm">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">📦</span>
                    <h3 className="text-xl font-bold text-green-300">Tipos Compostos</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-800/30 rounded p-2">
                      <strong className="text-green-200 text-sm">Arrays</strong>
                      <p className="text-gray-300 text-xs">Espaço contíguo, tamanho fixo</p>
                    </div>
                    <div className="bg-green-800/30 rounded p-2">
                      <strong className="text-green-200 text-sm">Tuplas</strong>
                      <p className="text-gray-300 text-xs">Diferentes tipos</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Segunda Linha */}
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {/* Tipos Concretos */}
                <div className="bg-gradient-to-r from-purple-900/40 to-purple-800/40 rounded-lg p-4 border border-purple-400/30 backdrop-blur-sm">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🔗</span>
                    <h3 className="text-xl font-bold text-purple-300">Tipos Concretos</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-purple-800/30 rounded p-2">
                      <strong className="text-purple-200 text-sm">Listas Ligadas</strong>
                      <p className="text-gray-300 text-xs">Nós conectados por ponteiros</p>
                    </div>
                    <div className="bg-purple-800/30 rounded p-2">
                      <strong className="text-purple-200 text-sm">Listas Duplamente Ligadas</strong>
                      <p className="text-gray-300 text-xs">Ponteiros prev e next</p>
                    </div>
                    <div className="bg-purple-800/30 rounded p-2">
                      <strong className="text-purple-200 text-sm">Listas Circulares</strong>
                      <p className="text-gray-300 text-xs">Último nó aponta para o primeiro</p>
                    </div>
                    <div className="bg-purple-800/30 rounded p-2">
                      <strong className="text-purple-200 text-sm">Arrays Dinâmicos</strong>
                      <p className="text-gray-300 text-xs">Realocação automática (vectors)</p>
                    </div>
                  </div>
                  <div className="mt-2 p-2 bg-purple-900/30 rounded text-xs">
                    <p className="text-gray-300"><strong>Conceito:</strong> Implementação específica e detalhada da estrutura de dados</p>
                    <p className="text-gray-300 mt-1"><strong>Nota:</strong> Árvores binárias são implementações específicas do TAD "Árvore"</p>
                  </div>
                </div>

                {/* Tipos Abstratos */}
                <div className="bg-gradient-to-r from-orange-900/40 to-orange-800/40 rounded-lg p-4 border border-orange-400/30 backdrop-blur-sm">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🎭</span>
                    <h3 className="text-xl font-bold text-orange-300">Tipos Abstratos de Dados (TADs)</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-orange-800/30 rounded p-2">
                      <strong className="text-orange-200 text-sm">Pilhas (Stack)</strong>
                      <p className="text-gray-300 text-xs">LIFO - push/pop</p>
                    </div>
                    <div className="bg-orange-800/30 rounded p-2">
                      <strong className="text-orange-200 text-sm">Filas (Queue)</strong>
                      <p className="text-gray-300 text-xs">FIFO - enqueue/dequeue</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-orange-800/30 rounded p-2">
                      <strong className="text-orange-200 text-sm">Hash Tables</strong>
                      <p className="text-gray-300 text-xs">Chave-valor - insert/search/delete</p>
                    </div>
                    <div className="bg-orange-800/30 rounded p-2">
                      <strong className="text-orange-200 text-sm">Árvores</strong>
                      <p className="text-gray-300 text-xs">Hierárquica - percorrer/buscar</p>
                      <p className="text-gray-400 text-xs">*traverse = visitar todos os nós</p>
                    </div>
                  </div>
                  <div className="mt-2 p-2 bg-orange-900/30 rounded text-xs">
                    <p className="text-gray-300"><strong>Conceito:</strong> Definem operações e comportamento, não implementação específica</p>
                    <p className="text-gray-300 mt-1"><strong>Exemplos:</strong> Stack pode ser array ou lista; Hash Table pode usar chaining ou open addressing</p>
                  </div>
                </div>
              </motion.div>

              {/* Terceira Linha - Divisão Linear vs Não-Linear */}
              <motion.div
                className="bg-gradient-to-r from-red-900/40 to-red-800/40 rounded-lg p-4 border border-red-400/30 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🌐</span>
                  <h3 className="text-xl font-bold text-red-300">A Grande Divisão: Linear vs Não-Linear</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-800/30 rounded p-3">
                    <h4 className="text-red-200 font-semibold mb-2 text-sm">📏 Estruturas Lineares</h4>
                    <div className="text-gray-300 text-xs space-y-1">
                      <span className="inline-block bg-red-700/30 px-2 py-1 rounded mr-1">Arrays</span>
                      <span className="inline-block bg-red-700/30 px-2 py-1 rounded mr-1">Listas</span>
                      <span className="inline-block bg-red-700/30 px-2 py-1 rounded mr-1">Pilhas</span>
                      <span className="inline-block bg-red-700/30 px-2 py-1 rounded">Filas</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-2">Dados organizados sequencialmente</p>
                  </div>
                  <div className="bg-red-900/30 rounded p-3">
                    <h4 className="text-red-200 font-semibold mb-2 text-sm">🕸️ Estruturas Não-Lineares</h4>
                    <div className="text-gray-300 text-xs space-y-1">
                      <span className="inline-block bg-red-700/30 px-2 py-1 rounded mr-1">Grafos</span>
                      <span className="inline-block bg-red-700/30 px-2 py-1 rounded mr-1">Árvores*</span>
                      <span className="inline-block bg-red-700/30 px-2 py-1 rounded">Hash Tables*</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-2">Relacionamentos hierárquicos/complexos</p>
                    <p className="text-gray-400 text-xs">*Também são Tipos Abstratos de Dados</p>
                  </div>
                </div>
              </motion.div>

              {/* Chegando em Árvores */}
              <motion.div
                className="bg-gradient-to-r from-emerald-900/40 to-emerald-800/40 rounded-lg p-4 border border-emerald-400/30 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🌳</span>
                  <h3 className="text-xl font-bold text-emerald-300">E Finalmente... Árvores!</h3>
                </div>
                <div className="bg-emerald-800/30 rounded p-3">
                  <p className="text-gray-300 text-sm">
                    Após dominar arrays, listas ligadas e hash tables, chegamos às <strong className="text-emerald-200">árvores</strong> -
                    uma estrutura não-linear que combina organização hierárquica e eficiência de busca.
                  </p>
                  <div className="mt-2 p-2 bg-emerald-900/30 rounded">
                    <p className="text-emerald-200 text-xs font-semibold">
                      Uma árvore é um grafo não-direcionado, acíclico e conectado - um caso especial de grafo!
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Requisitos Fundamentais */}
              <motion.div
                className="bg-gradient-to-r from-indigo-900/40 to-indigo-800/40 rounded-lg p-4 border border-indigo-400/30 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">⚙️</span>
                  <h3 className="text-xl font-bold text-indigo-300">Requisitos Fundamentais</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-indigo-800/30 rounded p-2 text-center">
                    <div className="text-lg mb-1">🧠</div>
                    <strong className="text-indigo-200 text-sm block">Ponteiros em C</strong>
                    <p className="text-gray-300 text-xs">Navegação na árvore</p>
                  </div>
                  <div className="bg-indigo-800/30 rounded p-2 text-center">
                    <div className="text-lg mb-1">🏗️</div>
                    <strong className="text-indigo-200 text-sm block">Alocação Dinâmica</strong>
                    <p className="text-gray-300 text-xs">malloc/free para nós</p>
                  </div>
                  <div className="bg-indigo-800/30 rounded p-2 text-center">
                    <div className="text-lg mb-1">📊</div>
                    <strong className="text-indigo-200 text-sm block">Estruturas (struct)</strong>
                    <p className="text-gray-300 text-xs">Representação dos nós</p>
                  </div>
                  <div className="bg-indigo-800/30 rounded p-2 text-center">
                    <div className="text-lg mb-1">🔄</div>
                    <strong className="text-indigo-200 text-sm block">Recursão</strong>
                    <p className="text-gray-300 text-xs">Crucial para operações</p>
                  </div>
                  <div className="bg-indigo-800/30 rounded p-2 text-center">
                    <div className="text-lg mb-1">📈</div>
                    <strong className="text-indigo-200 text-sm block">Big O Notation</strong>
                    <p className="text-gray-300 text-xs">Análise de complexidade</p>
                  </div>
                </div>
              </motion.div>

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
              📊 Análise de Complexidade: BST vs AVL vs Red-Black
            </motion.h2>
            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="max-w-7xl mx-auto space-y-8"
            >
              {/* Comparação das três estruturas */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-600">
                  <h3 className="text-2xl font-semibold text-blue-400 mb-6 text-center">🌳 BST (Binary Search Tree)</h3>
                  <div className="space-y-3">
                    <div className="text-center mb-4">
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">Árvore Básica</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-700 p-3 rounded">
                      <span className="font-medium text-gray-300">Busca:</span>
                      <div className="text-right">
                        <div className="font-mono text-green-400 font-bold">O(log n) avg</div>
                        <div className="font-mono text-red-400 text-sm">O(n) worst</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-slate-700 p-3 rounded">
                      <span className="font-medium text-gray-300">Inserção:</span>
                      <div className="text-right">
                        <div className="font-mono text-green-400 font-bold">O(log n) avg</div>
                        <div className="font-mono text-red-400 text-sm">O(n) worst</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-slate-700 p-3 rounded">
                      <span className="font-medium text-gray-300">Remoção:</span>
                      <div className="text-right">
                        <div className="font-mono text-green-400 font-bold">O(log n) avg</div>
                        <div className="font-mono text-red-400 text-sm">O(n) worst</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-slate-700 p-3 rounded">
                      <span className="font-medium text-gray-300">Espaço:</span>
                      <span className="font-mono text-gray-400 font-bold">O(n)</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-slate-700 rounded">
                    <p className="text-gray-300 text-sm">
                      <strong className="text-red-400">Problema:</strong> Pode degenerar em lista linear (O(n))
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-green-600">
                  <h3 className="text-2xl font-semibold text-green-400 mb-6 text-center">⚖️ AVL Tree</h3>
                  <div className="space-y-3">
                    <div className="text-center mb-4">
                      <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">Auto-Balanceada</span>
                    </div>
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
                      <span className="font-medium text-gray-300">Espaço:</span>
                      <span className="font-mono text-gray-400 font-bold">O(n)</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-900/30 rounded">
                    <p className="text-gray-300 text-sm">
                      <strong className="text-green-400">Vantagem:</strong> Garantia de O(log n) para todas as operações
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-red-600">
                  <h3 className="text-2xl font-semibold text-red-400 mb-6 text-center">🔴⚫ Red-Black Tree</h3>
                  <div className="space-y-3">
                    <div className="text-center mb-4">
                      <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm">Balanceamento Relaxado</span>
                    </div>
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
                      <span className="font-medium text-gray-300">Espaço:</span>
                      <span className="font-mono text-gray-400 font-bold">O(n)</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-red-900/30 rounded">
                    <p className="text-gray-300 text-sm">
                      <strong className="text-red-400">Vantagem:</strong> Menos rotações que AVL
                    </p>
                  </div>
                </div>
              </div>

              {/* Por que AVL e Red-Black foram criadas? */}
              <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-6 shadow-lg border border-purple-600">
                <h3 className="text-2xl font-semibold text-purple-400 mb-6 text-center">
                  🤔 Por que AVL e Red-Black Trees foram criadas?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-slate-800/70 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-red-400 mb-2">❌ Problema do BST Simples</h4>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• Inserção ordenada → Lista linear</li>
                        <li>• Performance degrada para O(n)</li>
                        <li>• Não há garantias de balanceamento</li>
                        <li>• Dependente da ordem de inserção</li>
                      </ul>
                    </div>
                    <div className="bg-slate-800/70 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-green-400 mb-2">✅ Solução: Auto-Balanceamento</h4>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• Garantia de altura O(log n)</li>
                        <li>• Performance consistente</li>
                        <li>• Independe da ordem de inserção</li>
                        <li>• Rotações mantêm propriedades</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-800/70 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-blue-400 mb-2">🎯 AVL vs Red-Black</h4>
                      <div className="space-y-3">
                        <div>
                          <strong className="text-green-400">AVL:</strong>
                          <ul className="text-gray-300 text-sm ml-4">
                            <li>• Mais rigidamente balanceada</li>
                            <li>• Melhor para muitas buscas</li>
                            <li>• Mais rotações em inserção/remoção</li>
                          </ul>
                        </div>
                        <div>
                          <strong className="text-red-400">Red-Black:</strong>
                          <ul className="text-gray-300 text-sm ml-4">
                            <li>• Balanceamento mais relaxado</li>
                            <li>• Menos rotações</li>
                            <li>• Melhor para muitas inserções/remoções</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparação prática */}
              <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-600">
                <h4 className="text-2xl font-semibold text-yellow-400 mb-4">💡 Comparação Prática</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-lg font-semibold text-blue-400 mb-3">Cenário: 1.000.000 elementos</h5>
                    <div className="space-y-3">
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="flex justify-between">
                          <span className="text-gray-300">BST (pior caso):</span>
                          <span className="text-red-400 font-mono">1.000.000 ops</span>
                        </div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="flex justify-between">
                          <span className="text-gray-300">AVL Tree:</span>
                          <span className="text-green-400 font-mono">~20 ops</span>
                        </div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Red-Black Tree:</span>
                          <span className="text-green-400 font-mono">~20 ops</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-purple-400 mb-3">Uso no Mundo Real</h5>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <div className="flex items-start space-x-2">
                        <span className="text-green-400">•</span>
                        <span><strong>AVL:</strong> Bancos de dados, aplicações com muitas consultas</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-red-400">•</span>
                        <span><strong>Red-Black:</strong> C++ STL map/set, Java TreeMap</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-400">•</span>
                        <span><strong>BST:</strong> Estruturas simples, prototipagem</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fórmulas matemáticas */}
              <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-600">
                <h4 className="text-2xl font-semibold text-cyan-400 mb-4">📐 Garantias Matemáticas</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-700 p-4 rounded">
                    <h5 className="font-semibold text-blue-400 mb-2">BST</h5>
                    <p className="text-gray-300 text-sm">Altura: <span className="font-mono text-red-400">O(n)</span> no pior caso</p>
                    <p className="text-gray-300 text-sm">Pode degenerar em lista</p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded">
                    <h5 className="font-semibold text-green-400 mb-2">AVL</h5>
                    <p className="text-gray-300 text-sm">Altura: <span className="font-mono text-green-400">≤ 1.44 log₂(n)</span></p>
                    <p className="text-gray-300 text-sm">|h_left - h_right| ≤ 1</p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded">
                    <h5 className="font-semibold text-red-400 mb-2">Red-Black</h5>
                    <p className="text-gray-300 text-sm">Altura: <span className="font-mono text-red-400">≤ 2 log₂(n+1)</span></p>
                    <p className="text-gray-300 text-sm">Caminho mais longo ≤ 2x menor</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )
      case 'conclusion':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Animated background particles */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={`particle-${i}-${Date.now()}-${Math.random()}`}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  initial={{ 
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    opacity: 0
                  }}
                  animate={{
                    y: -100,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>

            {/* Main content */}
            <div className="text-center z-10 relative">
              {/* Animated title */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.3
                }}
              >
                <h1 className="text-8xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 drop-shadow-2xl mb-8 animate-pulse">
                  🎉 FIM 🎉
                </h1>
              </motion.div>


            </div>

            {/* Floating decorative elements */}
            <motion.div
              className="absolute top-20 left-20 text-6xl opacity-30"
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
            >
              🌟
            </motion.div>
            <motion.div
              className="absolute bottom-20 right-20 text-5xl opacity-30"
              animate={{ rotate: -360, y: [-10, 10, -10] }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
            >
              🎓
            </motion.div>
            <motion.div
              className="absolute top-1/2 left-10 text-4xl opacity-30"
              animate={{ x: [0, 20, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
            >
              💫
            </motion.div>
            <motion.div
              className="absolute top-1/4 right-10 text-4xl opacity-30"
              animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY }}
            >
              🚀
            </motion.div>

            {/* Confetti effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
            >
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={`confetti-${i}-${Math.random()}`}
                  className="absolute text-2xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: -50,
                  }}
                  animate={{
                    y: window.innerHeight + 100,
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 2,
                  }}
                >
                  {['🎊', '🎉', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]}
                </motion.div>
              ))}
            </motion.div>
          </div>
        )

      default:
        return <div className="p-8 text-center text-white">Seção não encontrada</div>
    }
  }

  return (
    <div className="w-full h-full">
      {renderCurrentSlide()}
    </div>
  )
}
