<?php

namespace App\Http\Services\Auth;

use App\Mail\WelcomeMail;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthService
{

    public function register($request)
    {
        $data = $request->validated();
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'] ?? 'user',
            'password' => Hash::make($data['password'])
        ]);
        Mail::to($user->email)->send(new WelcomeMail($user->name));
        return $user;
    }

    public function login($request)
    {
        $data = $request->validated();
        if (!Auth::attempt($data)) {
            throw new Exception("Unvalid email or password");
        }
        $user = User::where('email', $data['email'])->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;
        $outputData =
            [
                "user" => $user,
                "token" => $token
            ];
        return $outputData;
    }

    public function logout($request)
    {
        $request->user()->currentAccessToken()->delete();
        return true;
    }

}
