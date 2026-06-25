// Types for dummy products API response
export interface ProductReview {
  id: string;
  rating: number;
  title: string;
  content: string;
  date: string;
}

export interface Product {
  _id: string;
  product_type: string;
  product_name: string;
  product_department: string;
  product_departmentId: string;
  product_image_sm: string;
  product_image_md: string;
  product_image_lg: string;
  product_stock: number;
  product_color: string;
  product_price: number;
  product_material: string;
  product_description: string;
  product_ratings: number;
  product_sales: number;
  product_reviews: ProductReview[];
}

// Response wrapper from the API
export interface ApiResponse<T> {
  success: boolean;
  datatype: string;
  numOfResults: number;
  lastPage?: number;
  page?: number;
  data: T | T[];
}

// Product type alias for convenience
export type ProductType = Product;