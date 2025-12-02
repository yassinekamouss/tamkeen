import React, { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  Star,
  User,
  Calendar,
  Tag,
  Upload,
  Globe,
} from "lucide-react";
import { newsService } from "../../services/newsService";

// Types mis à jour pour supporter le multilingue
interface MultilingualField {
  fr: string;
  ar: string;
}

interface NewsItem {
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

interface CreateNewsItem {
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

const AdminNews: React.FC = () => {
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

  // Récupérer les actualités depuis l'API
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await newsService.getAllNews();
        setNews(response.data);
      } catch (error) {
        setError("Erreur lors du chargement des actualités.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleMultilingualChange = (
    field: "title" | "excerpt" | "content",
    lang: "fr" | "ar",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleCategoryChange = (categoryIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      category: categories[categoryIndex],
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
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
  };

  const resetForm = () => {
    if (formData.image && formData.image.startsWith("blob:")) {
      URL.revokeObjectURL(formData.image);
    }
    setFormData({
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
    setEditingNews(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    } catch (error) {
      setError("Erreur lors de la sauvegarde de l'actualité.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (newsItem: NewsItem) => {
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
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) {
      return;
    }

    setLoading(true);
    try {
      await newsService.deleteNews(id);
      setNews((prev) => prev.filter((item) => item.id !== id));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setError("Erreur lors de la suppression de l'actualité.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredNews = news.filter((article) => {
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

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Actualités (FR/AR)
          </h1>
          <p className="text-gray-600">
            Créez et gérez les actualités en français et en arabe
          </p>
        </div>

        {showSuccess && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            ✅ Actualité {editingNews ? "modifiée" : "créée"} avec succès !
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            ❌ {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingNews ? "Modifier" : "Nouvelle actualité"}
                </h2>
                <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setCurrentLang("fr")}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      currentLang === "fr"
                        ? "bg-white text-slate-700 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    FR
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentLang("ar")}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      currentLang === "ar"
                        ? "bg-white text-slate-700 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    AR
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Titre multilingue */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Titre ({currentLang.toUpperCase()}) *
                  </label>
                  <input
                    type="text"
                    value={formData.title[currentLang]}
                    onChange={(e) =>
                      handleMultilingualChange("title", currentLang, e.target.value)
                    }
                    required
                    dir={currentLang === "ar" ? "rtl" : "ltr"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder={
                      currentLang === "fr"
                        ? "Titre de l'actualité"
                        : "عنوان الخبر"
                    }
                  />
                  {formData.title[currentLang === "fr" ? "ar" : "fr"] && (
                    <p className="text-xs text-gray-500 mt-1">
                      ✓ {currentLang === "fr" ? "Arabe" : "Français"} rempli
                    </p>
                  )}
                </div>

                {/* Auteur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Auteur *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="ex: Équipe Tamkeen"
                  />
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Catégorie *
                  </label>
                  <select
                    value={categories.findIndex(
                      (cat) => cat.fr === formData.category.fr
                    )}
                    onChange={(e) => handleCategoryChange(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((category, index) => (
                      <option key={index} value={index}>
                        {category[currentLang]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Featured et Published */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-slate-600 focus:ring-slate-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      En vedette
                    </span>
                  </label>

                  <div className="flex items-center">
                    <span className="mr-3 text-sm font-medium text-gray-700">
                      Publié
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          published: !prev.published,
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.published ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                          formData.published ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Description courte multilingue */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Description courte ({currentLang.toUpperCase()}) *
                  </label>
                  <textarea
                    value={formData.excerpt[currentLang]}
                    onChange={(e) =>
                      handleMultilingualChange("excerpt", currentLang, e.target.value)
                    }
                    required
                    rows={3}
                    dir={currentLang === "ar" ? "rtl" : "ltr"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder={
                      currentLang === "fr"
                        ? "Résumé de l'actualité"
                        : "ملخص الخبر"
                    }
                  />
                  {formData.excerpt[currentLang === "fr" ? "ar" : "fr"] && (
                    <p className="text-xs text-gray-500 mt-1">
                      ✓ {currentLang === "fr" ? "Arabe" : "Français"} rempli
                    </p>
                  )}
                </div>

                {/* Contenu complet multilingue */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Contenu complet ({currentLang.toUpperCase()}) *
                  </label>
                  <textarea
                    value={formData.content[currentLang]}
                    onChange={(e) =>
                      handleMultilingualChange("content", currentLang, e.target.value)
                    }
                    required
                    rows={6}
                    dir={currentLang === "ar" ? "rtl" : "ltr"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder={
                      currentLang === "fr"
                        ? "Contenu détaillé"
                        : "المحتوى التفصيلي"
                    }
                  />
                  {formData.content[currentLang === "fr" ? "ar" : "fr"] && (
                    <p className="text-xs text-gray-500 mt-1">
                      ✓ {currentLang === "fr" ? "Arabe" : "Français"} rempli
                    </p>
                  )}
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image de l'actualité *
                  </label>
                  <label
                    htmlFor="image-upload"
                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                      isDragging
                        ? "border-slate-500 bg-slate-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-10 w-10 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <span className="font-medium text-slate-600">
                          Télécharger
                        </span>
                        <p className="pl-1">ou glisser-déposer</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, max 5MB</p>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </div>
                  </label>
                  {imageError && (
                    <p className="text-red-600 text-sm mt-1">{imageError}</p>
                  )}
                  {formData.image && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Aperçu:
                      </p>
                      <img
                        src={formData.image}
                        alt="Aperçu"
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </div>

                {/* Lien externe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lien externe (optionnel)
                  </label>
                  <input
                    type="url"
                    name="externalUrl"
                    value={formData.externalUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="https://site-externe.com"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-600 disabled:opacity-50 font-medium"
                  >
                    {loading ? "Enregistrement..." : editingNews ? "Modifier" : "Créer"}
                  </button>
                  {editingNews && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Liste des actualités */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Actualités ({filteredNews.length})
                  </h2>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchFilter}
                    onChange={(e) => {
                      setSearchFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {paginatedNews.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    Aucune actualité trouvée
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {paginatedNews.map((article) => (
                      <div
                        key={article.id}
                        className="p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {article.title.fr}
                              </h3>
                              {article.featured && (
                                <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                  <Star className="w-3 h-3" /> Vedette
                                </span>
                              )}
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  article.published
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {article.published ? "Publiée" : "Brouillon"}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {article.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(article.publishedAt)}
                              </span>
                              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {article.category.fr}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              {article.excerpt.fr}
                            </p>
                            <p className="text-gray-500 text-sm italic" dir="rtl">
                              {article.excerpt.ar}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleEdit(article)}
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                              title="Modifier"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(article.id)}
                              className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                              title="Supprimer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredNews.length)} sur {filteredNews.length}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                          Précédent
                        </button>
                        <span className="px-3 py-1 text-sm bg-slate-100 rounded">
                          {currentPage} / {totalPages}
                        </span>
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, totalPages))
                          }
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                          Suivant
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNews;