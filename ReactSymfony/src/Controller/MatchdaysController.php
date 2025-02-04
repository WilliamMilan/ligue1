<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\Api;

class MatchdaysController extends AbstractController
{
    private $leagueService;

    public function __construct(Api $leagueService)
    {
        $this->leagueService = $leagueService;
    }

    #[Route('/journee/{championnat}/{gameweek}', name: 'app_journee')]
    public function index(string $championnat, string $gameweek): Response
    {
        $maxNumberWeek = $this->leagueService->getMaxNumberWeek($championnat);
        
        $phases = [
            9 => "Barrage (aller)",
            10 => 'Barrage (retour)',
            11 => '8ème de finale (aller)',
            12 => '8ème de finale (retour)',
            13 => 'Quarts de finale (aller)',
            14 => 'Quarts de finale (retour)',
            15 => 'Demi finale (aller)',
            16 => 'Demi finale (retour)',
            17 => 'Finale'
        ];
        
        $selectedLabel = (($championnat == 6 || $championnat == 13) && array_key_exists($gameweek, $phases))
                    ? $phases[$gameweek]
                    : "Journée $gameweek";

        return $this->render('matchdays/matchdays.html.twig', [
            'controller_name' => 'MatchdaysController',
            'idChampionnat' => $championnat,
            'gameweek' => $gameweek,
            'maxWeek' => $maxNumberWeek,
            'phases' => $phases,
            'selectedLabel' => $selectedLabel
        ]);
    }

    #[Route('/journee/{championnat}', name: 'app_journee_actual')]
    public function getActualFromChampionnat(string $championnat): Response
    {
        $gameWeekNumber = $this->leagueService->getCurrentJournee($championnat);

        return $this->redirectToRoute("app_journee", [
            'championnat' => $championnat,
            'gameweek' => $gameWeekNumber
        ]);
    }

    #[Route('/journee/before/{championnat}/{gameweek}', name: 'app_journee_before')]
    public function before(string $championnat, int $gameweek): Response
    {
        $before = $gameweek - 1;

        return $this->redirectToRoute("app_journee", [
            'championnat' => $championnat,
            'gameweek' => $before
        ]);
    }

    #[Route('/journee/after/{championnat}/{gameweek}', name: 'app_journee_after')]
    public function after(string $championnat, int $gameweek): Response
    {
        $after = $gameweek + 1;

        return $this->redirectToRoute("app_journee", [
            'championnat' => $championnat,
            'gameweek' => $after
        ]);
    }
}
