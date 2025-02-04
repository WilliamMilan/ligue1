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
        $data = json_decode($response->getBody()->getContents(), true);
        return $data['currentMatches'][0]['gameWeekNumber'];
    }

    public function getMaxNumberWeek($championnat)
    {
        $urli = "https://ma-api.ligue1.fr/championships-settings";
        $response = $this->client->get($urli);
        $data = json_decode($response->getBody()->getContents(), true);
        return $data['championships'][$championnat]['lastGameWeekNumber'];
    }

    public function getChampionnatFromMatch($matchId)
    {
        $urli = "https://ma-api.ligue1.fr/championship-match/" . $matchId;
        $response = $this->client->get($urli);
        $data = json_decode($response->getBody()->getContents(), true);
        return $data["championshipId"];
    }
}