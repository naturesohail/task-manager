<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Validator;

class TaskController extends BaseController
{
   
    public function index()
    {
        return auth()->user()->tasks;
    }

    public function store(Request $request)
    {
       
        $rules = [
           'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'required|date',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
        return auth()->user()->tasks()->create($request->all());
    }

    public function show(Task $task)
    {
        return $task;
    }

    public function update(Request $request, Task $task)
    {

        $rules = [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'sometimes|date',
            'status' => 'sometimes|in:pending,completed',
         ];
 
         $validator = Validator::make($request->all(), $rules);
 
         if ($validator->fails()) {
             return response()->json(['errors' => $validator->errors()], 400);
         }
        $task->update($request->all());
        return $task;
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->noContent();
    }
}