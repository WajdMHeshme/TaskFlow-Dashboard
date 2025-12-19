<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\RegisterUserResource;
use App\Http\Services\Auth\AuthService;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;


class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request)
    {
        $data = $this->authService->register($request);

        return response()->json([
            'message' => 'User Registered successfuly',
            'data' => [
                'user' => new RegisterUserResource($data['user']), // فقط الـ user
                'token' => $data['token'],
            ]
        ], 201);
    }


    public function login(LoginRequest $request)
    {
        $data = $this->authService->login($request);
        return response()->json([
            "message" => "login successfuly",
            "data" => $data
        ]);
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request);
        return response()->json([
            'message' => "logout successfuly"
        ]);
    }
}
