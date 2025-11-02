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
    imageFile: null, // AJOUTÉ : pour le nouvel objet File
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

      // catégories statiques
      const staticCategories = ["Subventions Européennes", "Subventions Nationales", "Success Stories", "Entrepreneuriat Féminin", "Guides & Ressources", "Partenariats", "Services Tamkeen", "Export & International", "Alertes Financement"];

      // fusion dynamique + statique en évitant les doublons
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
  // NOUVEAU : Fonction dédiée pour l'input de type File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      // 1. Validation basique (taille, type si nécessaire)
      // 2. Création d'une URL locale temporaire pour l'aperçu
      const imageUrl = URL.createObjectURL(file);

      // Stocke l'objet File ET l'URL temporaire pour l'aperçu
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
        imageFile: file,
      }));
      setImageError("");
    } else {
      // Si l'utilisateur annule la sélection de fichier
      setFormData((prev) => ({
        ...prev,
        imageFile: null,
      }));
    }
  };
  const resetForm = () => {
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
    });
    setEditingNews(null);
    setError("");
  };

  // AdminNews.tsx (Suite)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Créer un objet FormData
      const formDataToSend = new FormData();

      // 2. Ajouter les champs de texte
      formDataToSend.append("title", formData.title);
      formDataToSend.append("excerpt", formData.excerpt);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("featured", String(formData.featured)); // Convertir le booléen en chaîne
      formDataToSend.append("published", String(!!formData.published)); // Convert to "true" or "false"

      // Ajouter les champs optionnels (vérifier qu'ils existent pour éviter 'null' ou 'undefined' dans FormData)
      if (formData.externalUrl) {
        formDataToSend.append("externalUrl", formData.externalUrl);
      }

      // 3. Gérer l'image :
      if (formData.imageFile) {
        // Si un NOUVEAU fichier est sélectionné
        formDataToSend.append("image", formData.imageFile);
      } else if (!editingNews && !formData.image) {
        // Optionnel : Vérification si l'image est requise lors de la création
        // setError("Veuillez sélectionner une image pour la création.");
        // setLoading(false);
        // return;

      } else if (editingNews && !formData.imageFile) {
        // IMPORTANT : Si on est en mode édition et qu'il n'y a pas de nouveau fichier (imageFile est null),
        // on ajoute l'ancienne URL pour indiquer au backend de la conserver.
        formDataToSend.append("image", formData.image ?? "");
      }

      // 4. Appel du service API
      if (editingNews) {
        // Pour la mise à jour, on passe l'ID et le FormData
        await newsService.updateNews(editingNews.id, formDataToSend);
      } else {
        // Pour la création, on passe le FormData
        await newsService.createNews(formDataToSend);
      }

      // ... (messages de succès, resetForm, loadNews)
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
      imageFile: null, // Pas de fichier sélectionné au départ
      category: newsItem.category,
      author: newsItem.author,
      featured: newsItem.featured,
      externalUrl: newsItem.externalUrl || "",
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

  // Filtrer et paginer les actualités
  const filteredNews = news.filter(
    (article) =>
      article.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      article.author.toLowerCase().includes(searchFilter.toLowerCase()) ||
      article.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = filteredNews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Réinitialiser la page quand le filtre change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(e.target.value);
    setCurrentPage(1);
  };


//dragger les images 
// AdminNews.tsx (Partie état et fonctions)
const [isDragging, setIsDragging] = useState(false); 

const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => { // Notez le type d'événement
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
    // Optionnel : Réinitialiser la valeur de l'input caché pour permettre la resélection
    // (cela peut être plus complexe avec React et n'est souvent pas nécessaire)
    setImageError("");
  } else {
    // Gérez le cas où le fichier n'est pas une image
    setImageError("Le fichier déposé n'est pas une image valide (PNG/JPG requis).");
  }
};
// ... handleFileChange reste le même

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

        {/* Messages de succès et d'erreur */}
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
          {/* Formulaire à gauche - FIXED */}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Actualité en vedette
                    </span>
                  </label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contenu détaillé de l'actualité"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image de l'actualité *
                  </label>

                  {/* 💡 NOUVEAU : La balise <label> englobe maintenant toute la zone cliquable et gère le Drag/Drop */}
                  <label
                    htmlFor="image-upload"
                    className={`
      mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md bg-white 
      transition-colors cursor-pointer relative group w-full 
      ${isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:bg-gray-50 border-gray-300'
                      }
    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-10 w-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        {/* Le SPAN reste ici, mais le label parent gère la fonctionnalité */}
                        <span className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          Télécharger un fichier
                        </span>
                        <p className="pl-1">ou glisser-déposer</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, max 5MB
                      </p>

                      {/* L'INPUT EST TOUJOURS DANS LE LABEL ET CACHÉ */}
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileChange}
                      />

                      {/* Afficher le nom du fichier ou de l'URL existante */}
                      {formData.imageFile ? (
                        <p className="text-sm font-medium text-gray-900 truncate mt-2">
                          **Fichier prêt:** {formData.imageFile.name}
                        </p>
                      ) : formData.image ? (
                        <p className="text-sm text-gray-500 truncate mt-2">
                          **Image actuelle:** {formData.image.substring(formData.image.lastIndexOf('/') + 1)}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 mt-2">
                          Aucun fichier sélectionné
                        </p>
                      )}
                    </div>
                  </label>

                  {/* L'aperçu et l'erreur restent en dehors du label pour éviter les problèmes de style */}
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
                          src={formData.image}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="bg-white rounded-lg shadow-md sticky top-4">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Actualités publiées ({filteredNews.length})
                  </h2>
                </div>

                {/* Barre de recherche */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher par titre, auteur ou catégorie..."
                    value={searchFilter}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                <div className="divide-y divide-gray-200">
                  {loading && news.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      Chargement des actualités...
                    </div>
                  ) : paginatedNews.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      {searchFilter
                        ? "Aucune actualité trouvée pour cette recherche"
                        : "Aucune actualité publiée pour le moment"}
                    </div>
                  ) : (
                    paginatedNews.map((article) => (
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
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                  <Star className="w-3 h-3" /> Featured
                                </span>
                              )}
                            </div>{" "}
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {article.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(article.publishedAt)}
                              </span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {article.category}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                              {article.excerpt}
                            </p>
                            {article.externalUrl && (
                              <div className="flex items-center gap-1 text-xs text-blue-600">
                                <ExternalLink className="w-3 h-3" />
                                <span>Lien externe configuré</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleEdit(article)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Modifier">
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(article.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Supprimer">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Affichage {startIndex + 1} à{" "}
                        {Math.min(
                          startIndex + itemsPerPage,
                          filteredNews.length
                        )}{" "}
                        sur {filteredNews.length} résultats
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                          Précédent
                        </button>
                        <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                          {currentPage} / {totalPages}
                        </span>
                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
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
};

export default AdminNews;
