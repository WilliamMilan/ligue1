<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\Api;

class HomeController extends AbstractController
{
    private $leagueService;

    public function __construct(Api $leagueService)
    {
        $this->leagueService = $leagueService;
    }

    #[Route('/', name: 'redirect_home')]
    public function redirectToHome(): Response
    {
        return $this->redirectToRoute('app_home');
    }

    #[Route('/home', name: 'app_home')]
    public function index(): Response
    {
        $idChampionnat = 1;
        $gameWeekNumber = $this->leagueService->getCurrentJournee($idChampionnat);

        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
            'idChampionnat' => $idChampionnat,
            'gameweek' => $gameWeekNumber
        ]);
    }
}
