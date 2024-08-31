
class Court {
  constructor(courtNumber) {
    this.courtNumber = courtNumber;
    this.firstTeamBtn;
    this.secondTeamBtn;
    this.matchDisplay;
    this.courtContainer;
    this.createNewCourtHTML(this.courtNumber);
    this.team1 = 0;
    this.team2 = 0;
  }

  createNewCourtHTML(courtNumber) {
    const courtContainer = document.getElementById("CourtsBody");

    const courtDiv = document.createElement("div");
    const courtTitle = document.createElement("h1");
    const teamsPlayingDisplay = document.createElement("p");
    const winnerLabel = document.createElement("p");
    const winnerButtonsContainer = document.createElement("div");
    const team1Button = document.createElement("button");
    const team2Button = document.createElement("button");

    courtDiv.classList.add("court");
    courtDiv.id = `court${courtNumber}`;

    courtTitle.classList.add("court-title");
    courtTitle.innerText = `Court ${courtNumber}`;
    
    teamsPlayingDisplay.classList.add("teams-playing-display");
    teamsPlayingDisplay.id=`teamsPlayingDisplay${courtNumber}`
    teamsPlayingDisplay.innerHTML = " <br>EMPTY COURT<br> <br>";

    winnerLabel.classList.add("winner-label");
    winnerLabel.innerText = "Winner"

    winnerButtonsContainer.classList.add("winner-buttons");

    team1Button.classList.add("team-win-button");
    team1Button.classList.add("team-win-1");
    team1Button.classList.add("not-active-team-btn");
    team1Button.id = `firstTeamWonBtn${courtNumber}`
    team1Button.innerText = "Team 1";
    team1Button.setAttribute("number", this.team1);
    team1Button.disabled = true;

    team2Button.classList.add("team-win-button");
    team2Button.classList.add("team-win-2");
    team2Button.classList.add("not-active-team-btn");
    team2Button.id = `secondTeamWonBtn${courtNumber}`
    team2Button.innerText = "Team 2";
    team2Button.setAttribute("number", this.team2);
    team2Button.disabled = true;

    courtDiv.appendChild(courtTitle);
    courtDiv.appendChild(teamsPlayingDisplay)
    courtDiv.appendChild(winnerLabel);
    winnerButtonsContainer.appendChild(team1Button);
    winnerButtonsContainer.appendChild(team2Button);
    courtDiv.appendChild(winnerButtonsContainer);

    courtContainer.appendChild(courtDiv);

    this.firstTeamBtn = document.getElementById(`firstTeamWonBtn${this.courtNumber}`);
    this.secondTeamBtn = document.getElementById(`secondTeamWonBtn${this.courtNumber}`);
    this.matchDisplay = document.getElementById(`teamsPlayingDisplay${this.courtNumber}`);
    this.courtContainer = document.getElementById(`court${this.courtNumber}`)

    this.updateWinner();

  }

  updateWinner(){
    let winnerButtons = [this.firstTeamBtn, this.secondTeamBtn];

    for(let i = 0; i < winnerButtons.length; i++){
      winnerButtons[i].addEventListener("click", () => {
        this.removeWinnerAndLoserClasses();
        winnerButtons[i].classList.add("winning-team-btn");
        winnerButtons[(i + 1)%2].classList.add("losing-team-btn");
      })
    }
  }

  updateTeams(newTeam1Number, newTeam2Number) {
    this.team1 = newTeam1Number;
    this.team2 = newTeam2Number;
    this.firstTeamBtn.innerHTML = `Team ${newTeam1Number+1}`;
    this.secondTeamBtn.innerHTML = `Team ${newTeam2Number+1}`;
    this.matchDisplay.innerHTML = `Team ${newTeam1Number+1} <br/> VS.<br/> Team ${newTeam2Number+1}`;

    this.firstTeamBtn.setAttribute("number", this.team1);
    this.secondTeamBtn.setAttribute("number", this.team2);

    this.firstTeamBtn.disabled = false;
    this.secondTeamBtn.disabled = false;

    this.firstTeamBtn.classList.remove("not-active-team-btn");  
    this.secondTeamBtn.classList.remove("not-active-team-btn");  
  }

  removeWinnerAndLoserClasses(){
    this.firstTeamBtn.classList.remove("winning-team-btn");
    this.firstTeamBtn.classList.remove("losing-team-btn");
    this.secondTeamBtn.classList.remove("losing-team-btn");
    this.secondTeamBtn.classList.remove("winning-team-btn");
  }

  emptyCourt() {
    this.firstTeamBtn.classList.add("not-active-team-btn");
    this.secondTeamBtn.classList.add("not-active-team-btn");
    this.matchDisplay.innerHTML = "EMPTY COURT";
  }
}

export { Court };
