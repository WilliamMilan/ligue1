# Football League API Symfony/React Project

This project is a small application for visualizing a football league's, using **Symfony** for the backend (fetch data of API) and **React** for the frontend (adapt to have reactives components). The application fetches data from an external API, the official API of ma-api.ligue1.fr, which is totally free-access.

## Technologies

- **Symfony** (Backend)
  - RESTful API to fetch football league data.
  - Twig for template rendering.
- **React** (Frontend)
  - Dynamic rendering of league standings and match results.
  - Component-based architecture.
- **API**: The project integrates with a football data API (replace this with the name of the actual API used).

## Installation

Before starting, make sure you have installed the following:
- **npm**
- **Symfony**
- **Composer**

### Step to run the project

- Clone the project ```git clone git@github.com:WilliamMilan/ligue1.git```
- Navigate to the directory ```ReactSymfony```
- Install backend dependencies ```composer install``` and the frontend dependencies ```npm install```
- Run the symfony server ```symfony server -d```
- Go to 127.0.0.1:8000

To make modifications :

- For production builds : ```npm run build```
- For development with hot-reloading : ```npm run watch```

This will allow you to see changes live as you modify the frontend components.

## Todo

Here are the upcoming features planned for this project :

- Match details per game week.
- Detailed match recaps, including stats, lineups, and more.
- Additional features to be added over time.
