# Render Tree Select

- First attempt I made the mistake of trying to build the data structure just as a regular object. I made the mistake of choosing this approach because I thought that given the time restriction it would be quicker to iterate a solution. When I got to the point where I needed to perform actions on the tree it became apparent that it would be difficult to traverse the tree and perform the necessary actions.
- Second attempt was done by creating a TreeNode class. The node class made it easier to traverse the tree and perform actions on each node.

```bash
# to run
node treeSelect.js
```

```javascript
// first attempt
function renderTreeSelect(paths, clicks) {
  const treeObject = {};

  // create a node on the tree
  const createNode = (path) => {
    const pathArr = path.split("/");
    let currentLevel = treeObject;
    pathArr.forEach((path, index) => {
      if (!currentLevel[path]) {
        currentLevel[path] = {};
      }
      currentLevel = currentLevel[path];
    });
  };

  // create all the nodes on the tree
  paths.forEach((path) => createNode(path));

  // sort tree
  const sortTreeAlphabetically = (tree) => {
    if (typeof tree !== "object" || tree === null) {
      return tree;
    }

    if (Array.isArray(tree)) {
      return tree.map(sortTreeAlphabetically);
    }

    const sortedObject = {};
    Object.keys(tree)
      .sort()
      .forEach((obj) => {
        sortedObject[obj] = sortTreeAlphabetically(tree[obj]);
      });

    return sortedObject;
  };

  const sortedTree = sortTreeAlphabetically(treeObject);

  // add isChecked property to each node
  const addIsCheckedToNodes = (obj) => {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    const updatedObj = { ...obj };
    updatedObj.isChecked = false;

    for (let key in updatedObj) {
      updatedObj[key] = addIsCheckedToNodes(updatedObj[key]);
    }

    return updatedObj;
  };

  // addIsCheckedToNodes(sortedTree)
  const treeWithChecks = addIsCheckedToNodes(sortedTree);

  console.log(JSON.stringify(treeWithChecks));

  // performactions on tree
  // write tree to string
  return tree;
}
```

```javascript
// second attempt
function renderTreeSelect(paths, clicks) {
  class TreeNode {
    constructor(parentNode) {
      this.parentNode = parentNode;
    }
    isChecked = false;
    childrenNodes = {};

    addChildNode = (name) => {
      if (!this.childrenNodes[name]) {
        this.childrenNodes[name] = new TreeNode(this);
      }
    };

    sortChildren = () => {
      const sortedChildren = {};
      Object.keys(this.childrenNodes)
        .sort()
        .forEach((node) => {
          sortedChildren[node] = this.childrenNodes[node];
        });

      this.childrenNodes = sortedChildren;
    };

    searchChildren = (name) => {
      const child = Object.entries(this.childrenNodes).find(
        ([key]) => key === name
      );

      if (child?.[1]) return child[1];

      let foundChild;
      Object.keys(this.childrenNodes).forEach((key) => {
        const fc = this.childrenNodes[key].searchChildren(name);
        if (fc) {
          foundChild = fc;
        }
      });

      return foundChild;
    };

    toggleChecked = () => {
      this.isChecked = !this.isChecked;
      this.updateNodes();
    };

    setParentNodesToTrue = () => {
      if (this.parentNode) {
        this.parentNode.isChecked = true;
        if (!this?.parentNode?.isChecked) {
          this.parentNode.setParentNodesToTrue();
        }
      }
    };

    updateChildrenNodes = () => {
      Object.keys(this.childrenNodes).forEach((node) => {
        this.childrenNodes[node].isChecked = this.isChecked;
        this.childrenNodes[node].updateChildrenNodes();
      });
    };

    updateNodes = () => {
      if (this.isChecked && !this.parentNode?.isChecked) {
        this.setParentNodesToTrue();
      }

      this.updateChildrenNodes();
    };
  }

  // create a node on the tree
  const createNode = (path, obj) => {
    const pathArr = path.split("/");
    let currentNode;
    pathArr.forEach((path, index) => {
      if (index === 0) {
        if (!obj[path]) {
          obj[path] = new TreeNode();
        }

        currentNode = obj[path];
      } else {
        if (!currentNode.childrenNodes[path]) {
          currentNode.addChildNode(path);
        }

        currentNode = currentNode.childrenNodes[path];
      }
    });
  };

  const createTreeObject = (paths) => {
    let obj = {};
    // create all the nodes on the tree
    paths.forEach((path) => createNode(path, obj));

    return obj;
  };

  // create tree of nodes from paths input
  const treeObject = createTreeObject(paths);

  // sort children on nodes
  const sortNodes = (node) => {
    if (node === undefined) return;

    node.sortChildren();
    Object.keys(node.childrenNodes).forEach((child) => {
      sortNodes(node.childrenNodes[child]);
    });
  };

  const sortTree = (obj) => {
    Object.keys(obj).forEach((node) => sortNodes(treeObject[node]));
  };

  sortTree(treeObject);

  // find a node
  const searchTree = (name, obj) => {
    const rootEntry = Object.entries(obj).find(([key]) => key === name);
    if (rootEntry?.[1]) return rootEntry[1];

    let foundNode;
    Object.keys(obj).forEach((node) => {
      const searchResult = treeObject[node].searchChildren(name);

      if (searchResult) {
        foundNode = searchResult;
      }
    });

    return foundNode;
  };

  // act on node
  const toggleNode = (name) => {
    const node = searchTree(name, treeObject);
    node.toggleChecked();
  };

  const executeClicks = (clicks) => {
    clicks.forEach((click) => toggleNode(click));
  };

  executeClicks(clicks);

  // print tree
  const printChildren = (node, prefix = "") => {
    const period = prefix + ".";
    let string = "";

    Object.keys(node.childrenNodes).forEach((child) => {
      string += `${period}[${
        node.childrenNodes[child].isChecked ? "o" : ""
      }]${child}\n`;
      string += printChildren(node.childrenNodes[child], period);
    });

    return string;
  };

  const printTree = (obj) => {
    let string = ``;

    Object.keys(obj).forEach((root) => {
      string += `[${obj[root].isChecked ? "o" : ""}]${root}\n`;
      string += printChildren(obj[root]);
    });

    return string;
  };

  // trim last new line
  return printTree(treeObject).slice(0, -1);
}
```
