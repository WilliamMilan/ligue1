import React from 'react';

export default function Matches(props) {

    return (
        <div className="matchs">
            {props.match.isLive ? (
                <div className="match reed">
                    <img
                    className="logo"
                    src={props.match.home.clubIdentity.assets.logo.small}
                    alt={`${props.match.home.clubIdentity.name} logo`}/>

                    {props.match.home.score} - {props.match.away.score}

                    <img
                        className="logo"
                        src={props.match.away.clubIdentity.assets.logo.small}
                        alt={`${props.match.away.clubIdentity.name} logo`}
                    />
                </div>
            ) : (
                <div className="match">
                    <img
                    className="logo"
                    src={props.match.home.clubIdentity.assets.logo.small}
                    alt={`${props.match.home.clubIdentity.name} logo`}/>

                    {props.match.home.score} - {props.match.away.score}

                    <img
                        className="logo"
                        src={props.match.away.clubIdentity.assets.logo.small}
                        alt={`${props.match.away.clubIdentity.name} logo`}
                    />
                </div>
            )}
        </div>
    );
}
