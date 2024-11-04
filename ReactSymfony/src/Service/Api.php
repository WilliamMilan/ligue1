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

    public function getTeams()
    {
        $urli = "https://ma-api.ligue1.fr/championship-standings/1/general";
        $response = $this->client->get($urli);
        return json_decode($response->getBody(), true);
    }

    public function getJourney(int $nb)
    {
        $urli = "https://ma-api.ligue1.fr/championship-matches/championship/1/game-week/" . $nb;
        $response = $this->client->get($urli);
        return json_decode($response->getBody(), true);
    }
}