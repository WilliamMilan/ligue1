<?php

namespace App\Service;

use GuzzleHttp\Client;

class Api
{
    private $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function getTeams(int $championnat)
    {
        $urli = "https://ma-api.ligue1.fr/championship-standings/" . $championnat . "/general";
        $response = $this->client->get($urli);
        return json_decode($response->getBody(), true);
    }

    public function getCurrentJournee(int $championnat)
    {
        $urli = "https://ma-api.ligue1.fr/championship-matches/championship/" . $championnat . "/current";
        $response = $this->client->get($urli);
        return json_decode($response->getBody(), true);
    }

    public function getPreviousMatchdayStandings(int $championnat, int $matchday)
    {
        $urli = "https://ma-api.ligue1.fr/championship-standings/" . $championnat . "/general?season=2024&firstGameWeekNumber=1&lastGameWeekNumber=" . $matchday;
        $response = $this->client->get($urli);
        return json_decode($response->getBody(), true);
    }
}