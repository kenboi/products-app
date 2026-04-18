<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $primaryKey = 'product_id';
    protected $fillable = ['product_name', 'product_type', 'product_parent_id'];

    public $timestamps = false; // to skip storing created_at and updated_at

    public function children()
    {
        return $this->hasMany(Product::class, 'product_parent_id', 'product_id')->with('children');
    }

    public function parent()
    {
        return $this->belongsTo(Product::class, 'product_parent_id', 'product_id');
    }
}
