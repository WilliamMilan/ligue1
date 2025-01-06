<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\Api;

class JourneeController extends AbstractController
{
    private $leagueService;

    public function __construct(Api $leagueService)
    {
        $this->leagueService = $leagueService;
    }

    #[Route('/journee/{championnat}/{gameweek}', name: 'app_journee')]
    public function index(string $championnat, int $gameweek): Response
    {
        return $this->render('journee/journee.html.twig', [
            'controller_name' => 'JourneeController',
            'idChampionnat' => $championnat,
            'gameweek' => $gameweek
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
