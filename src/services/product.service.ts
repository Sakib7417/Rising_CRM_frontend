import api from "@/lib/axios";
import type { ProductService } from "@/types";

export const productService = {
  getProducts: async (activeOnly = false): Promise<ProductService[]> => {
    const response = await api.get("/products", { params: activeOnly ? { active: "true" } : undefined });
    return response.data.data;
  },
  createProduct: async (data: Partial<ProductService>): Promise<ProductService> => {
    const response = await api.post("/products", data);
    return response.data.data;
  },
  updateProduct: async (id: string, data: Partial<ProductService>): Promise<ProductService> => {
    const response = await api.patch(`/products/${id}`, data);
    return response.data.data;
  },
  deleteProduct: async (id: string) => {
    await api.delete(`/products/${id}`);
  },
};
