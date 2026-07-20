import React from "react";
import { Globe, Upload } from "lucide-react";
import type { CreateNewsItem, NewsItem, MultilingualField } from "../../../hooks/admin/useNews";

interface NewsFormProps {
  formData: CreateNewsItem;
  categories: MultilingualField[];
  currentLang: "fr" | "ar";
  editingNews: NewsItem | null;
  loading: boolean;
  isDragging: boolean;
  imageError: string;
  onLangChange: (lang: "fr" | "ar") => void;
  onMultilingualChange: (
    field: "title" | "excerpt" | "content",
    lang: "fr" | "ar",
    value: string
  ) => void;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onCategoryChange: (index: number) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLLabelElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLLabelElement>) => void;
  onDrop: (e: React.DragEvent<HTMLLabelElement>) => void;
  onTogglePublished: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const NewsForm: React.FC<NewsFormProps> = ({
  formData,
  categories,
  currentLang,
  editingNews,
  loading,
  isDragging,
  imageError,
  onLangChange,
  onMultilingualChange,
  onInputChange,
  onCategoryChange,
  onFileChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onTogglePublished,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {editingNews ? "Modifier" : "Nouvelle actualité"}
        </h2>
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => onLangChange("fr")}
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
            onClick={() => onLangChange("ar")}
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
              onMultilingualChange("title", currentLang, e.target.value)
            }
            required
            dir={currentLang === "ar" ? "rtl" : "ltr"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder={
              currentLang === "fr" ? "Titre de l'actualité" : "عنوان الخبر"
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
            onChange={onInputChange}
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
            value={categories.findIndex((cat) => cat.fr === formData.category.fr)}
            onChange={(e) => onCategoryChange(Number(e.target.value))}
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
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={onInputChange}
              className="rounded border-gray-300 text-slate-600 focus:ring-slate-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              En vedette
            </span>
          </label>

          <div className="flex items-center">
            <span className="mr-3 text-sm font-medium text-gray-700">Publié</span>
            <button
              type="button"
              onClick={onTogglePublished}
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
              onMultilingualChange("excerpt", currentLang, e.target.value)
            }
            required
            rows={3}
            dir={currentLang === "ar" ? "rtl" : "ltr"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder={
              currentLang === "fr" ? "Résumé de l'actualité" : "ملخص الخبر"
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
              onMultilingualChange("content", currentLang, e.target.value)
            }
            required
            rows={6}
            dir={currentLang === "ar" ? "rtl" : "ltr"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder={
              currentLang === "fr" ? "Contenu détaillé" : "المحتوى التفصيلي"
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
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-10 w-10 text-gray-400" />
              <div className="flex text-sm text-gray-600 justify-center">
                <span className="font-medium text-slate-600">Télécharger</span>
                <p className="pl-1">ou glisser-déposer</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, max 5MB</p>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onFileChange}
              />
            </div>
          </label>
          {imageError && <p className="text-red-600 text-sm mt-1">{imageError}</p>}
          {formData.image && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Aperçu:</p>
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
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="https://site-externe.com"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-600 disabled:opacity-50 font-medium"
          >
            {loading ? "Enregistrement..." : editingNews ? "Modifier" : "Créer"}
          </button>
          {editingNews && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            >
              Annuler
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsForm;
