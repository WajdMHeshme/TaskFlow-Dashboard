<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProfileRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\ProfileResource;
use App\Http\Services\Profiles\ProfilesService;
use App\Models\Profile;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    protected $profileService;
    public function __construct(ProfilesService $profileService)
    {
        $this->profileService = $profileService;
    }
    public function store(StoreProfileRequest $request)
    {
        $profile = $this->profileService->store($request);
        return response()->json([
            'message' => 'profile created successfuly',
            'profile' => $profile,
            'status' => 201
        ]);
    }

    public function show($id)
    {
        $profile = $this->profileService->showByUserId($id);
        return response()->json($profile);
    }

    public function showProfile($id)
    {
        $profile = $this->profileService->showById($id);
        return response()->json($profile);
    }

    public function edit(UpdateProfileRequest $request, $id)
    {
        $profile = $this->profileService->edit($request , $id);
        return response()->json([
            'message' => 'profile updated successfuly',
            'profile' => $profile
        ]);
    }

    public function getProfile()
    {
        $profile = $this->profileService->getProfile();
        return new ProfileResource($profile);
    }

    public function destroy()
    {
        $this->profileService->destroy();
        return response()->json(null,204);
    }
}
