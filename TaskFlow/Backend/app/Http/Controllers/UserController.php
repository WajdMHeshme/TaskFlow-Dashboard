<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Http\Services\Users\UsersService;


class UserController extends Controller
{
    protected $usersService;
    public function __construct(UsersService $usersService)
    {
        $this->usersService = $usersService;
    }
    public function getTasksUser($id)
    {
        $user = $this->usersService->getTasksUser($id);
        return response()->json($user);
    }
    public function getAuthUser()
    {
        $user = $this->usersService->getAuthUser();
        return new UserResource($user);
    }
}
