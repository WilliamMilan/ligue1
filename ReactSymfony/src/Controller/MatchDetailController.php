<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\Api;

class MatchDetailController extends AbstractController
{
    private $leagueService;
    
    public function __construct(Api $leagueService) {
        $this->leagueService = $leagueService;
    }
    
    #[Route('/match/detail/{matchId}', name: 'app_match_detail')]
    public function index(string $matchId): Response
    {
       $championnat = $this->leagueService->getChampionnatFromMatch($matchId);
       $gameWeekNumber = $this->leagueService->getCurrentJournee($championnat);
       
        return $this->render('match_detail/match-detail.html.twig', [
            'controller_name' => 'MatchDetailController',
            'gameweek' => $gameWeekNumber,
            'idChampionnat' => $championnat,
            'idMatch' => $matchId
        ]);
    }
}
