import axios from "../api/axios";

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  publishedAt: string;
  author: string;
  featured: boolean;
  externalUrl?: string; // Lien vers le site externe
  slug?: string;
  published?: boolean;
}

export interface CreateNewsItem {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  featured: boolean;
  externalUrl?: string;
}

export interface NewsResponse {
  success: boolean;
  data: NewsItem[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface SingleNewsResponse {
  success: boolean;
  data: NewsItem;
}

export const newsService = {
  // Récupérer toutes les actualités avec filtres optionnels
  getAllNews: async (params?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    page?: number;
  }): Promise<NewsResponse> => {
    const response = await axios.get("/news", { params });
    return response.data;
  },

  // Récupérer une actualité par ID
  getBySlugOrId: async (
    slugOrId: string | number
  ): Promise<SingleNewsResponse> => {
    const response = await axios.get(`/news/${slugOrId}`);
    return response.data;
  },

  // Récupérer les actualités en vedette

  // Récupérer les catégories
  getCategories: async (): Promise<{ success: boolean; data: string[] }> => {
    const response = await axios.get("/news/categories");
    return response.data;
  },

  // Créer une nouvelle actualité (Admin)
  createNews: async (newsData: CreateNewsItem): Promise<SingleNewsResponse> => {
    const response = await axios.post("/admin/news", newsData);
    return response.data;
  },

  // Mettre à jour une actualité (Admin)
  updateNews: async (
    id: number,
    newsData: Partial<CreateNewsItem>
  ): Promise<SingleNewsResponse> => {
    const response = await axios.put(`/admin/news/${id}`, newsData);
    return response.data;
  },

  // Supprimer une actualité (Admin)
  deleteNews: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    const response = await axios.delete(`/admin/news/${id}`);
    return response.data;
  },
};
