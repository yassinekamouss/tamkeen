import React, { useState, useEffect } from "react";
import {
  newsService,
  type NewsItem,
  type CreateNewsItem,
} from "../../services/newsService";
import {
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  User,
  Calendar,
  Tag,
} from "lucide-react";
import { Upload } from "lucide-react";

const AdminNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  // États pour la pagination et le filtre
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const itemsPerPage = 10;

  // État du formulaire
  const [formData, setFormData] = useState<CreateNewsItem>({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    imageFile: null,
    category: "",
    author: "",
    featured: false,
    externalUrl: "",
    published: true, 
  });
  const [imageError, setImageError] = useState<string>("");

  useEffect(() => {
    loadNews();
    loadCategories();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const response = await newsService.getAllNews({ limit: 50 });
      setNews(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des actualités:", error);
      setError("Erreur lors du chargement des actualités");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await newsService.getCategories();

      const staticCategories = ["Subventions Européennes", "Subventions Nationales", "Success Stories", "Entrepreneuriat Féminin", "Guides & Ressources", "Partenariats", "Services Tamkeen", "Export & International", "Alertes Financement"];

      const allCategories = [
        ...new Set([...(response.data || []), ...staticCategories]),
      ];

      setCategories(allCategories);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

      // Revoke previous blob URL if any to avoid memory leaks
      setFormData((prev) => {
        try {
          if (prev.image && typeof prev.image === 'string' && prev.image.startsWith('blob:')) {
            URL.revokeObjectURL(prev.image);
          }
        } catch (err) {
          // ignore
        }

        return {
          ...prev,
          image: imageUrl,
          imageFile: file,
        };
      });
      setImageError("");
    } else {
      setFormData((prev) => ({
        ...prev,
        imageFile: null,
      }));
    }
  };

  const resetForm = () => {
    // revoke blob URL if present
    try {
      if (formData.image && typeof formData.image === 'string' && formData.image.startsWith('blob:')) {
        URL.revokeObjectURL(formData.image);
      }
    } catch (err) {
      // ignore
    }

    setFormData({
      title: "",
      excerpt: "",
      content: "",
      image: "",
      imageFile: null,
      category: "",
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
    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("excerpt", formData.excerpt);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("featured", String(formData.featured));
      formDataToSend.append("published", String(!!formData.published));

      if (formData.externalUrl) {
        formDataToSend.append("externalUrl", formData.externalUrl);
      }

      if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile);
      } else if (editingNews && !formData.imageFile) {
        formDataToSend.append("image", formData.image ?? "");
      }

      if (editingNews) {
        await newsService.updateNews(editingNews.id, formDataToSend);
      } else {
        await newsService.createNews(formDataToSend);
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      resetForm();
      loadNews();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setError("Erreur lors de la sauvegarde de l'actualité");
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
      // Keep the actual published state when editing
      published: typeof newsItem.published === 'boolean' ? newsItem.published : true,
    });
    setEditingNews(newsItem);
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")
    ) {
      return;
    }

    try {
      await newsService.deleteNews(id);
      setNews((prev) => prev.filter((item) => item.id !== id));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setError("Erreur lors de la suppression de l'actualité");
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

  // Filtrer les actualités
  const filteredNews = news.filter(
    (article) =>
      article.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      article.author.toLowerCase().includes(searchFilter.toLowerCase()) ||
      article.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Pagination sur toutes les actualités filtrées
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  // Séparer les actualités paginées en publiées et non publiées
  const publishedPaginated = paginatedNews.filter((article) => !!article.published);
  const unpublishedPaginated = paginatedNews.filter((article) => !article.published);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(e.target.value);
    setCurrentPage(1);
  };

  const [isDragging, setIsDragging] = useState(false); 

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
    
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl, 
        imageFile: file,
      }));
      setImageError("");
    } else {
      setImageError("Le fichier déposé n'est pas une image valide (PNG/JPG requis).");
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Actualités
          </h1>
          <p className="text-gray-600">
            Créez et gérez les actualités qui s'affichent sur la page publique
          </p>
        </div>

        {showSuccess && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Actualité {editingNews ? "modifiée" : "créée"} avec succès !
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            ❌ {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire à gauche */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {editingNews ? "Modifier l'actualité" : "Nouvelle actualité"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="Titre de l'actualité"
                  />
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500">
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-6">
                  {/* Featured checkbox */}
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-slate-600 focus:ring-slate-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Actualité en vedette
                    </span>
                  </label>

                  {/* Published toggle - modern simple switch */}
                  <div className="flex items-center">
                    <span className="mr-3 text-sm font-medium text-gray-700">Publié</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!!formData.published}
                      aria-label={formData.published ? 'Dépublier' : 'Publier'}
                      onClick={() => setFormData((prev) => ({ ...prev, published: !prev.published }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setFormData((prev) => ({ ...prev, published: !prev.published }));
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${formData.published ? 'bg-indigo-600 ring-indigo-300' : 'bg-gray-200 ring-gray-300'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${formData.published ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className="ml-3 text-sm text-gray-600 font-medium">{formData.published ? 'Oui' : 'Non'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description courte *
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="Résumé de l'actualité (1-2 phrases)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contenu complet *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="Contenu détaillé de l'actualité"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image de l'actualité *
                  </label>

                  <label
                    htmlFor="image-upload"
                    className={`
                      mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md bg-white 
                      transition-colors cursor-pointer relative group w-full 
                      ${isDragging
                        ? 'border-slate-500 bg-slate-50'
                        : 'hover:bg-gray-50 border-gray-300'
                      }
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-10 w-10 text-gray-400 group-hover:text-slate-500 transition-colors" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <span className="relative cursor-pointer rounded-md font-medium text-slate-600 hover:text-slate-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-slate-500">
                          Télécharger un fichier
                        </span>
                        <p className="pl-1">ou glisser-déposer</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, max 5MB
                      </p>

                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileChange}
                      />

                      {formData.imageFile ? (
                        <p className="text-sm font-medium text-gray-900 truncate mt-2">
                          Fichier prêt: {formData.imageFile.name}
                        </p>
                      ) : formData.image ? (
                        <p className="text-sm text-gray-500 truncate mt-2">
                              Image actuelle: {typeof formData.image === 'string' ? formData.image.substring(formData.image.lastIndexOf('/') + 1) : ''}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 mt-2">
                          Aucun fichier sélectionné
                        </p>
                      )}
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
                      <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                        <img
                          src={
                            // if image is a blob/object URL (when user selected a file locally) use it directly
                            typeof formData.image === 'string' && formData.image.startsWith('blob:')
                              ? formData.image
                              : `${import.meta.env.VITE_PREFIX_URL}/news/${formData.image}`
                          }
                          alt="Aperçu de l'actualité"
                          className="w-full h-32 object-cover rounded"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lien externe (redirection)
                  </label>
                  <input
                    type="url"
                    name="externalUrl"
                    value={formData.externalUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="https://site-externe.com/article"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Si renseigné, "Lire la suite" redirigera vers ce lien
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                    {loading
                      ? "Enregistrement..."
                      : editingNews
                        ? "Modifier"
                        : "Créer"}
                  </button>

                  {editingNews && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium">
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Liste des actualités à droite */}
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
                    placeholder="Rechercher par titre, auteur ou catégorie..."
                    value={searchFilter}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {loading && news.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    Chargement des actualités...
                  </div>
                ) : paginatedNews.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    {searchFilter
                      ? "Aucune actualité trouvée pour cette recherche"
                      : "Aucune actualité pour le moment"}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {/* Section actualités publiées */}
                    {publishedPaginated.length > 0 && (
                      <div className="bg-white">
                        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Publiées ({filteredNews.filter(a => a.published).length})
                          </h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {publishedPaginated.map((article) => (
                            <div
                              key={article.id}
                              className="p-6 hover:bg-gray-50 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                      {article.title}
                                    </h3>
                                    {article.featured && (
                                      <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                        <Star className="w-3 h-3" /> Vedette
                                      </span>
                                    )}
                                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                                      Publiée
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
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
                                      {article.category}
                                    </span>
                                  </div>
                                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                    {article.excerpt}
                                  </p>
                                  {article.externalUrl && (
                                    <div className="flex items-center gap-1 text-xs text-slate-600">
                                      <ExternalLink className="w-3 h-3" />
                                      <span>Lien externe configuré</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                  <button
                                    onClick={() => handleEdit(article)}
                                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                    title="Modifier">
                                    <Edit className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(article.id)}
                                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                                    title="Supprimer">
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section actualités non publiées */}
                    {unpublishedPaginated.length > 0 && (
                      <div className="bg-white">
                        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Brouillons ({filteredNews.filter(a => !a.published).length})
                          </h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {unpublishedPaginated.map((article) => (
                            <div
                              key={article.id}
                              className="p-6 hover:bg-gray-50 transition-colors bg-gray-50/50">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-700 truncate">
                                      {article.title}
                                    </h3>
                                    {article.featured && (
                                      <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                        <Star className="w-3 h-3" /> Vedette
                                      </span>
                                    )}
                                    <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                                      Brouillon
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
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
                                      {article.category}
                                    </span>
                                  </div>
                                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                    {article.excerpt}
                                  </p>
                                  {article.externalUrl && (
                                    <div className="flex items-center gap-1 text-xs text-slate-600">
                                      <ExternalLink className="w-3 h-3" />
                                      <span>Lien externe configuré</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                  <button
                                    onClick={() => handleEdit(article)}
                                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                    title="Modifier">
                                    <Edit className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(article.id)}
                                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                                    title="Supprimer">
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Affichage {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredNews.length)} sur {filteredNews.length} résultats
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                          Précédent
                        </button>
                        <span className="px-3 py-1 text-sm bg-slate-100 text-slate-800 rounded font-medium">
                          {currentPage} / {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
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
}
export default AdminNews;