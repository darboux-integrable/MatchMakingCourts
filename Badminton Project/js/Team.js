class Team {
  constructor(teams, id) {
    this.wins = 0;
    this.isInPlay = false;
    this.id = id;
    this.teams = teams;
    this.playedTeams = [];
    this.teamsNotPlayed;
  }

  filterTeams() {
    this.teamsNotPlayed = this.teams.filter(
      (team) => !this.playedTeams.includes(team) && team.id != this.id
    );
  }

}

function createNewRound(courts, teams) {

  // Create clone array of the teams and courts so they can be modified without changing the orignial array.
  let activeCourts = courts.map(court => court);
  let teamsOutOfPlay = teams.map(team => team);

  let unFilledCourts = activeCourts.length;

  let matchPairs = [];

  let i = 0;
  while( i < unFilledCourts && teamsOutOfPlay.length  >= 2){
    i++;
    // Select Team with least wins
    let team1 = getTeamWithLeastWins(teamsOutOfPlay);

    // Get the list of teams that are not in play, and that team 1 has not played
    let remainingUnplayedTeams = team1.teamsNotPlayed.filter(
      (team) => !team.isInPlay
    );

    // Get the list of all teams that are not in play. 
    let allOtherTeams = teams.filter(
      (team) => team.id != team1.id && !team.isInPlay
    );

    // Find Team with the least wins other than the current team. 
    // First look if there are any more teams that team 1 has not played. 
    // If yes, then match team 1 with the team that that have not played with the least wins and is not currently in play.
    // If no, then match team 1 with the team that has the least wins and that is not currently in play. 
    let team2 =
      remainingUnplayedTeams.length > 0
        ? getTeamWithLeastWins(remainingUnplayedTeams)
        : getTeamWithLeastWins(allOtherTeams);

    console.log(team1, team2);

    // Add those teams to the next available court. 
    activeCourts[0].updateTeams(team1.id, team2.id);
    activeCourts[0].courtContainer.setAttribute("active-court", 'true');
    activeCourts.shift();

    // Place team 1 and team 2 in play so that they cannot be selected again.
    team1.isInPlay = true;
    team2.isInPlay = true;

    team1.playedTeams.push(team2);
    team2.playedTeams.push(team1);
    team1.filterTeams();
    team2.filterTeams();

    // remove the two teams from the teamsOutOfPlay list so they cannot be selected again.
    teamsOutOfPlay.splice(teamsOutOfPlay.indexOf(team1), 1);
    teamsOutOfPlay.splice(teamsOutOfPlay.indexOf(team2), 1);

    // Add the match pair to the list of all match pairs
    matchPairs.push({team1: team1.id, team2: team2.id});
  }

  // Any extra teams will be benched.
  console.log("\n//////////////////////////////////////////////////////////\n")
  
  createBenchedTeams(teamsOutOfPlay);
  return matchPairs;
}

function createBenchedTeams(leftOverTeams){

  const benchedTeams = document.getElementById("benchedTeams");

  while(benchedTeams.hasChildNodes())
    benchedTeams.removeChild(benchedTeams.firstChild);
  

  if(leftOverTeams.length == 0){
    // No teams were benched
    const noLeftOverTeamsTitle = document.createElement("h1");
    noLeftOverTeamsTitle.classList.add("no-benched-teams-title");
    noLeftOverTeamsTitle.innerText = "NO BENCHED TEAMS";
    benchedTeams.appendChild(noLeftOverTeamsTitle);

  } else {

    for(let i = 0; i < leftOverTeams.length; i++){
      const benchedTeam = document.createElement("div");
      const benchedTeamName = document.createElement("h3");
  
      benchedTeam.classList.add("benched-team");
      benchedTeamName.classList.add("benched-team-name");

      benchedTeamName.innerText = "Team " + (leftOverTeams[i].id + 1);
      benchedTeam.appendChild(benchedTeamName); 

      benchedTeams.appendChild(benchedTeam);
    }

  }

}

function getTeamWithLeastWins(teams) {
  let team1 = teams[0];
  for (let i = 1; i < teams.length; i++) {
    if (team1.wins > teams[i].wins) team1 = teams[i];
  }

  return team1;
}

export { Team, createNewRound };
