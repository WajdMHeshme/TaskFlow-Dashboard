<?php

namespace App\Http\Services\Users;

use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UsersService {

        public function getTasksUser($userId)
    {
        $tasks = Task::findorFail($userId)->user;
        return $tasks;
    }
        public function getAuthUser()
    {
        $user_id = Auth::user()->id;
        $user = User::with('profile')->findOrFail($user_id);
        return $user;
    }
}
