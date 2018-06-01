'use strict';
// КЛАС, ЯКИЙ ОПИСУЄ ЕЛЕМЕНТ ДЕРЕВА
class Node {
    constructor(data) {
        this.data = toNumber(data); //інфо поле
        this.left = null;
        this.right = null;   // лівий та правий сини
        this.color = null;   // колір елемента
        this.parent = null;
    }

    static getData() {
        return data;
    }
}

// КЛАС, ЯКИЙ ОПИСУЄ ДЕРЕВО
class RbTree {
    constructor() {
        this.root = null;
    }
   static clone(node) {
        return new Node(node.key, node.value, node.left, node.right, node.color, node.parent);
    }

    // ВСТАВКА ЕЛЕМЕНТА В ДЕРЕВО
    insert(data) {
        let parent = null;
        let child = this.root;
        const newNode = new Node(data);
        if (this.root == null) {
            this.root = newNode;
            newNode.color = nodeColor.BLACK;
            newNode.parent = null;
        } else {
            while (child) {
                parent = child;
                if (newNode.data < child.data) {
                    child = child.left;
                } else {
                    child = child.right;
                }

            }
            newNode.parent = parent;
            // current node parent is root
            if (newNode.data < parent.data) {
                parent.left = newNode;
            } else {
                parent.right = newNode;
            }
            // y.right is now z
            newNode.color = nodeColor.RED;
            this.balanceTree(newNode);
        }
    }


    balanceTree(node) {
        while (node.parent != null && node.parent.color === nodeColor.RED) { //КОЛИ ЦЕй ЕЛЕНТ НЕ ЄДИНИЙ ТА КОЛІР БАТЬКА - ЧЕРВОНИЙ, БАЛАНСУЄМО
            let uncle = null;
            if (node.parent === node.parent.parent.left) {
                uncle = node.parent.parent.right;

                if (uncle != null && uncle.color === nodeColor.RED) {
                    node.parent.color = nodeColor.BLACK;
                    uncle.color = nodeColor.BLACK;
                    node.parent.parent.color = nodeColor.RED;
                    node = node.parent.parent;
                    continue;
                }
                if (node === node.parent.right) {
                    // Double rotation needed
                    node = node.parent;
                    this.rotateLeft(node);
                }
                node.parent.color = nodeColor.BLACK;
                node.parent.parent.color = nodeColor.RED;
                // if the "else if" code hasn't executed, this
                // is a case where we only need a single rotation
                this.rotateRight(node.parent.parent);
            } else {
                uncle = node.parent.parent.left;
                if (uncle != null && uncle.color === nodeColor.RED) {
                    node.parent.color = nodeColor.BLACK;
                    uncle.color = nodeColor.BLACK;
                    node.parent.parent.color = nodeColor.RED;
                    node = node.parent.parent;
                    continue;
                }
                if (node === node.parent.left) {
                    // Double rotation needed
                    node = node.parent;
                    this.rotateRight(node);
                }
                node.parent.color = nodeColor.BLACK;
                node.parent.parent.color = nodeColor.RED;
                // if the "else if" code hasn't executed, this
                // is a case where we only need a single rotation
                this.rotateLeft(node.parent.parent);
            }
        }
        this.root.color = nodeColor.BLACK;
    }


    // ПОВОРОТ ДЕРЕВА ВЛІВО
    rotateLeft(node) {
        const rotateNode = node.right;

        // console.log(y.left)
        if (!rotateNode.left) {
            node.right = null;
        } else {
            node.right = rotateNode.left;
        }

        if (rotateNode.left) {
            rotateNode.left.parent = node;
        }
        rotateNode.parent = node.parent;
        if (!node.parent) {
            this.root = rotateNode;
        } else {
            if (node === node.parent.left) {
                node.parent.left = rotateNode;
            } else {
                node.parent.right = rotateNode;
            }
        }
        rotateNode.left = node;
        node.parent = rotateNode;
    }


// ПОВОРОТ ДЕРЕВА ВПРАВО
    rotateRight(node) {
        const rotateNode = node.left;

        if (!rotateNode.right) {
            node.left = null;
        } else {
            node.left = rotateNode.right;
        }

        if (rotateNode.right) {
            rotateNode.right.parent = node;
        }
        rotateNode.parent = node.parent;
        if (!node.parent) {
            this.root = rotateNode;
        } else {
            if (node === node.parent.right) {
                node.parent.right = rotateNode;
            } else {
                node.parent.left = rotateNode;
            }
        }
        rotateNode.right = node;
        node.parent = rotateNode;
    }

    //ПОШУК ЕЛЕМЕНТУ
    findNode(data) {
        let node = this.root;
        while (node != null) {
            if (data < node.data) {
                node = node.left;
            } else if (data > node.data) {
                node = node.right;
            } else if (data === node.data) {
                return node;
            } else {
                return null;
            }
        }
        return null;
    }

    // ВИДАЛЕННЯ ЕЛЕМЕНТУ
       delete(data) {
        const delNode = this.findNode(data);
        if (delNode == null) {
            return;
        }
        let child;
        let newNode = delNode;
        let newNode_defColor = delNode.color;
        if (!delNode.left) {
            child = delNode.right;
            this.delete_insert(delNode, delNode.right);
        } else if (!delNode.right) {
            child = delNode.left;
            this.delete_insert(delNode, delNode.left);
        } else {
            newNode = this.min(delNode.right);
            newNode_defColor = delNode.color;
            child = newNode.right;
            if (newNode.parent === delNode) {
                child.parent = newNode;
            } else {
                this.delete_insert(newNode, newNode.right);
                newNode.right = delNode.right;
                newNode.right.parent = newNode;
            }
            this.delete_insert(delNode, newNode);
            newNode.left = delNode.left;
            newNode.left.parent = newNode;
            newNode.color = delNode.color;
        }
        if (newNode_defColor === nodeColor.BLACK) {
            this.balanceAfterDel(child);
        }
    }

