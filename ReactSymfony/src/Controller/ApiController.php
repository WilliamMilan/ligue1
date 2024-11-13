<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\Api;

class ApiController extends AbstractController
{
    private $leagueService;

    public function __construct(Api $leagueService)
    {
        $this->leagueService = $leagueService;
    }

    #[Route('/api/{championnat}', name: 'app_api')]
    public function index(string $championnat): Response
    {
        $teams = $this->leagueService->getTeams($championnat);
        $journees = $this->leagueService->getCurrentJournee($championnat);
        $gameWeekNumber = $journees['currentMatches'][0]['gameWeekNumber'];
        $previousClassement = $this->leagueService->getPreviousMatchdayStandings($championnat, $gameWeekNumber-1);
        $idChampionnat = $journees['currentMatches'][0]['championshipId'];

        return $this->render('api/index.html.twig', [
            'controller_name' => 'ApiController',
            'teams' => $teams,
            'journees' => $journees,
            'weekNumber' => $gameWeekNumber,
            'previousClassement' => $previousClassement['standings'],
            'idChampionnat' => $idChampionnat,
        ]);
    }
}
