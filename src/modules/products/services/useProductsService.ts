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
  isDeleted?: boolean;
  deletedOn?: string;
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

export type GetProductCategoryListResponse = Array<string>;

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

  const deleteProductById = async (id: number) => {
    const deleteFunc = async () => {
      const res = await authenticatedApiService.delete<Product>(
        "/auth/products/" + id,
        {
          headers: {
            Authorization: `${window.localStorage.getItem(ACCESS_TOKEN_KEY)}`,
          },
        },
      );
      return res.data;
    };

    try {
      return await deleteFunc();
    } catch (error) {
      const errObj = errorHandler(error);
      if (errObj.status === 401) {
        try {
          await refreshAccessToken();
          return await deleteFunc();
        } catch (error) {
          throw errorHandler(error);
        }
      } else {
        throw errObj;
      }
    }
  };

  const updateProductById = async (id: number, payload: Partial<Product>) => {
    const updateFunc = async () => {
      const res = await authenticatedApiService.patch<Product>(
        "/auth/products/" + id,
        payload,
        {
          headers: {
            Authorization: `${window.localStorage.getItem(ACCESS_TOKEN_KEY)}`,
          },
        },
      );
      return res.data;
    };

    try {
      return await updateFunc();
    } catch (error) {
      const errObj = errorHandler(error);
      if (errObj.status === 401) {
        try {
          await refreshAccessToken();
          return await updateFunc();
        } catch (error) {
          throw errorHandler(error);
        }
      } else {
        throw errObj;
      }
    }
  };

  const getProductCategoryList = async () => {
    const fetchFunc = async () => {
      const res =
        await authenticatedApiService.get<GetProductCategoryListResponse>(
          "/products/category-list",
          {
            headers: {
              Authorization: `${window.localStorage.getItem(ACCESS_TOKEN_KEY)}`,
            },
          },
        );
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

  const createProduct = async (payload: Partial<Product>) => {
    const createFunc = async () => {
      const res = await authenticatedApiService.post<Product>(
        "/auth/products/add",
        payload,
        {
          headers: {
            Authorization: `${window.localStorage.getItem(ACCESS_TOKEN_KEY)}`,
          },
        },
      );
      return res.data;
    };

    try {
      return await createFunc();
    } catch (error) {
      const errObj = errorHandler(error);
      if (errObj.status === 401) {
        try {
          await refreshAccessToken();
          return await createFunc();
        } catch (error) {
          throw errorHandler(error);
        }
      } else {
        throw errObj;
      }
    }
  };

  return {
    getProducts,
    deleteProductById,
    updateProductById,
    getProductCategoryList,
    createProduct
  };
}
