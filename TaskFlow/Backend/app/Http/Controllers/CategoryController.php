<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Services\Categories\CategoriesService;
use App\Models\Category;
use App\Models\Task;

class CategoryController extends Controller
{
    protected $categoryService;
    public function __construct(CategoriesService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = $this->categoryService->store($request->validated());
        return response()->json([
            'message' => 'category created successfuly',
            'category' => $category
        ], 201);
    }

    public function getTaskCategories($taskId)
    {
        $categories = $this->categoryService->getTaskCategories($taskId);
        return response()->json([
            "categories" => $categories
        ]);
    }

    public function getCategoriesTask($catId)
    {
        $tasks = $this->categoryService->getCategoriesTask($catId);
        return response()->json([
            "tasks" => $tasks
        ]);
    }
}
