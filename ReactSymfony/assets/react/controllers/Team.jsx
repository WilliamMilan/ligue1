import { useEffect, useState } from "react";
import React from 'react';

export default function Team(props) {

    const [classement, setClassement] = useState([])
    const [classementBefore, setClassementBefore] = useState([])

    useEffect(() => {
        const fetchClassement = async () => {
            try {
                const journeeBefore = props.gameweek - 1

                const response = await fetch("https://ma-api.ligue1.fr/championship-standings/" + props.idChampionnat + "/general");
                const response2 = await fetch("https://ma-api.ligue1.fr/championship-standings/" + props.idChampionnat + "/general?season=2024&firstGameWeekNumber=1&lastGameWeekNumber=" + journeeBefore);

                const data = await response.json();
                const data2 = await response2.json();

                setClassement(data);
                setClassementBefore(data2);
            } catch (error) {
                console.error("Failed to fetch classement:", error);
            }
        };

        fetchClassement();
    }, [props.idChampionnat, props.gameweek]);

    function prestationMatches(result, team) {
        const teamm = team["clubIdentity"]["officialName"]
        const teamAgainstId = result["opponentClubId"]
        let teamAgainst = ""
        let index = 1

        Object.keys(classement.standings).map(key => {
            const club = classement.standings[key];
            if (club["clubId"] === teamAgainstId) {
                teamAgainst = classement.standings[index].clubIdentity.officialName;
                return true
            }
            index++;
        });

        if (result["side"] === "home") {
            let sc = teamm + " " + result["score"]["home"] + "-" + result["score"]["away"] + " " + teamAgainst
            return <div className="latch"><strong>{sc}</strong></div>
        } else {
            let sc = teamAgainst + " " + result["score"]["home"] + "-" + result["score"]["away"] + " " + teamm
            return <div className="latch"><strong>{sc}</strong></div>
        }
    }

    function results(result, index, team) {
        if (result["resultLetter"] === 'w') {
            return <div key={index} className="result-letter green">{prestationMatches(result, team)}</div>;
        } else if (result["resultLetter"] === 'd') {
            return <div key={index} className="result-letter grey">{prestationMatches(result, team)}</div>;
        } else {
            return <div key={index} className="result-letter red">{prestationMatches(result, team)}</div>;
        }
    }

    function tomate(team) {
        let before = []
        let after = []

        if (classementBefore.standings) {
            Object.keys(classementBefore.standings).map(key => {
                const club = classementBefore.standings[key];
                before.push(club["clubIdentity"]["name"])
            });
        } else {
            console.log("chais pas frr");
        }

        if (classement.standings) {
            Object.keys(classement.standings).map(key => {
                const club = classement.standings[key];
                after.push(club["clubIdentity"]["name"])
            });
        } else {
            console.log("chais pas frr");
        }

        const equipe = team["clubIdentity"]["name"]
        const placesPrises = before.indexOf(equipe) - after.indexOf(equipe)

        if (placesPrises > 0) {
            return <><div className="plus"></div><div className="places_prises">{Math.abs(placesPrises)}</div></>
        } else if (placesPrises < 0) {
            return <><div className="places_prises">{Math.abs(placesPrises)}</div><div className="moins"></div></>
        } else {
            return "-"
        }
    }

    function divisionQualification(team) {
        if (props.idChampionnat == 6 || props.idChampionnat == 13) {
            if (team["rank"] <= 8) {
                return 'border-bottom-team-blue';
            } else if (team["rank"] > 8 && team["rank"] <= 24) {
                return 'border-bottom-team-orangered';
            }
        } else if (props.idChampionnat == 1) {
            if (team["rank"] <= 3) {
                return 'border-bottom-team-blue';
            } else if (team["rank"] == 4) {
                return 'border-bottom-team-orangered';
            } else if (team["rank"] == 5) {
                return 'border-bottom-team-green';
            } else if (team["rank"] == 6) {
                return 'border-bottom-team-cyan';
            } else if (team["rank"] == 16) {
                return 'border-bottom-team-orange';
            } else if (team["rank"] >= 17) {
                return 'border-bottom-team-red';
            }
        } else if (props.idChampionnat == 4) {
            if (team["rank"] <= 2) {
                return 'border-bottom-team-blue';
            } else if (team["rank"] > 2 && team["rank"] <= 5) {
                return 'border-bottom-team-green';
            } else if (team["rank"] == 16) {
                return 'border-bottom-team-orange';
            } else if (team["rank"] >= 17) {
                return 'border-bottom-team-red';
            }
        } else {
            return '';
        }
    }

    function showTeams() {
        if (classement.standings) {
            return Object.keys(classement.standings).map(key => {
                const club = classement.standings[key];
                return (
                    <div key={club.clubId} className={`team-card ${divisionQualification(club)}`}>
                        <div className="evolution">
                            {tomate(club)}
                        </div>
                        <div className="club-info">
                            <div className="rank">{club["rank"]}</div>
                            <img
                                className="logo"
                                src={club["clubIdentity"]["assets"]["logo"]["small"]}
                                alt={`${club["clubIdentity"]["name"]} logo`}
                            />
                            <strong className="team-name">{club["clubIdentity"]["officialName"]}</strong>
                        </div>
                        <div className="points-info">
                            <p className="played text-gray-500">{club["played"]}</p>
                            <p className="points text-gray-500"><strong>{club["points"]}</strong></p>
                            <p className="wins text-gray-500">{club["wins"]}</p>
                            <p className="draws text-gray-500">{club["draws"]}</p>
                            <p className="losses text-gray-500">{club["losses"]}</p>
                            <p className="goal-for text-gray-500">{club["forGoals"]}</p>
                            <p className="goal-against text-gray-500">{club["againstGoals"]}</p>
                            <p className="goal-difference text-gray-500">{club["goalsDifference"]}</p>
                        </div>
                        <div className="recent-results">
                            {club["seasonResults"].slice(-5).map((result, index) => (
                                results(result, index, club)
                            ))}
                        </div>
                    </div>
                );
            });
        }
    }

    return (
        <div className="allClubs">
            {showTeams()}
        </div>
    );
}
