var input = document.getElementById("attributeName");

var inputButton = document.getElementById("submitAttribute");

var form = document.getElementById("myForm");

//enabled the Submit Button when the User types in an input 
function enableSubmitButton(event) {
    if (input.value != "") {
        inputButton.disabled = false;
    }
    else {
        inputButton.disabled = true;
    }
}
//updates tree when the value of input is one of the Keys in the Map
function updateTree() {

    if (myMap.has(input.value)) {
        var parsedTree = JSON.parse(myMap.get(input.value));
    }
    else {
        alert('Fehler, bitte gib einen gültigen Wert ein');
    }

    root = parsedTree[0];
    root.x0 = height / 2;
    root.y0 = 0;

    //Collapse after the second level 
    // root.children[0].children.forEach(collapse);

    //Collapse after the first level
    root.children.forEach(collapse);
    update(root);
    console.log(root);
}

input.addEventListener('keyup', function (event) { 
    enableSubmitButton(event);
});
form.addEventListener('submit', function (event) {
    // wieso preventDefault benötigt --> bubbling 
    event.preventDefault();
    updateTree();
});

/**
     * ---------------------------------------------------------------------
     * DO NOT MODIFY BELOW THIS LINE
     * ---------------------------------------------------------------------
    */

// ************** Generate the tree diagram	 *****************
var margin = { top: 40, right: 120, bottom: 20, left: 120 },
    width = 3000 - margin.right - margin.left,
    height = 1500 - margin.top - margin.bottom,
    paddingRight = 200,
    paddingLeft = 200;

var i = 0,
    duration = 750,
    root;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function (d) { return [d.x, d.y]; });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Collapse the node and all it's children 
function collapse(d){

    if(d.childer){
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
    }
}

function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) { d.y = d.depth * 100; });

    // Declare the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function (d) { return d.id || (d.id = ++i); })
        .style("padding-left", paddingLeft)
        .style("padding-right", paddingRight);

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
        .on("click", click);

    nodeEnter.append("circle")
        .attr("r", 10)
        .style("padding-left", paddingLeft)
        .style("padding-right", paddingRight)
        .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeEnter.append("text")
        .attr("y", function (d) {
            return d.children || d._children ? -13 : 13;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", function (d) { return d.children || d._children ? "end" : "start"; })
        .text(function (d) { return d.name; })
        .style("fill-opacity", 1e-6);
        
    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

    nodeUpdate.select("circle")
        .attr("r", 10)
        .style("padding-left", paddingLeft)
        .style("padding-right", paddingRight)
        .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });
    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Declare the links…
    var link = svg.selectAll("path.link")
        .data(links, function (d) { return d.target.id; });

    // Enter any new links at the parent's previous position.

    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function (d) {
            var o = { y: source.y0, x: source.x0 };
            return diagonal({ source: o, target: o });
        });
    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function (d) {
            var o = { y: source.y, x: source.x };
            return diagonal({ source: o, target: o });
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
        d.y0 = d.y;
        d.x0 = d.x;
    });
}

// Toggle children on click.
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
        
    }
    update(d);
}
