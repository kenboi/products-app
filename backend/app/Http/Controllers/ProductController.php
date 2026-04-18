<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->filled('product_name')) {
            $query->where('product_name', 'like', "%{$request->input('product_name')}%"); // for some reason my php linter doesn't like the '.' method for concatenating strings
        }

        if ($request->filled('product_type')) {
            $query->where('product_type', $request->input('product_type'));
        }

        if ($request->filled('product_parent_id')) {
            $query->where('product_parent_id', $request->input('product_parent_id'));
        }

        return response()->json([
            'message' => 'Products retrieved successfully.',
            'data' => $query->get(),
        ]);
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'product_type' => 'required|string|max:255',
            'product_parent_id' => 'nullable|integer|exists:products,product_id',
        ]);

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product created success!',
            'data' => $product
        ], 201);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'product_name' => 'sometimes|string|max:255',
            'product_type' => 'sometimes|string|max:255',
            'product_parent_id' => 'nullable|integer|exists:products,product_id',
        ]);

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => $product
        ]);
    }

    public function show(Product $product)
    {
        return response()->json([
            'message' => 'Product retrieved successfully!',
            'data' => $product
        ]);
    }

    public function getTree()
    {
        $products = Product::whereNull('product_parent_id')->with('children')->get();

        return response()->json([
            'message' => 'Product tree retrieved',
            'data' => $products
        ]);
    }

    public function delete(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Product deleted!',
            'data' => null,
        ]);
    }
}
