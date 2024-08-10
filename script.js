// Function to build a binary tree from a list of values
function buildTree(nodes) {
    if (nodes.length === 0) return null;

    let root = { name: nodes[0], children: [] };
    let queue = [root];

    for (let i = 1; i < nodes.length; i += 2) {
        let currentNode = queue.shift();
        if (nodes[i] !== "") {
            let leftChild = { name: nodes[i], children: [] };
            currentNode.children.push(leftChild);
            queue.push(leftChild);
        }
        if (i + 1 < nodes.length && nodes[i + 1] !== "") {
            let rightChild = { name: nodes[i + 1], children: [] };
            currentNode.children.push(rightChild);
            queue.push(rightChild);
        }
    }
    return root;
}

// Function to generate the tree visualization
function createTree(data) {
    d3.select("#tree-container").select("svg").remove(); // Clear previous SVG

    let margin = { top: 20, right: 90, bottom: 30, left: 90 };
    let width = 960 - margin.left - margin.right;
    let height = 500 - margin.top - margin.bottom;

    let svg = d3.select("#tree-container")
        .append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let treemap = d3.tree().size([height, width]);

    let nodes = d3.hierarchy(data);
    nodes = treemap(nodes);

    let link = svg.selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", function(d) {
            return "M" + d.y + "," + d.x
                + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                + " " + d.parent.y + "," + d.parent.x;
        });

    let node = svg.selectAll(".node")
        .data(nodes.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    node.append("circle")
        .attr("r", 10)
        .style("fill", "#fff");

    node.append("text")
        .attr("dy", ".35em")
        .attr("x", function(d) { return d.children ? -13 : 13; })
        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .text(function(d) { return d.data.name; });

    return svg;
}

// Perform tree traversal (in-order, pre-order, post-order)
function traverseTree(root) {
    let inOrder = [], preOrder = [], postOrder = [];

    function inOrderTraversal(node) {
        if (node !== null) {
            if (node.children[0]) inOrderTraversal(node.children[0]);
            inOrder.push(node.name);
            if (node.children[1]) inOrderTraversal(node.children[1]);
        }
    }

    function preOrderTraversal(node) {
        if (node !== null) {
            preOrder.push(node.name);
            if (node.children[0]) preOrderTraversal(node.children[0]);
            if (node.children[1]) preOrderTraversal(node.children[1]);
        }
    }

    function postOrderTraversal(node) {
        if (node !== null) {
            if (node.children[0]) postOrderTraversal(node.children[0]);
            if (node.children[1]) postOrderTraversal(node.children[1]);
            postOrder.push(node.name);
        }
    }

    inOrderTraversal(root);
    preOrderTraversal(root);
    postOrderTraversal(root);

    console.log("In-order traversal:", inOrder);
    console.log("Pre-order traversal:", preOrder);
    console.log("Post-order traversal:", postOrder);

    return { inOrder, preOrder, postOrder };
}

// Event listener for generating the tree from user input
document.getElementById("generate-tree").addEventListener("click", function() {
    let input = document.getElementById("node-input").value;
    let nodes = input.split(",");
    let treeData = buildTree(nodes);
    createTree(treeData);
    let traversals = traverseTree(treeData);

    // Optional: Display the traversals
    alert(`In-order: ${traversals.inOrder.join(", ")}\nPre-order: ${traversals.preOrder.join(", ")}\nPost-order: ${traversals.postOrder.join(", ")}`);
});
