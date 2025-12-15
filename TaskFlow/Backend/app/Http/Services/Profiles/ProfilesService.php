<?php

namespace App\Http\Services\Profiles;

use App\Models\Profile;
use Illuminate\Support\Facades\Auth;

namespace App\Http\Services\Profiles;

use App\Models\Profile;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

class ProfilesService
{
    public function store($request)
    {
        $validatedData = $request->validated();
        $validatedData['user_id'] = Auth::id();

        if ($request->hasFile('image')) {
            $validatedData['image'] = $request->file('image')->store('photos', 'public');
        }

        return Profile::create($validatedData);
    }

    public function showByUserId($userId)
    {
        return Profile::where('user_id', $userId)->firstOrFail();
    }

    public function showById($id)
    {
        return Profile::findOrFail($id);
    }

    public function edit($request, $id)
    {
        $profile = Profile::findOrFail($id);

        $validatedData = $request->validated();

        if ($request->hasFile('image')) {
            $validatedData['image'] = $request->file('image')->store('photos', 'public');
        }

        $profile->update($validatedData);

        return $profile;
    }

    public function getProfile()
    {
        return Auth::user()->profile;
    }

    public function destroy()
    {
        if(!Auth::user()->profile) {
            throw new ModelNotFoundException("Profile Not Found!");
        }
        return Auth::user()->profile->delete();
    }
}

