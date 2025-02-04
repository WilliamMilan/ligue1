<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\Api;

class ClassementController extends AbstractController
{
    private $leagueService;

    public function __construct(Api $leagueService)
    {
        $this->leagueService = $leagueService;
    }

    #[Route('/classement/{championnat}', name: 'app_classement')]
    public function index(string $championnat): Response
    {
       $gameWeekNumber = $this->leagueService->getCurrentJournee($championnat);
        
        return $this->render('classement/classement.html.twig', [
            'controller_name' => 'ClassementController',
            'gameweek' => $gameWeekNumber,
            'idChampionnat' => $championnat,
        ]);
    }
}
