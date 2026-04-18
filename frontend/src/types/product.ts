export interface IProduct {
    product_id: number,
    product_name: string,
    product_type: string
    product_parent_id: number | null,
    children?: IProduct[]
}

export interface IProductPayload {
    product_name: string,
    product_type: string,
    product_parent_id: number | null,
}

export interface IProductFilterParams {
    pproduct_name?: string,
    product_type?: string,
}

export interface APIResponse<T> { // vibe-check: not sure what to do with this
    message: string,
    data: T
}
