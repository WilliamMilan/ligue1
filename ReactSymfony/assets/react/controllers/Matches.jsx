import { useEffect, useState } from "react";
import React from 'react';

export default function Matches(props) {

    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    }, [props.idChampionnat]);    

    if (loading) {
        return <div>Loading ...</div>;
    }

    return (
        <div className="matchs">
            {matches["matches"].map((match) => (
                <div key={match.matchId} className={`match ${match.isLive ? "reed" : ""}`}>
                    <img
                        className="logo"
                        src={match.home.clubIdentity.assets.logo.small}
                        alt={`${match.home.clubIdentity.name} logo`}
                    />
                    {match.home.score} - {match.away.score}
                    <img
                        className="logo"
                        src={match.away.clubIdentity.assets.logo.small}
                        alt={`${match.away.clubIdentity.name} logo`}
                    />
                    {match.matchTime}
                </div>
            ))}
        </div>
    );
}
