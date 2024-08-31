import {Court} from './Court.js';
import {Team, createNewRound} from "./Team.js";
import CompleteGraph from './Graph.js';

let teams = [];
let courts = [
    new Court(1),
    new Court(2),
    new Court(3),
    new Court(4),
    new Court(5),
    new Court(6),
];

/* Code that implements the completed graph of all the team nodes */
let graphCanvas = document.getElementById("graphOfMatches");
graphCanvas.width = graphCanvas.getBoundingClientRect().width;
graphCanvas.height = graphCanvas.getBoundingClientRect().height;
let ctx = graphCanvas.getContext("2d");
let graph;

/* Code that adds more courts */
const numOfCourtsInput = document.getElementById("numberOfCourts");
const courtsContainer = document.getElementById("CourtsBody");
numOfCourtsInput.addEventListener("change", () => {
    let numberOfCourts = parseInt(numOfCourtsInput.value);

    if(numberOfCourts < courts.length && courts.length > 1) {
        courtsContainer.removeChild(document.getElementById("court" + courts.length));
        courts.pop();
    }
    else if(numberOfCourts > courts.length) 
        courts.push(new Court(numberOfCourts));

})

/* Code that starts the rounds */
const startButton = document.getElementById("startButton");
const numberOfTeamsInput = document.getElementById("numberOfTeams");

const nextRoundBtn = document.getElementById("nextRoundButton");
const stopButton = document.getElementById("stopButton");
startButton.addEventListener("click", () => {
    const numberOfTeams = parseInt(numberOfTeamsInput.value);
    
    for(let i = 0; i < numberOfTeams; i++){
        teams.push(new Team(teams, i));
    }

    for(let i = 0; i < numberOfTeams; i++){
        teams[i].filterTeams();
    }

    let matchPairs = createNewRound(courts, teams); 

    nextRoundBtn.style.position = "relative";
    nextRoundBtn.style.visibility = "visible";
    nextRoundBtn.style.opacity = "1";
    stopButton.style.position = "relative";
    stopButton.style.visibility = "visible";
    stopButton.style.opacity = "1";

    nextRoundBtn.style.height = "35px";
    stopButton.style.height = "35px";

    startButton.disabled = 'true'
    startButton.style.cursor = "not-allowed"
    startButton.style.color = "rgba(255,255,255,0.5)";
    numberOfTeamsInput.disabled = "true";
    numberOfTeamsInput.style.cursor = "not-allowed";
    numberOfTeamsInput.style.opacity = 0.5;
    numOfCourtsInput.disabled = "true";
    numOfCourtsInput.style.cursor = "not-allowed";
    numOfCourtsInput.style.opacity = 0.5;

    /* Add the graph */
    graph = new CompleteGraph(numberOfTeams, graphCanvas.width / 2, graphCanvas.height / 2);
    graph.updateNodes(matchPairs);
    graph.drawGraph(ctx, graphCanvas);
})

/* Code that starts the next round */
const newRoundBtn = document.getElementById("nextRoundButton");
newRoundBtn.addEventListener("click", function(){
    teams.forEach(team => {
        team.isInPlay = false;
    });

    startNewRound();

})

function startNewRound(){
    let winnerButtons  = document.getElementsByClassName("winning-team-btn");
    const numberOfActiveCourts = document.querySelectorAll("[active-court='true']").length;


    if(winnerButtons.length != numberOfActiveCourts){
        loadCourtsError();
        return;
    }

    for(let i = 0; i < winnerButtons.length; i++){
        const teamIndex = winnerButtons[i].getAttribute("number");
        teams[teamIndex].wins++;
    }

    courts.forEach(court => court.removeWinnerAndLoserClasses());

    let matchPairs = createNewRound(courts, teams);
    graph.updateNodes(matchPairs);
    graph.drawGraph(ctx, graphCanvas);
}

const courtsErrorPopUp = document.getElementById("courtsErrorPopUp");
const blanket = document.getElementById("blanket");
function loadCourtsError(){
    slideDownAnimation(courtsErrorPopUp);
}

const closeCourtsErrorButton = document.getElementById("closeErrorButton");
closeCourtsErrorButton.addEventListener("click", () => {
    slideUpAnimation(courtsErrorPopUp);
})
/* Code that stops the simulations and makes the leaderboard */
const leaderBoardContainer = document.getElementById("leaderboardContainer");
const scoresListContainer = document.getElementById("scoresList");
stopButton.addEventListener("click", () => {
    teams.sort((team1, team2) => -(team1.wins - team2.wins));
    document.getElementById("goldTeam").innerText = `Team ${teams[0].id + 1}`    
    document.getElementById("silverTeam").innerText = `Team ${teams[1].id + 1}`    
    document.getElementById("bronzeTeam").innerText = `Team ${teams[2].id + 1}`    

    for(let i = 0; i < teams.length; i++){
        let teamScoreElement = document.createElement("p");
        teamScoreElement.classList.add("score");
        teamScoreElement.innerText = `Team ${teams[i].id + 1}: ${teams[i].wins}`;

        scoresListContainer.appendChild(teamScoreElement);
    }


    slideDownAnimation(leaderBoardContainer);
});

const newGameButton = document.getElementById("newGameButton");
newGameButton.addEventListener("click", () => {
    slideUpAnimation(leaderBoardContainer);
    location.reload();
});


function slideUpAnimation(container){
    blanket.style.display = "none";
    container.style.opacity = "0";
    container.style.translate = "0px -50px";

    setTimeout(function() {
        container.style.visibility = "hidden";
    }, 250);
}

function slideDownAnimation(container){
    blanket.style.display = "block";
    container.style.visibility = "visible";
    container.style.opacity = "1";
    container.style.translate = "0px 50px";
}

/* Code that styles the box shadow of the courts wrapper relative to the control panel*/
const courtsWrapper = document.getElementById("courtsWrapper");
const controlPanel = document.getElementById("controlPanel");
courtsWrapper.style.boxShadow = `${controlPanel.getBoundingClientRect().width}px 0px 10px black`
window.addEventListener("resize", function(){
    courtsWrapper.style.boxShadow = `${controlPanel.getBoundingClientRect().width}px 0px 10px black`
    graphCanvas.width = graphCanvas.getBoundingClientRect().width;
    graphCanvas.height = graphCanvas.getBoundingClientRect().height;
    graph.drawGraph(ctx, graphCanvas);
})