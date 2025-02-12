import { useState, useEffect } from "react";
import React from 'react';

export default function DetailMatch(props) {
    
    
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [playersHome, setPlayersHome] = useState([]);
    const [playersAway, setPlayersAway] = useState([]);
    const [scorers, setScorers] = useState(new Map());
    
    useEffect(() => {
        let intervalId;
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
        intervalId = setInterval(fetchMatch, 30000);

        return () => clearInterval(intervalId);
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
    
    function displayCards(side){
        let cardList = [0, 0]
        match.timeline.forEach((item) => {
            if (item.type === "yellowCard"){
                if (item.side === side){
                    cardList[0] += 1
                }
            }
            else if (item.type === "redCard"){
                if (item.side === side){
                    cardList[1] += 1
                }
            }
        });

        return (
            <div className="detail-cards">
                {cardList[0] > 0 && (
                        <>
                            <div className="yellow-card">
                                {cardList[0]}
                            </div>
                        </>
                    )}
                    {cardList[1] > 0 && (
                        <>
                            <div className="red-card">
                                {cardList[1]}
                            </div>
                        </>
                    )}
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
                    <span className="statut-match">MT</span>
                    <div className="infos">
                        <div className="infos-home">
                            <span className="score-match-span">{match.home.score}</span>
                            {displayCards("home")}
                        </div>
                        <div className="infos-away">
                            <span className="score-match-span">{match.away.score}</span>
                            {displayCards("away")}
                        </div>
                    </div>
                </>
            )
        } else if (match.period === "fullTime") {
            return (
                <>
                    <span className="statut-match-span">Terminé</span>
                    <div className="infos">
                        <div className="infos-home">
                            <span className="score-match-span">{match.home.score}</span>
                            {displayCards("home")}
                        </div>
                        <div className="infos-away">
                            <span className="score-match-span">{match.away.score}</span>
                            {displayCards("away")}
                        </div>
                    </div>
                </>
            )
        } else if (match.period === "secondHalf" || match.period === "firstHalf") {
            return (
                <>
                    <span className="statut-match-span">{match.matchTime}</span>
                    <div className="infos">
                        <div className="infos-home">
                            <span className="score-match-span">{match.home.score}</span>
                            {displayCards("home")}
                        </div>
                        <div className="infos-away">
                            <span className="score-match-span">{match.away.score}</span>
                            {displayCards("away")}
                        </div>
                    </div>
                </>
            )
        } else {
            return ""
        }
    }
    
    function tomate(scorerList, playerList, playerCsc, side){
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
                        
                        if (side === "home"){
                            return (
                                <li key={player}>
                                    <i className="fa-regular fa-futbol"></i> {res} {go}
                                </li>
                            )
                        } else{
                            return (
                                <li key={player}>
                                    {res} {go} <i className="fa-regular fa-futbol"></i>
                                </li>
                            )
                        }
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
                            <span>
                                {match.home.clubIdentity.shortName}
                                {match.round && match.round.type !== "playoff" && ` (${match.home.clubStanding.rank})`}
                            </span>
                        </div>
                        <div className="match-score">
                            {displayMatchTimeScore()}
                        </div>
                        <div className="match-teams">
                            <img src={match.away.clubIdentity.assets.logo.small} alt="players"/>
                            <span>
                                {match.away.clubIdentity.shortName}
                                {match.round && match.round.type !== "playoff" && ` (${match.away.clubStanding.rank})`}
                            </span>
                        </div>
                    </div>
                    <div className="line"></div>
                    <div className="scorers">
                        <div className="scorers-home">
                            {tomate(match.home.goals, playersHome, playersAway, "home")}
                        </div>
                        <div className="scorers-away">
                            {tomate(match.away.goals, playersAway, playersHome, "away")}
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