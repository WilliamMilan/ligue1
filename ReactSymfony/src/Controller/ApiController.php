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

    #[Route('/api', name: 'app_api')]
    public function index(): Response
    {
        $teams = $this->leagueService->getTeams();

        return $this->render('api/index.html.twig', [
            'controller_name' => 'ApiController',
            'teams' => $teams
        ]);
    }
}
