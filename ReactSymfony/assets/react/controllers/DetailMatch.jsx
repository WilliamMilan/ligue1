import { useState, useEffect } from "react";
import React from 'react';

export default function DetailMatch(props) {
    
    
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [playersHome, setPlayersHome] = useState([]);
    const [playersAway, setPlayersAway] = useState([]);
    const [scorers, setScorers] = useState(new Map());
    
    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const response = await fetch("https://ma-api.ligue1.fr/championship-match/" + props.idMatch)
                const data = await response.json();
                setMatch(data);
                setPlayersHome(data.home.players);
                setPlayersAway(data.away.players);
            } catch (error) {
                console.log("Failed to fetch match : ", error);
            } finally {
                setLoading(false)
            }
        }
   
        fetchMatch()
    }, [props.idMatch])
    
    useEffect(() => {
        const lesScorers = () => {
            if (match !== null) {
                const res = new Map()
                Object.keys(match.home.goals).map((goalKey) => {
                    const scorerId = match.home.goals[goalKey].scorerId;
                    const time = match.home.goals[goalKey].time
                    const typeGoal = match.home.goals[goalKey].type
                    
                    if (res.has(scorerId)){
                        res.get(scorerId).push([time, typeGoal])
                    } else {
                        res.set(scorerId, [[time, typeGoal]])
                    }
                })
                Object.keys(match.away.goals).map((goalKey) => {
                    const scorerId = match.away.goals[goalKey].scorerId;
                    const time = match.away.goals[goalKey].time
                    const typeGoal = match.away.goals[goalKey].type

                    if (res.has(scorerId)){
                        res.get(scorerId).push([time, typeGoal])
                    } else {
                        res.set(scorerId, [[time, typeGoal]])
                    }
                })
                setScorers(res);
            }
        };
        
        if (match !== null && match.period !== "preMatch" && match.period !== "preMatchWithPlayers") {
            lesScorers();
        }
    }, [match]);

    if (loading) {
        return <div>Loading ...</div>;
    }
    function displayCards(){
        let cardsHome = [0, 0]
        let cardsAway = [0, 0]
        match.timeline.forEach((item) => {
            if (item.type === "yellowCard"){
                if (item.side === "home"){
                    cardsHome[0] += 1
                }
                else{
                    cardsAway[0] += 1
                }
            }
            else if (item.type === "redCard"){
                if (item.side === "home"){
                    cardsHome[1] += 1
                }
                else{
                    cardsAway[1] += 1
                }
            }
        });
        console.log(cardsHome)
        console.log(cardsAway)

        return (
            <div className="detail-cards">
                <div className="cards-home">
                    {cardsHome[0] > 0 && (
                        <>
                            <span>{cardsHome[0]}</span>
                            <div>jaune</div>
                        </>
                    )}
                    {cardsHome[1] > 0 && (
                        <>
                            <span>{cardsHome[1]}</span>
                            <div>rouge</div>
                        </>
                    )}
                </div>
                <div className="cards-away">
                    {cardsAway[0] > 0 && (
                        <>
                            <span>{cardsAway[0]}</span>
                            <div>jaune</div>
                        </>
                    )}
                    {cardsAway[1] > 0 && (
                        <>
                            <span>{cardsAway[1]}</span>
                            <div>rouge</div>
                        </>
                    )}
                </div>
            </div>
        );
    }
    
    function displayMatchTimeScore(){
        const date = new Date(match.date)
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        if (match.period === "preMatch" || match.period === "preMatchWithPlayers") {
            return <span>{hours}h{minutes}</span>
        } else if (match.period === "halfTime"){
            return (
                <>
                    <span>MT</span>
                    <span>{match.home.score} - {match.away.score}</span>
                </>
            )
        } else if (match.period === "fullTime") {
            return (
                <>
                    <span>Terminé</span>
                    <span>{match.home.score} - {match.away.score}</span>
                </>
            )
        } else {
            return ""
        }
    }
    
    function tomate(scorerList, playerList, playerCsc){
        return(
            <ul>
                {Array.from(scorers).map(([player, goals]) => {
                    const playerEvents = scorerList.some(obj => obj.scorerId === player);
                    if (playerEvents) {
                        let res = ""
                        if (playerList.hasOwnProperty(player)) {
                            let firstName = playerList[player].playerIdentity.firstName || "";
                            let lastName = playerList[player].playerIdentity.lastName || "";
                            res = (firstName ? firstName[0] + ". " : "") + lastName;
                        } else {
                            let firstName = playerCsc[player].playerIdentity.firstName || "";
                            let lastName = playerCsc[player].playerIdentity.lastName || "";
                            res = (firstName ? firstName[0] + ". " : "") + lastName;
                        }

                        const go = `(${goals
                            .map(goal => goal[0] + (goal[1] === "goal" ? "" : (goal[1] === "penalty" ? " PEN" : (goal[1] === "own" ? " CSC" : ""))))
                            .join(', ')})`;
                        
                        return (
                            <li key={player}>
                                {res} {go}
                            </li>
                        )
                    } 
                })}
            </ul>
        )
    }
    
    function displayScoreMatchDetail(){
        return (
            <div className="match-detail-content">
                    <div className="detail-score">
                        <div className="match-teams">
                            <img src={match.home.clubIdentity.assets.logo.small} alt="players"/>
                            <span>{match.home.clubIdentity.shortName} ( {match.home.clubStanding.rank} )</span>
                        </div>
                        <div className="match-score">
                            {displayMatchTimeScore()}
                            {displayCards()}
                        </div>
                        <div className="match-teams">
                            <img src={match.away.clubIdentity.assets.logo.small} alt="players"/>
                            <span>{match.away.clubIdentity.shortName} ( {match.away.clubStanding.rank} )</span>
                        </div>
                    </div>
                    <div className="scorers">
                        <div className="scorers-home">
                            {tomate(match.home.goals, playersHome, playersAway)}
                        </div>
                        <div className="scorers-away">
                            {tomate(match.away.goals, playersAway, playersHome)}
                        </div>
                    </div>
            </div>
        )
    }

    return (
        <div className="match-detail">
            {displayScoreMatchDetail()}
        </div>
    )
}