import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Props {
  operation?: string
  onClose?: () => void
}

export const OperationCodeDisplay = ({ operation, onClose }: Props) => {
  const [isVisible, setIsVisible] = useState(true)

  const codeExamples = {
    insert: {
      title: "Implementação: Inserção em BST",
      code: `Node* insert(Node *root, int value) {
    // Caso base: se a árvore estiver vazia
    if (root == NULL) {
        Node *newNode = (Node*)malloc(sizeof(Node));
        newNode->data = value;
        newNode->left = NULL;
        newNode->right = NULL;
        return newNode;
    }
    
    // Inserção recursiva mantendo a propriedade BST
    if (value < root->data) {
        root->left = insert(root->left, value);
    } else if (value > root->data) {
        root->right = insert(root->right, value);
    }
    // Se valor == root->data, não inserir (sem duplicatas)
    
    return root;
}

// Exemplo de uso:
// root = insert(root, 50);
// root = insert(root, 30);
// root = insert(root, 70);`
    },
    search: {
      title: "Implementação: Busca em BST",
      code: `Node* search(Node *root, int value) {
    // Caso base: árvore vazia ou valor encontrado
    if (root == NULL || root->data == value) {
        return root;
    }
    
    // Busca recursiva na subárvore apropriada
    if (value < root->data) {
        return search(root->left, value);
    } else {
        return search(root->right, value);
    }
}

// Versão iterativa (mais eficiente em memória):
Node* searchIterative(Node *root, int value) {
    while (root != NULL && root->data != value) {
        if (value < root->data) {
            root = root->left;
        } else {
            root = root->right;
        }
    }
    return root; // NULL se não encontrado
}`
    },
    traversal: {
      title: "Implementação: Percursos em BST",
      code: `// Percurso Em-ordem (Inorder) - Resulta em ordem crescente
void inOrder(Node *root) {
    if (root != NULL) {
        inOrder(root->left);   // Visita subárvore esquerda
        printf("%d ", root->data); // Processa nó atual
        inOrder(root->right);  // Visita subárvore direita
    }
}

// Percurso Pré-ordem (Preorder)
void preOrder(Node *root) {
    if (root != NULL) {
        printf("%d ", root->data); // Processa nó atual
        preOrder(root->left);  // Visita subárvore esquerda
        preOrder(root->right); // Visita subárvore direita
    }
}

// Percurso Pós-ordem (Postorder)
void postOrder(Node *root) {
    if (root != NULL) {
        postOrder(root->left);  // Visita subárvore esquerda
        postOrder(root->right); // Visita subárvore direita
        printf("%d ", root->data); // Processa nó atual
    }
}`
    },
    delete: {
      title: "Implementação: Remoção em BST",
      code: `Node* findMin(Node *root) {
    while (root->left != NULL) {
        root = root->left;
    }
    return root;
}

Node* deleteNode(Node *root, int value) {
    if (root == NULL) {
        return root; // Valor não encontrado
    }
    
    // Localiza o nó a ser removido
    if (value < root->data) {
        root->left = deleteNode(root->left, value);
    } else if (value > root->data) {
        root->right = deleteNode(root->right, value);
    } else {
        // Nó encontrado! Três casos possíveis:
        
        // Caso 1: Nó é folha (sem filhos)
        if (root->left == NULL && root->right == NULL) {
            free(root);
            return NULL;
        }
        // Caso 2: Nó tem apenas um filho
        else if (root->left == NULL) {
            Node *temp = root->right;
            free(root);
            return temp;
        } else if (root->right == NULL) {
            Node *temp = root->left;
            free(root);
            return temp;
        }
        // Caso 3: Nó tem dois filhos
        else {
            Node *temp = findMin(root->right);
            root->data = temp->data;
            root->right = deleteNode(root->right, temp->data);
        }
    }
    return root;
}`
    },
    height: {
      title: "Implementação: Cálculo de Altura",
      code: `int height(Node *root) {
    // Caso base: árvore vazia
    if (root == NULL) {
        return -1; // ou 0, dependendo da convenção
    }
    
    // Calcula altura das subárvores
    int leftHeight = height(root->left);
    int rightHeight = height(root->right);
    
    // Retorna 1 + maior altura das subárvores
    return 1 + (leftHeight > rightHeight ? leftHeight : rightHeight);
}

// Função auxiliar para contar total de nós
int countNodes(Node *root) {
    if (root == NULL) {
        return 0;
    }
    return 1 + countNodes(root->left) + countNodes(root->right);
}`
    },
    balance: {
      title: "Implementação: Verificação de Balanceamento",
      code: `// Verifica se a árvore está balanceada
bool isBalanced(Node *root) {
    if (root == NULL) {
        return true; // Árvore vazia é balanceada
    }
    
    int leftHeight = height(root->left);
    int rightHeight = height(root->right);
    
    // Verifica se diferença de alturas <= 1
    // E se ambas subárvores são balanceadas
    return (abs(leftHeight - rightHeight) <= 1) &&
           isBalanced(root->left) &&
           isBalanced(root->right);
}

// Função para balancear uma BST
Node* balanceBST(Node *root) {
    // 1. Armazenar elementos em array ordenado
    int values[1000];
    int index = 0;
    storeInorder(root, values, &index);
    
    // 2. Construir BST balanceada a partir do array
    return buildBalanced(values, 0, index - 1);
}

Node* buildBalanced(int values[], int start, int end) {
    if (start > end) return NULL;
    
    int mid = (start + end) / 2;
    Node *root = createNode(values[mid]);
    
    root->left = buildBalanced(values, start, mid - 1);
    root->right = buildBalanced(values, mid + 1, end);
    
    return root;
}`
    }
  }

  const currentExample = operation ? codeExamples[operation as keyof typeof codeExamples] : null

  if (!currentExample) return null
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="bg-gray-900/95 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, height: 0, scale: 0.95 }}
          animate={{ opacity: 1, height: 'auto', scale: 1 }}
          exit={{ opacity: 0, height: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-gray-700/50">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              📋 {currentExample.title}
            </h4>
            <button 
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-200"
              onClick={() => {
                setIsVisible(false)
                onClose?.()
              }}
            >
              ✕
            </button>
          </div>          <div className="p-4 max-h-96 overflow-y-auto">
            <SyntaxHighlighter 
              language="c"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: '8px',
                fontSize: '13px',
                lineHeight: '1.6',
                fontFamily: 'JetBrains Mono, Consolas, Monaco, "Courier New", monospace'
              }}
              showLineNumbers
              lineNumberStyle={{
                color: '#6b7280',
                fontSize: '12px',
                marginRight: '1rem'
              }}
            >
              {currentExample.code}
            </SyntaxHighlighter>
          </div>
        </motion.div>
      )}
      
      <button 
        className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? '📖 Ocultar Código' : '📋 Ver Implementação'}
      </button>
    </AnimatePresence>
  )
}
