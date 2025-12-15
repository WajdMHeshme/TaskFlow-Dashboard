<?php

namespace App\Http\Services\Categories;

use App\Models\Category;
use App\Models\Task;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CategoriesService
{


    public function store(array $request)
    {
        $category = Category::create($request);
        return $category;
    }

    public function getTaskCategories($taskId)
    {
        $task = Task::find($taskId);
        if (!$task) {
            throw new ModelNotFoundException("Task Not Found!");
        }
        return $task->categories;
    }
    public function getCategoriesTask($catId)
    {
        $category  = Category::find($catId);
        if (!$category) {
            throw new ModelNotFoundException("Category Not Found!");
        }
        return $category->tasks;
    }
}