    // БАЛАНСУВАННЯ ПІСЛЯ ВИДАЛЕННЯ
    balanceAfterDel(node) {
        while (node !== this.root && node.color === nodeColor.BLACK) {
            if (node === node.parent.left) {
                let uncle = node.parent.right;
                if (uncle.color === nodeColor.RED) {
                    uncle.color = nodeColor.BLACK;
                    node.parent.color = nodeColor.RED;
                    this.rotateLeft(node.parent);
                    uncle = node.parent.right;
                }
                if (uncle.left.color === nodeColor.BLACK && uncle.right.color === nodeColor.BLACK) {
                    uncle.color = nodeColor.RED;
                    node = node.parent;
                    continue;
                } else if (uncle.right.color === nodeColor.BLACK) {
                    uncle.left.color = nodeColor.BLACK;
                    uncle.color = nodeColor.RED;
                    uncle = node.parent.right;
                }
                if (uncle.right.color === nodeColor.RED) {
                    uncle.color = node.parent.color;
                    node.parent.color = nodeColor.BLACK;
                    uncle.right.color = nodeColor.BLACK;
                    this.rotateLeft(node.parent);
                    node = this.root;
                }
            } else {
                let uncle = node.parent.left;
                if (uncle.color === nodeColor.RED) {
                    uncle.color = nodeColor.BLACK;
                    node.parent.color = nodeColor.RED;
                    this.rotateRight(node.parent);
                    uncle = node.parent.left;
                }
                if (uncle.right.color === nodeColor.BLACK && uncle.left.color === nodeColor.BLACK) {
                    uncle.color = nodeColor.RED;
                    node = node.parent;
                } else if (uncle.left.color === nodeColor.BLACK) {
                    uncle.right.color = nodeColor.BLACK;
                    uncle.color = nodeColor.RED;
                    this.rotateLeft(uncle);
                    uncle = node.parent.left;
                }
                if (uncle.left.color === nodeColor.RED) {
                    uncle.color = node.parent.color;
                    node.parent.color = nodeColor.BLACK;
                    uncle.left.color = nodeColor.BLACK;
                    this.rotateRight(node.parent);
                    node = this.root;
                }
            }
        }
        node.color = nodeColor.BLACK;
    }

    // ТРАНСПЛАНТАЦІЯ НА МІСЦЕ ЛЕМЕНТА ІНШОГО ЕЛЕМЕНТА
    delete_insert(deleteNode, insertNode) {
        if (deleteNode.parent == null) {
            this.root = insertNode;
            insertNode.parent = null;
        } else  {
            if (deleteNode === deleteNode.parent.left) {
                deleteNode.parent.left = insertNode;

            } else {
                deleteNode.parent.right = insertNode;
            }
            insertNode.parent = deleteNode.parent;
        }
    }

    // ПОШУК МІНІМАЛЬНОГО ЕЛЕМЕНТУ В ПІДДЕРЕВІ NODE
    min(node) {
        if (node == null || node === undefined) {
            return {};
        }
        while (node.left) {
            node = node.left;
        }
        return node;
    }

    // ПОШУК ВИСОТИ ДЕРЕВА
    height(node) {
        if (node == null) {
            return -1;
        }
        const leftLen = this.height(node.left);
        const rightLen = this.height(node.right);

        if (leftLen > rightLen) {
            return leftLen + 1;
        }
        return rightLen + 1;
    }

    //ВИВІД ДЕРЕВА НА КОНСОЛЬ
    printTree() {
        const height = this.height(this.root) + 1;
        this.printHelper(this.root, '__', height);
    }

    printHelper(node, indent, height) {
        // tree height
        let treeHeight = height;

        if (node == null) {
            return;
        }
        if (node === this.root) {
            console.log(`${node.data} color: ${node.color}`);
        }
        if (node.left != null) {
            const parentInfo = `( parent node ${node.left.parent.data})`;
            console.log(`${indent}${node.left.data} color: ${node.left.color} ${parentInfo}`);
        }
        if (node.right != null) {
            const parentInfo = `( parent node ${node.right.parent.data})`;
            console.log(`${indent}${node.right.data} color: ${node.right.color} ${parentInfo}`);
        }
        treeHeight -= 1;
        this.printHelper(node.left, indent + indent, treeHeight);
        this.printHelper(node.right, indent + indent, treeHeight);
    }
}

// ОБ'ЄКТ, ЯКИЙ ОПИСУЄ ЗАБАРВЛЕННЯ ЕЛЕМЕНТА ДЕРЕВА
const nodeColor = {
    RED : 0,
    BLACK : 1
};

// ЗВОДИМО РЯДОК ДО ЧИСЕЛ
function toNumber(data) {
    // ЗСУВ - 96
    const offset = 96;
    //ЯКЩО КЛЮЧ - НЕ ЧИСЛО
    if (isNaN(data) && typeof data === 'string') {
        const dataToLower = data.toLowerCase();
        if (dataToLower.length > 1) {
            let number = '';
            //ПЕРЕВОДИМО КОЖНУ БУКВУ В ЧИСЛО
            for (let ch of dataToLower) {
                number += ch.charCodeAt(0) - offset + '';
            }
            return parseInt(number);
        }
        return dataToLower.charCodeAt(0) - offset;
    }
    return data;
}


const tree = new RbTree() ;
tree.insert(10);
tree.insert(12);
tree.insert(24);
tree.insert(21);
tree.insert(34);
tree.insert(38);
tree.insert(36);
tree.insert(50);
tree.printTree();
tree.delete(24);
tree.printTree();