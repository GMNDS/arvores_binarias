import { motion } from 'framer-motion'
import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Props {
  section: string
}

export const LectureSlides = ({ section }: Props) => {
  const [showCode, setShowCode] = useState<{[key: string]: boolean}>({})
  
  const toggleCode = (operation: string) => {
    setShowCode(prev => ({
      ...prev,
      [operation]: !prev[operation]
    }))
  }

  const implementationCodes = {
    insert: `// Inserção em Árvore Binária de Busca
Node* insert(Node* root, int value) {
    // Caso base: árvore vazia
    if (root == NULL) {
        Node* newNode = malloc(sizeof(Node));
        newNode->data = value;
        newNode->left = NULL;
        newNode->right = NULL;
        return newNode;
    }
    
    // Inserir na subárvore apropriada
    if (value < root->data) {
        root->left = insert(root->left, value);
    } else if (value > root->data) {
        root->right = insert(root->right, value);
    }
    
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
}`
  }

  const slideVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  }

  const renderSlideContent = () => {
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            >
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-green-400/40 hover:bg-slate-700/80 transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-green-300 mb-4">🌳 Definição</h3>
                <p className="text-gray-100 leading-relaxed">
                  Estrutura hierárquica onde cada nó pode ter no máximo dois filhos: esquerdo e direita.
                </p>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-green-400/40 hover:bg-slate-700/80 transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-green-300 mb-4">🔑 Terminologia</h3>
                <ul className="text-gray-100 space-y-2 leading-relaxed">
                  <li><strong className="text-green-200">Raiz:</strong> Nó principal sem pai</li>
                  <li><strong className="text-green-200">Folha:</strong> Nó sem filhos</li>
                  <li><strong className="text-green-200">Altura:</strong> Maior distância da raiz às folhas</li>
                  <li><strong className="text-green-200">Nível:</strong> Distância de um nó à raiz</li>
                </ul>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-green-400/40 hover:bg-slate-700/80 transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-green-300 mb-4">💾 Estrutura em C</h3>
                <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-600">
                  <SyntaxHighlighter 
                    language="c" 
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      background: 'transparent',
                      fontSize: '13px',
                      lineHeight: '1.4'
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
              🌍 Aplicações no Mundo Real
            </motion.h2>
            <motion.div 
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
            >
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-teal-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-teal-300 mb-4">🗄️ Bancos de Dados</h3>
                <p className="text-gray-100 leading-relaxed">Índices para consultas eficientes em milhões de registros</p>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-blue-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-blue-300 mb-4">🤖 Machine Learning</h3>
                <p className="text-gray-100 leading-relaxed">Árvores de decisão em algoritmos como Random Forest</p>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-green-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-green-300 mb-4">📁 Sistemas de Arquivos</h3>
                <p className="text-gray-100 leading-relaxed">Organização hierárquica de diretórios e arquivos</p>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-purple-300 mb-4">🗜️ Compressão</h3>
                <p className="text-gray-100 leading-relaxed">Algoritmo de Huffman para compressão de dados</p>
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
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
            >
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-red-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-red-300 mb-4">💾 Vazamento de Memória</h3>
                <p className="text-gray-100 mb-4 leading-relaxed">Não liberar nós adequadamente</p>
                <div className="bg-red-900/40 p-4 rounded-lg border border-red-500/30">
                  <strong className="text-red-200">Solução:</strong> Implementar função de limpeza em pós-ordem
                </div>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-orange-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-orange-300 mb-4">🚫 Ponteiros Nulos</h3>
                <p className="text-gray-100 mb-4 leading-relaxed">Não verificar NULL antes de acessar</p>
                <div className="bg-orange-900/40 p-4 rounded-lg border border-orange-500/30">
                  <strong className="text-orange-200">Solução:</strong> Sempre verificar if (node != NULL)
                </div>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-blue-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-blue-300 mb-4">🔄 Recursão Incorreta</h3>
                <p className="text-gray-100 mb-4 leading-relaxed">Caso base mal definido</p>
                <div className="bg-blue-900/40 p-4 rounded-lg border border-blue-500/30">
                  <strong className="text-blue-200">Solução:</strong> Definir claramente quando parar a recursão
                </div>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-purple-300 mb-4">📏 Violação de Propriedade BST</h3>
                <p className="text-gray-100 mb-4 leading-relaxed">Inserções que quebram a ordenação</p>
                <div className="bg-purple-900/40 p-4 rounded-lg border border-purple-500/30">
                  <strong className="text-purple-200">Solução:</strong> Sempre manter menores à esquerda, maiores à direita
                </div>
              </div>
            </motion.div>
          </div>
        );

      default:
        return <div className="p-8 text-center text-white">Seção não encontrada</div>
    }
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      {renderSlideContent()}
    </div>
  )
}
