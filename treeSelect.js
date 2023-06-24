const assert = require("assert");

/*
 * Complete the 'renderTreeSelect' function below.
 *
 * The function is expected to return a STRING.
 * The function accepts following parameters:
 *  1. STRING_ARRAY paths
 *  2. STRING_ARRAY clicks
 */

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

const paths = ["A/B/F", "A/B/D", "A/B/E", "A/C", "X/Y", "X/Z"];
const clicks = ["A", "B", "D", "E"];

const treeSelect = renderTreeSelect(paths, clicks);

const test = `[o]A
.[o]B
..[o]D
..[o]E
..[]F
.[o]C
[]X
.[]Y
.[]Z`;

assert.strictEqual(treeSelect, test, "Expect the strings to be thesame");
