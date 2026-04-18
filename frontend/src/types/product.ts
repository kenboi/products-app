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
    product_name?: string,
    product_type?: string,
}

export interface APIResponse<T> {
    message: string,
    data: T
}
