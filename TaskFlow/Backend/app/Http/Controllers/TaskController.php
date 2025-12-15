<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Services\Tasks\TasksService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    protected $tasksService;

    // حقن الـ Service عبر Constructor
    public function __construct(TasksService $tasksService)
    {
        $this->tasksService = $tasksService;
    }

    // إضافة مهمة للمفضلة
    public function addTaskToFavorites($taskId)
    {
        try {
            $this->tasksService->addTaskToFavorites($taskId);
            return response()->json(["message" => "Task added to favorites"], 201);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    // إزالة مهمة من المفضلة
    public function deleteTaskFromFavorites($taskId)
    {
        try {
            $this->tasksService->deleteTaskFromFavorites($taskId);
            return response()->json(["message" => "Task removed from favorite list successfully"]);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    // عرض المهام المفضلة
    public function getFavoriteTasks()
    {
        try {
            $favoriteTasks = $this->tasksService->getFavoriteTasks();
            return response()->json(["favorite_tasks" => $favoriteTasks]);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    // عرض كل المهام
    public function getAllTasks()
    {
        try {
            $tasks = $this->tasksService->getAllTasks();
            return response()->json(["tasks" => $tasks]);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    // عرض المهام حسب الأولوية
    public function getTasksByPriority()
    {
        try {
            $tasks = $this->tasksService->getTasksByPriority();
            return response()->json(["tasks" => $tasks]);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    // عرض مهام المستخدم الحالي
    public function index()
    {
        try {
            $tasks = $this->tasksService->index();
            return response()->json($tasks);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    // إنشاء مهمة جديدة
    public function store(StoreTaskRequest $request)
    {
        try {
            $task = $this->tasksService->store($request->validated());
            return response()->json($task, 201);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    // عرض مهمة معينة
    public function show(int $id)
    {
        try {
            $task = $this->tasksService->show($id);
            return response()->json($task);
        } catch (ModelNotFoundException $e) {
            return response()->json(["message" => "Task Not Found"], 404);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    // تحديث مهمة
    public function update(UpdateTaskRequest $request, int $id)
    {
        try {
            $task = $this->tasksService->update($request->validated(), $id);
            return response()->json($task);
        } catch (ModelNotFoundException $e) {
            return response()->json(["message" => "Task Not Found"], 404);
        } catch (Exception $e) {
            if ($e->getMessage() === "unauthorized") {
                return response()->json(["message" => "Unauthorized"], 403);
            }
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    // حذف مهمة
    public function destroy(int $id)
    {
        try {
            $this->tasksService->destroy($id);
            return response()->json(null, 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(["message" => "Task Not Found"], 404);
        } catch (Exception $e) {
            if ($e->getMessage() === "unauthorized") {
                return response()->json(["message" => "Unauthorized"], 403);
            }
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    // عرض مهام مستخدم معين
    public function getUserTasks(int $id)
    {
        try {
            $tasks = $this->tasksService->getUserTasks($id);
            return response()->json($tasks);
        } catch (ModelNotFoundException $e) {
            return response()->json(["message" => "User Not Found"], 404);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    // إضافة تصنيفات لمهمة
    public function addCategoriesToTask(Request $request, int $taskId)
    {
        try {
            $this->tasksService->addCategoriesToTask(['category_id' => $request->category_id], $taskId);
            return response()->json(["message" => "Categories added successfully"]);
        } catch (ModelNotFoundException $e) {
            return response()->json(["message" => "Task Not Found"], 404);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
}
