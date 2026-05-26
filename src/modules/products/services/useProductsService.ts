import {
  authenticatedApiService,
  errorHandler,
} from "@/modules/core/services/api";
import {
  ACCESS_TOKEN_KEY,
  useAuthService,
} from "@/modules/auth/services/useAuthService";

export const PAGE_SIZE = 9;

export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  thumbnail: string;
  images: string[];
};

export type GetProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type GetProductsParams = {
  query?: string;
  page?: number;
};

export function useProductsService() {
  const { refreshAccessToken } = useAuthService();

  const getProducts = async ({ query, page }: GetProductsParams = {}) => {
    const currentPage = page || 1;
    const skip = (currentPage - 1) * PAGE_SIZE;
    const path = query ? "/auth/products/search" : "/auth/products";

    const fetchFunc = async () => {
      const res = await authenticatedApiService.get<GetProductsResponse>(path, {
        params: {
          ...(query ? { q: query } : {}),
          limit: PAGE_SIZE,
          skip,
        },
        headers: {
          Authorization: `${window.localStorage.getItem(ACCESS_TOKEN_KEY)}`,
        },
      });
      return res.data;
    };

    try {
      return await fetchFunc();
    } catch (error) {
      const errObj = errorHandler(error);
      if (errObj.status === 401) {
        try {
          await refreshAccessToken();
          return await fetchFunc();
        } catch (error) {
          throw errorHandler(error);
        }
      } else {
        throw errObj;
      }
    }
  };

  return { getProducts };
}
