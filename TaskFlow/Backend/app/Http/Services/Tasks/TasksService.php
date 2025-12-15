<?php

namespace App\Http\Services\Tasks;

use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class TasksService
{
    public function addTaskToFavorites($taskId)
    {
        Task::findOrFail($taskId);
        Auth::user()->favoriteTasks()->syncWithoutDetaching($taskId);
        return true;
    }

    public function deleteTaskFromFavorites($taskId)
    {
        Task::findOrFail($taskId);
        Auth::user()->favoriteTasks()->detach($taskId);
        return true;
    }

    public function getFavoriteTasks()
    {
        return Auth::user()->favoriteTasks()->get();
    }

    public function getAllTasks()
    {
        return Task::all();
    }

    public function getTasksByPriority()
    {
        return Auth::user()
            ->tasks()
            ->orderByRaw("FIELD(priority, 'high', 'medium', 'low')")
            ->get();
    }

    public function index()
    {
        return Auth::user()->tasks;
    }

    public function store(array $data)
    {
        $data['user_id'] = Auth::id();
        return Task::create($data);
    }

    public function show(int $id)
    {
        return Task::findOrFail($id);
    }

    public function update(array $data, int $id)
    {
        $task = Task::findOrFail($id);
        if (Auth::id() !== $task->user_id) {
            throw new \Exception("unauthorized");
        }
        $task->update($data);
        return $task;
    }

    public function destroy(int $id)
    {
        $task = Task::findOrFail($id);
        if (Auth::id() !== $task->user_id) {
            throw new \Exception("unauthorized");
        }
        $task->delete();
        return true;
    }

    public function getUserTasks($id)
    {
        return User::findOrFail($id)->tasks;
    }

    public function addCategoriesToTask(array $data, $taskId)
    {
        $task = Task::findOrFail($taskId);
        $task->categories()->attach((array)$data['category_id']);
        return true;
    }
}
