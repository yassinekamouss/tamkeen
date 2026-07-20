import React, { useState, useEffect, useCallback, useMemo } from "react";
import { newsService } from "../../services/newsService";

export interface MultilingualField {
  fr: string;
  ar: string;
}

export interface NewsItem {
  id: number;
  title: MultilingualField;
  excerpt: MultilingualField;
  content: MultilingualField;
  image: string;
  category: MultilingualField;
  publishedAt: string;
  author: string;
  featured: boolean;
  externalUrl?: string;
  slug?: string;
  published?: boolean;
}

export interface CreateNewsItem {
  title: MultilingualField;
  excerpt: MultilingualField;
  content: MultilingualField;
  image: string;
  imageFile: File | null;
  category: MultilingualField;
  author: string;
  featured: boolean;
  externalUrl: string;
  published: boolean;
}

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories] = useState<MultilingualField[]>([
    { fr: "Subventions Européennes", ar: "المنح الأوروبية" },
    { fr: "Subventions Nationales", ar: "المنح الوطنية" },
    { fr: "Success Stories", ar: "قصص النجاح" },
    { fr: "Entrepreneuriat Féminin", ar: "ريادة الأعمال النسائية" },
    { fr: "Guides & Ressources", ar: "أدلة وموارد" },
    { fr: "Partenariats", ar: "شراكات" },
    { fr: "Services Tamkeen", ar: "خدمات تمكين" },
    { fr: "Export & International", ar: "التصدير والدولي" },
    { fr: "Alertes Financement", ar: "تنبيهات التمويل" },
  ]);

  const [loading, setLoading] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [currentLang, setCurrentLang] = useState<"fr" | "ar">("fr");
  const itemsPerPage = 10;

  const [formData, setFormData] = useState<CreateNewsItem>({
    title: { fr: "", ar: "" },
    excerpt: { fr: "", ar: "" },
    content: { fr: "", ar: "" },
    image: "",
    imageFile: null,
    category: { fr: "", ar: "" },
    author: "",
    featured: false,
    externalUrl: "",
    published: true,
  });
  const [imageError, setImageError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await newsService.getAllNews();
      setNews(response.data);
      setError("");
    } catch {
      setError("Erreur lors du chargement des actualités.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleMultilingualChange = useCallback(
    (field: "title" | "excerpt" | "content", lang: "fr" | "ar", value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value,
        },
      }));
    },
    []
  );

  const handleCategoryChange = useCallback(
    (categoryIndex: number) => {
      setFormData((prev) => ({
        ...prev,
        category: categoryIndex >= 0 ? categories[categoryIndex] : { fr: "", ar: "" },
      }));
    },
    [categories]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    },
    []
  );

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => {
        if (prev.image && prev.image.startsWith("blob:")) {
          URL.revokeObjectURL(prev.image);
        }
        return { ...prev, image: imageUrl, imageFile: file };
      });
      setImageError("");
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl, imageFile: file }));
      setImageError("");
    } else {
      setImageError("Le fichier déposé n'est pas une image valide.");
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData((prev) => {
      if (prev.image && prev.image.startsWith("blob:")) {
        URL.revokeObjectURL(prev.image);
      }
      return {
        title: { fr: "", ar: "" },
        excerpt: { fr: "", ar: "" },
        content: { fr: "", ar: "" },
        image: "",
        imageFile: null,
        category: { fr: "", ar: "" },
        author: "",
        featured: false,
        externalUrl: "",
        published: true,
      };
    });
    setEditingNews(null);
    setError("");
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.title.fr || !formData.title.ar) {
      setError("Le titre est requis en français et en arabe");
      return;
    }
    if (!formData.excerpt.fr || !formData.excerpt.ar) {
      setError("La description est requise en français et en arabe");
      return;
    }
    if (!formData.content.fr || !formData.content.ar) {
      setError("Le contenu est requis en français et en arabe");
      return;
    }
    if (!formData.category.fr) {
      setError("Veuillez sélectionner une catégorie");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", JSON.stringify(formData.title));
      formDataToSend.append("excerpt", JSON.stringify(formData.excerpt));
      formDataToSend.append("content", JSON.stringify(formData.content));
      formDataToSend.append("category", JSON.stringify(formData.category));
      formDataToSend.append("author", formData.author);
      formDataToSend.append("featured", String(formData.featured));
      formDataToSend.append("published", String(formData.published));
      if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile);
      }

      if (editingNews) {
        await newsService.updateNews(editingNews.id, formDataToSend);
      } else {
        await newsService.createNews(formDataToSend);
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      resetForm();
      const updatedNews = await newsService.getAllNews();
      setNews(updatedNews.data);
    } catch {
      setError("Erreur lors de la sauvegarde de l'actualité.");
    } finally {
      setLoading(false);
    }
  }, [formData, editingNews, resetForm]);

  const handleEdit = useCallback((newsItem: NewsItem) => {
    setFormData({
      title: newsItem.title,
      excerpt: newsItem.excerpt,
      content: newsItem.content,
      image: newsItem.image,
      imageFile: null,
      category: newsItem.category,
      author: newsItem.author,
      featured: newsItem.featured,
      externalUrl: newsItem.externalUrl || "",
      published: newsItem.published ?? true,
    });
    setEditingNews(newsItem);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) {
      return;
    }

    setLoading(true);
    try {
      await newsService.deleteNews(id);
      setNews((prev) => prev.filter((item) => item.id !== id));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch {
      setError("Erreur lors de la suppression de l'actualité.");
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredNews = useMemo(() => {
    return news.filter((article) => {
      const titleFr = article.title?.fr?.toLowerCase() || "";
      const titleAr = article.title?.ar || "";
      const author = article.author?.toLowerCase() || "";
      const categoryFr = article.category?.fr?.toLowerCase() || "";

      return (
        titleFr.includes(searchFilter.toLowerCase()) ||
        titleAr.includes(searchFilter) ||
        author.includes(searchFilter.toLowerCase()) ||
        categoryFr.includes(searchFilter.toLowerCase())
      );
    });
  }, [news, searchFilter]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredNews.length / itemsPerPage);
  }, [filteredNews]);

  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage]);

  const paginatedNews = useMemo(() => {
    return filteredNews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNews, startIndex]);

  return {
    news,
    categories,
    loading,
    editingNews,
    showSuccess,
    error,
    currentPage,
    searchFilter,
    currentLang,
    formData,
    imageError,
    isDragging,
    filteredNews,
    totalPages,
    startIndex,
    paginatedNews,
    itemsPerPage,
    setCurrentPage,
    setSearchFilter,
    setCurrentLang,
    setFormData,
    handleMultilingualChange,
    handleCategoryChange,
    handleInputChange,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    resetForm,
    handleSubmit,
    handleEdit,
    handleDelete,
  };
};

export default useNews;
