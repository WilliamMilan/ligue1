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

    #[Route('/journee/{championnat}', name: 'app_journee')]
    public function index(string $championnat): Response
    {
        $journees = $this->leagueService->getCurrentJournee($championnat);

        return $this->render('journee/index.html.twig', [
            'controller_name' => 'JourneeController',
            'journees' => $journees,
        ]);
    }
}
