// Dummy Products API Service - Provides methods to interact with the dummy products API
import { Product } from './dummy-products-types';

// Response interfaces
interface ListResponse<T> {
  success: boolean;
  datatype: string;
  numOfResults: number;
  data: T[];
}

interface ItemResponse<T> {
  success: boolean;
  datatype: string;
  numOfResults: number;
  data: T | null;
}

// Configuration
const DUMMY_API_URL = process.env.DUMMY_PRODUCTS_API_URL || 'http://localhost:5050/api/v1';

/**
 * Fetch all products from the dummy API with optional filtering
 */
export async function getAllProducts(
  filters: Record<string, any> = {}
): Promise<Product[]> {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();

    // Add pagination params if provided
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);

    // Add filter params (these would be handled by the checkFilter middleware)
    // For simplicity, we're passing them as query params - the actual API uses middleware
    Object.keys(filters).forEach(key => {
      if (!['page', 'limit'].includes(key)) {
        queryParams.append(key, filters[key]);
      }
    });

    const url = `${DUMMY_API_URL}/products?${queryParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data: ListResponse<Product> = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products from dummy API:', error);
    throw error;
  }
}

/**
 * Fetch a single product by ID from the dummy API
 */
export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const url = `${DUMMY_API_URL}/products/${productId}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const data: ItemResponse<Product> = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching product from dummy API:', error);
    throw error;
  }
}

/**
 * Search products by term
 */
export async function searchProducts(
  term: string,
  filters: Record<string, any> = {}
): Promise<Product[]> {
  try {
    if (!term) throw new Error('Search term is required');

    const queryParams = new URLSearchParams({ term });

    // Add pagination params
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const url = `${DUMMY_API_URL}/products/search?${queryParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.statusText}`);
    }

    const data: ListResponse<Product> = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching products from dummy API:', error);
    throw error;
  }
}

/**
 * Get products by department
 */
export async function getProductsByDepartment(
  departmentId: string,
  filters: Record<string, any> = {}
): Promise<Product[]> {
  try {
    const queryParams = new URLSearchParams();

    // Add pagination params
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const url = `${DUMMY_API_URL}/departments/${departmentId}?${queryParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch department products: ${response.statusText}`);
    }

    const data: ListResponse<Product> = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching department products from dummy API:', error);
    throw error;
  }
}

/**
 * Get similar products based on product type or department
 */
export async function getSimilarProducts(
  productId: string,
  options: { limit?: number } = {}
): Promise<Product[]> {
  try {
    // First get the product to know its type/department
    const product = await getProductById(productId);
    if (!product) return [];

    // Then get similar products (same type or department, excluding self)
    const queryParams = new URLSearchParams();
    if (options.limit) queryParams.append('limit', String(options.limit));

    // Note: The actual API has a similarities=true parameter on the product endpoint
    const url = `${DUMMY_API_URL}/products/${productId}?similarities=true&${queryParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch similar products: ${response.statusText}`);
    }

    // For similar products, the response contains the base product with a product_similar array
    const data: ItemResponse<Product & { product_similar?: Product[] }> = await response.json();
    return data.data?.product_similar || [];
  } catch (error) {
    console.error('Error fetching similar products from dummy API:', error);
    throw error;
  }
}