'use strict';

const nodeColor = {
  RED: 0,
  BLACK: 1
};

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
    this.color = null;
    this.parent = null;
  }
}

class RbTree {

  constructor() {
    this.root = null;
  }

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
    } else if (node === node.parent.right) {
      node.parent.right = rotateNode;
    } else {
      node.parent.left = rotateNode;
    }
    rotateNode.right = node;
    node.parent = rotateNode;
  }

  rotateLeft(node) {
    const rotateNode = node.right;
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
    } else if (node === node.parent.left) {
      node.parent.left = rotateNode;
    } else {
      node.parent.right = rotateNode;
    }
    rotateNode.left = node;
    node.parent = rotateNode;
  }

  balanceTree(node) {
    while (node.parent !== null && node.parent.color === nodeColor.RED) {
      let uncle = null;
      if (node.parent === node.parent.parent.left) {
        uncle = node.parent.parent.right;
        if (uncle !== null && uncle.color === nodeColor.RED) {
          node.parent.color = nodeColor.BLACK;
          uncle.color = nodeColor.BLACK;
          node.parent.parent.color = nodeColor.RED;
          node = node.parent.parent;
          continue;
        }
        if (node === node.parent.right) {
          node = node.parent;
          this.rotateLeft(node);
        }
        node.parent.color = nodeColor.BLACK;
        node.parent.parent.color = nodeColor.RED;
        this.rotateRight(node.parent.parent);
      } else {
        uncle = node.parent.parent.left;
        if (uncle !== null && uncle.color === nodeColor.RED) {
          node.parent.color = nodeColor.BLACK;
          uncle.color = nodeColor.BLACK;
          node.parent.parent.color = nodeColor.RED;
          node = node.parent.parent;
          continue;
        }
        if (node === node.parent.left) {
          node = node.parent;
          this.rotateRight(node);
        }
        node.parent.color = nodeColor.BLACK;
        node.parent.parent.color = nodeColor.RED;
        this.rotateLeft(node.parent.parent);
      }
    }
    this.root.color = nodeColor.BLACK;
  }

  insert(data) {
    let parent = null;
    let child = this.root;
    const newNode = new Node(data);
    if (this.root === null) {
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
      if (newNode.data < parent.data) {
        parent.left = newNode;
      } else {
        parent.right = newNode;
      }
      newNode.color = nodeColor.RED;
      this.balanceTree(newNode);
    }
  }

  findNode(data) {
    let node = this.root;
    while (node !== null) {
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

  deleteInsert(deleteNode, insertNode) {
    if (deleteNode.parent === null) {
      this.root = insertNode;
      insertNode.parent = null;
    } else {
      if (deleteNode === deleteNode.parent.left) {
        deleteNode.parent.left = insertNode;

      } else {
        deleteNode.parent.right = insertNode;
      }
      insertNode.parent = deleteNode.parent;
    }
  }

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
        if (uncle.left.color === nodeColor.BLACK &&
          uncle.right.color === nodeColor.BLACK) {
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
        if (uncle.right.color === nodeColor.BLACK &&
          uncle.left.color === nodeColor.BLACK) {
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

  delete(data) {
    const delNode = this.findNode(data);
    if (delNode === null) {
      return;
    }
    let child;
    let newNode = delNode;
    let newNodeDefColor = delNode.color;
    if (!delNode.left) {
      child = delNode.right;
      this.deleteInsert(delNode, delNode.right);
    } else if (!delNode.right) {
      child = delNode.left;
      this.deleteInsert(delNode, delNode.left);
    } else {
      newNode = this.minimalNode(delNode.right);
      newNodeDefColor = delNode.color;
      child = newNode.right;
      if (newNode.parent === delNode) {
        child.parent = newNode;
      } else {
        this.deleteInsert(newNode, newNode.right);
        newNode.right = delNode.right;
        newNode.right.parent = newNode;
      }
      this.deleteInsert(delNode, newNode);
      newNode.left = delNode.left;
      newNode.left.parent = newNode;
      newNode.color = delNode.color;
    }
    if (newNodeDefColor === nodeColor.BLACK) {
      this.balanceAfterDel(child);
    }
  }

  minimalNode(node) {
    if (node === null || node === undefined) {
      return {};
    }
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  height(node) {
    if (node === null) {
      return -1;
    }
    const leftLen = this.height(node.left);
    const rightLen = this.height(node.right);

    if (leftLen > rightLen) {
      return leftLen + 1;
    }
    return rightLen + 1;
  }

  printHelper(node, indent, height) {
    let treeHeight = height;

    if (node === null) {
      return;
    }
    if (node === this.root) {
      console.log(`${node.data} color: ${node.color}`);
    }
    if (node.left !== null) {
      const parentInfo = `( parent node 
      ${node.left.parent.data})`;
      console.log(`${indent}${node.left.data} 
      color: ${node.left.color} ${parentInfo}`);
    }
    if (node.right !== null) {
      const parentInfo = `( parent node 
      ${node.right.parent.data})`;
      console.log(`${indent}${node.right.data}
       color: ${node.right.color} ${parentInfo}`);
    }
    treeHeight -= 1;
    this.printHelper(node.left, indent + indent, treeHeight);
    this.printHelper(node.right, indent + indent, treeHeight);
  }

  printTree() {
    const height = this.height(this.root) + 1;
    this.printHelper(this.root, '__', height);
  }

}

const tree = new RbTree();
tree.insert(10);
tree.insert(8);
tree.insert(9);

tree.printTree();
