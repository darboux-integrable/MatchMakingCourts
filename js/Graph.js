export default class CompleteGraph{

    constructor(numberOfNodes, centerX, centerY){
        this.centerX = centerX;
        this.centerY = centerY;
        this.nodes = [];
        this.adjacencyMatrix = [];
        this.numberOfNodes = numberOfNodes;

        this.generateAllNodes(numberOfNodes);
    }

    generateAllNodes(numberOfNodes){
        const radius = 200;
        let theta = 0;

        for(let i = 0; i < numberOfNodes; i++){
            const x = Math.cos(theta) * radius + this.centerX;
            const y = Math.sin(theta) * radius + this.centerY;
           
            theta += Math.PI * 2 / numberOfNodes;

            let node = this.createNode(i+1);
            node.style.left = `${x - 20}px`
            node.style.top = `${y - 20}px`
            
            this.nodes.push(new Node(x, y, node, i));
        }

        for(let i = 0; i < numberOfNodes; i++){
            let newRow = [];
            for(let j = 0; j < numberOfNodes; j++){
                newRow.push(0);
            }
            this.adjacencyMatrix.push(newRow);
        }
    }

    updateAdjacencyMatrix(){
        for(let i = 0; i < this.adjacencyMatrix.length; i++){
            for(let j = 0; j < this.adjacencyMatrix[i].length; j++){
                if(this.adjacencyMatrix[i][j] == 1){
                    this.adjacencyMatrix[i][j] = 2;
                    this.adjacencyMatrix[j][i] = 2;
                }
            }
        }
    }

    updateNodes(edgePairs){
   
        this.updateAdjacencyMatrix();

        edgePairs.forEach(pair => {
            this.adjacencyMatrix[pair.team1][pair.team2] = 1;
            this.adjacencyMatrix[pair.team2][pair.team1] = 1;
        });

    }

    drawGraph(ctx, canvas){
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for(let i = 0; i < this.nodes.length; i++)
            this.nodes[i].drawEdges(this.nodes, this.adjacencyMatrix, ctx);
    }

    createNode(teamNumber){
        const graphAndOutput = document.getElementById("graphAndOutput");

        const nodeContainer = document.createElement("div");
        const nodeText = document.createElement("p");

        nodeText.appendChild(document.createTextNode(teamNumber));
        nodeContainer.appendChild(nodeText);

        nodeContainer.classList.add("graph-node");
        nodeText.classList.add("node-text");

        graphAndOutput.appendChild(nodeContainer);

        return nodeContainer;
    }

}

class Node{

    constructor(x, y, nodeElement, id){
        this.x = x;
        this.y = y;
        this.nodeElement = nodeElement;
        this.id = id;
    }

    drawEdges(nodes, adjacencyMatrix, ctx){

        for(let i = 0; i < nodes.length; i++){

            if(adjacencyMatrix[i][this.id] == 2)
                ctx.strokeStyle = "rgba(255,0,0,0.25)";
            else if(adjacencyMatrix[i][this.id] == 1)
                ctx.strokeStyle = "white";
            else
                ctx.strokeStyle = "rgba(255,255,255,0.2)";

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(nodes[i].x, nodes[i].y);
            ctx.closePath();
            ctx.stroke();

        }

    }

}