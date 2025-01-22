import { useEffect, useState } from "react";
import React from 'react';

export default function Matches(props) {

    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let intervalId;
        const fetchMatches = async () => {
            try {
                const response = await fetch("https://ma-api.ligue1.fr/championship-matches/championship/" + props.idChampionnat + "/game-week/" + props.gameweek);
                const data = await response.json();
                setMatches(data);
            } catch (error) {
                console.error("Failed to fetch matches:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
        intervalId = setInterval(fetchMatches, 30000);

        return () => clearInterval(intervalId);
    }, [props.idChampionnat]);

    function displayScore(match) {
        const date = new Date(match.date)
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        if (match.period === "preMatch" || match.period === "preMatchWithPlayers") {
            return <span>{hours}h{minutes}</span>
        } else if (match.period !== "fullTime") {
            return <div>
                <span>{match.home.score} - {match.away.score}</span>
                <span className="match-time">{match.matchTime}</span>
            </div>
        } else {
            return <span>{match.home.score} - {match.away.score}</span>
        }
    }

    function displayMatch(match) {
        const date = new Date(match.date);
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayOfWeek = daysOfWeek[date.getDay()];
        return (
            <div key={match.matchId} className="match">
                <div className="name-team">{match.home.clubIdentity.shortName}</div>
                <div className="image-team"><img
                    className="logo"
                    src={match.home.clubIdentity.assets.logo.small}
                /></div>
                <div className={`score-team ${match.isLive ? "reed" : ""}`}>{displayScore(match)}</div>
                <div className="image-team"><img
                    className="logo"
                    src={match.away.clubIdentity.assets.logo.small}
                /></div>
                <div className="name-team">{match.away.clubIdentity.shortName}</div>
            </div>
        )
    }

    if (loading) {
        return <div>Loading ...</div>;
    }

    function groupMatchesByDate(matches) {
        return matches.reduce((acc, match) => {
            const date = new Date(match.date);
            const dateString = date.toISOString().split("T")[0];
            if (!acc[dateString]) {
                acc[dateString] = [];
            }
            acc[dateString].push(match);
            return acc;
        }, {});
    }

    function displayDate(date) {
        const datee = new Date(date)
        const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        const monthes = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
        const dayName = daysOfWeek[datee.getDay()];
        const month = monthes[datee.getMonth()]
        const dayDate = datee.getDate()
        const year = datee.getFullYear()
        return <span>{dayName} {dayDate} {month} {year}</span>
    }

    const groupedMatches = groupMatchesByDate(matches["matches"]);

    return (
        <div className="matches">
            {Object.keys(groupedMatches).map((date) => (
                <div key={date} className="match-list">
                    <div className="date">{displayDate(date)}</div>
                    <div className="match-list-content">
                        {groupedMatches[date].map((match) => displayMatch(match))}
                    </div>
                </div>
            ))}
        </div>
    );
}
