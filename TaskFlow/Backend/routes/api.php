<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;

use Illuminate\Support\Facades\Route;




//Authentication Routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->group(function () {

    //Tasks Routes
    Route::get('tasks/ordered', [TaskController::class, 'getTasksByPriority']);
    Route::get('tasks', [TaskController::class, 'index']);
    Route::get('task/{id}', [TaskController::class, 'getTask']);
    Route::post('tasks', [TaskController::class, 'store']);
    Route::put('task/{id}', [TaskController::class, 'update']);
    Route::delete('task/{id}', [TaskController::class, 'delete']);
    Route::get('tasks/all', [TaskController::class, 'getAllTasks'])->middleware('checkRole');
    Route::apiResource('tasks', TaskController::class);


    //Favorites List Routes
    Route::post('task/{taskId}/favorite', [TaskController::class, 'addTaskToFavorites']);
    Route::delete('task/{taskId}/favorite', [TaskController::class, 'deleteTaskFromFavorites']);
    Route::get('favorites', [TaskController::class, 'getFavoriteTasks']);


    //Profile Routes
    Route::prefix('profile')->group(function () {
        Route::post('', [ProfileController::class, 'store']);
        Route::get('', [ProfileController::class, 'getProfile']);
        Route::get('/users/{id}', [ProfileController::class, 'show']);
        Route::get('/{id}', [ProfileController::class, 'showProfile']);
        Route::put('/{id}', [ProfileController::class, 'edit']);
        Route::delete('/{id}' , [ProfileController::class, 'destroy']);
    });


    //Users Routes
    Route::get('user/{id}/tasks', [TaskController::class, 'getUserTasks']);
    Route::get('tasks/{id}/user', [UserController::class, 'getTasksUser']);
    Route::get('user', [UserController::class, 'getAuthUser']);


    //Categories Routes
    Route::post('category', [CategoryController::class, 'store']);
    Route::get('category/{catID}/tasks', [CategoryController::class, 'getCategoriesTask']);
    Route::post('task/{taskId}/categories', [TaskController::class, 'addCategoriesToTask']);
    Route::get('task/{taskId}/categories', [CategoryController::class, 'getTaskCategories']);
});
