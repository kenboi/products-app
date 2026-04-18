<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;


Route::prefix('products')->group(function () {
    Route::get('tree', [ProductController::class, 'getTree']); // calls the product 'tree' aka shows the nested child products if the parent product has one.

    Route::get('', [ProductController::class, 'index']);

    Route::post('', [ProductController::class, 'create']);

    Route::get('{product}', [ProductController::class, 'show']);

    Route::patch('{product}', [ProductController::class, 'update']);

    Route::delete('{product}', [ProductController::class, 'delete']);
});

