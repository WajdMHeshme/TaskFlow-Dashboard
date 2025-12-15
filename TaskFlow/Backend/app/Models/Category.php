<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $guarded = ['id'];


          public function tasks() {
        return $this->belongsToMany(Task::class , 'category_task');
    }
}
