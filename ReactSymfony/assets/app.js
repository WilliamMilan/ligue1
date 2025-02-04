import { registerReactControllerComponents } from '@symfony/ux-react';
import './bootstrap.js';
import './styles/app.css';
import './styles/menu.css';
import React from "react";
import ReactDOM from "react-dom";
import Matches from "./react/controllers/Matchdays.jsx";
import Team from "./react/controllers/Team.jsx";
import DetailMatch from "./react/controllers/DetailMatch.jsx";
import { BrowserRouter } from "react-router-dom";

console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');

registerReactControllerComponents(require.context('./react/controllers', true, /\.(j|t)sx?$/));

const elements = document.getElementsByClassName('react-match');
Array.from(elements).forEach((element) => {
    const idChampionnat = element.getAttribute('data-id-championnat');
    const gameweek = element.getAttribute('data-id-gameweek');
    ReactDOM.createRoot(element).render(
       // <React.StrictMode>
            <BrowserRouter>
                <Matches idChampionnat={idChampionnat} gameweek={gameweek} />
            </BrowserRouter>
        //</React.StrictMode>
    );
});

const element2 = document.getElementsByClassName('clubs');
Array.from(element2).forEach((element) => {
    const idChampionnat = element.getAttribute('data-id-championnat');
    const gameweek = element.getAttribute('data-id-gameweek');
    ReactDOM.createRoot(element).render(
      //  <React.StrictMode>
            <Team idChampionnat={idChampionnat} gameweek={gameweek} />
        //</React.StrictMode>
    )
})

const element3 = document.getElementsByClassName('react-match-detail');
Array.from(element3).forEach((element) => {
    const idChampionnat = element.getAttribute('data-id-championnat');
    const gameweek = element.getAttribute('data-id-gameweek');
    const idMatch = element.getAttribute('data-id-match');
    ReactDOM.createRoot(element).render(
      //  <React.StrictMode>
            <DetailMatch idChampionnat={idChampionnat} gameweek={gameweek} idMatch={idMatch} />
       // </React.StrictMode>
    )
})

document.querySelector('.selected-option').addEventListener('click', function () {
    const selectBox = document.querySelector('.custom-select');
    selectBox.classList.toggle('open');
});

const options = document.querySelectorAll('.option');
options.forEach(option => {
    option.addEventListener('click', function () {
        document.querySelector('.selected-option').textContent = this.textContent;
        document.querySelector('.custom-select').classList.remove('open');
    });
});