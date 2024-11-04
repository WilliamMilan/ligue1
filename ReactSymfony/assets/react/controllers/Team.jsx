import React from 'react';

export default function Team(props) {

    function prestationMatches(result){
        const teamm = props.team.clubIdentity.officialName
        const teamAgainstId = result.opponentClubId
        let teamAgainst = ""

        let index = 1
        for(const _ in props.allTeams.standings){
            const id = props.allTeams.standings[index].clubId;
            if(id === teamAgainstId){
                teamAgainst = props.allTeams.standings[index].clubIdentity.officialName;
                break;
            }
            index++
        }

        if(result.side === "home"){
            let sc = teamm + " " + result.score.home + "-" +result.score.away + " " + teamAgainst
            return <div className="latch"><strong>{sc}</strong></div>
        }else{
            let sc = teamAgainst + " " + result.score.home + "-" +result.score.away + " " + teamm
            return <div className="latch"><strong>{sc}</strong></div>
        }
    }

    function results(result, index) {
        if (result.resultLetter === 'w') {
            return <div key={index} className="result-letter green">{prestationMatches(result)}</div>;
        } else if (result.resultLetter === 'd') {
            return <div key={index} className="result-letter grey">{prestationMatches(result)}</div>;
        } else {
            return <div key={index} className="result-letter red">{prestationMatches(result)}</div>;
        }
    }

    return (
        <div className="team-card">
            <div className="club-info">
                <div className="rank">{props.team.rank}</div>
                <img
                    className="logo"
                    src={props.team.clubIdentity.assets.logo.small}
                    alt={`${props.team.clubIdentity.name} logo`}
                />
                <strong className="team-name">{props.team.clubIdentity.officialName}</strong>
            </div>
            <div className="points-info">
                <p className="played text-gray-500">{props.team.played}</p>
                <p className="points text-gray-500"><strong>{props.team.points}</strong></p>
                <p className="wins text-gray-500">{props.team.wins}</p>
                <p className="draws text-gray-500">{props.team.draws}</p>
                <p className="losses text-gray-500">{props.team.losses}</p>
                <p className="goal-difference text-gray-500">{props.team.goalsDifference}</p>
                <p className="goal-for text-gray-500">{props.team.forGoals}</p>
                <p className="goal-against text-gray-500">{props.team.againstGoals}</p>
                
            </div>
            <div className="recent-results">
                {props.team.seasonResults.slice(-5).map((result, index) => (
                    results(result, index)
                ))}
            </div>
        </div>
    );
}
