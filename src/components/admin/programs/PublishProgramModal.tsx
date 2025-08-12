import React, { useState } from 'react';
import { X, Share, Upload, Globe, Languages } from 'lucide-react';




interface Program {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  DateDebut: string;
  DateFin: string;
  link: string;
    hero?: {
    isHero: boolean;
    image: string;
    titleFr: string;
    titleAr: string;
    subtitleFr: string;
    subtitleAr: string;
    descriptionFr: string;
    descriptionAr: string;
  };
  criteres: {
    secteurActivite: string[];
    statutJuridique: string[];
    applicantType: string[];
    montantInvestissement: string[];
    age?: {
      minAge: number | null;
      maxAge: number | null;
    };
    sexe?: string[];
    chiffreAffaire: {
      chiffreAffaireMin: number | null;
      chiffreAffaireMax: number | null;
    };
    anneeCreation: (string | number)[];
    region: string[];
  };
}


interface PublishModalProps {
  show: boolean;
  onClose: () => void;
  program: Program | null;
  onSubmit: (heroData: any) => Promise<void>;
}

interface HeroData {
  isHero: boolean;
  image: string;
  titleFr: string;
  titleAr: string;
  subtitleFr: string;
  subtitleAr: string;
  descriptionFr: string;
  descriptionAr: string;
}

const PublishProgramModal: React.FC<PublishModalProps> = ({ show, onClose, program, onSubmit }) => {
  const [heroData, setHeroData] = useState<HeroData>({
    isHero: program?.hero?.isHero || false,
    image: program?.hero?.image || "",
    titleFr: program?.hero?.titleFr || "",
    titleAr: program?.hero?.titleAr || "",
    subtitleFr: program?.hero?.subtitleFr || "",
    subtitleAr: program?.hero?.subtitleAr || "",
    descriptionFr: program?.hero?.descriptionFr || "",
    descriptionAr: program?.hero?.descriptionAr || "",
  });

  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState("");

  const handleImageChange = (url: string) => {
    setHeroData({ ...heroData, image: url });
    setImageError("");
    
    // Test de l'image
    if (url) {
      const img = new Image();
      img.onload = () => setImageError("");
      img.onerror = () => setImageError("URL de l'image invalide");
      img.src = url;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(heroData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!show || !program) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Share className="w-6 h-6 text-white mr-3" />
              <div>
                <h2 className="text-xl font-bold text-white">
                  {heroData.isHero ? "Modifier la publication" : "Publier le programme"}
                </h2>
                <p className="text-blue-100 text-sm">
                  {program.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-800 p-2 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[calc(95vh-120px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Publication Toggle */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Statut de publication</h3>
                      <p className="text-sm text-gray-600">
                        Publier ce programme sur la page d'accueil
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={heroData.isHero}
                      onChange={(e) => setHeroData({ ...heroData, isHero: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Image Section */}
              <div className="space-y-4">
                <div className="flex items-center mb-3">
                  <Upload className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Image de couverture</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de l'image *
                  </label>
                  <input
                    type="url"
                    required={heroData.isHero}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      imageError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    value={heroData.image}
                    onChange={(e) => handleImageChange(e.target.value)}
                    placeholder="https://exemple.com/image.jpg"
                  />
                  {imageError && (
                    <p className="text-red-600 text-sm mt-1">{imageError}</p>
                  )}
                </div>
                
                {/* Aperçu de l'image */}
                {heroData.image && !imageError && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Aperçu:</p>
                    <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                      <img 
                        src={heroData.image} 
                        alt="Aperçu" 
                        className="max-w-full h-32 object-cover rounded"
                        onError={() => setImageError("Impossible de charger l'image")}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Content Section */}
              {heroData.isHero && (
                <>
                  <div className="flex items-center mb-4">
                    <Languages className="w-5 h-5 text-gray-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Contenu multilingue</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Français */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">FR</div>
                        <h3 className="ml-3 font-semibold text-gray-900">Contenu Français</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Titre principal *
                          </label>
                          <input
                            type="text"
                            required={heroData.isHero}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={heroData.titleFr}
                            onChange={(e) => setHeroData({ ...heroData, titleFr: e.target.value })}
                            placeholder="Ex: Programmes d'aide aux entrepreneurs"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sous-titre *
                          </label>
                          <input
                            type="text"
                            required={heroData.isHero}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={heroData.subtitleFr}
                            onChange={(e) => setHeroData({ ...heroData, subtitleFr: e.target.value })}
                            placeholder="Ex: Développez votre business avec nos solutions"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                          </label>
                          <textarea
                            rows={4}
                            required={heroData.isHero}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            value={heroData.descriptionFr}
                            onChange={(e) => setHeroData({ ...heroData, descriptionFr: e.target.value })}
                            placeholder="Description détaillée du programme..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Arabe */}
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <div className="flex items-center mb-4">
                        <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">AR</div>
                        <h3 className="ml-3 font-semibold text-gray-900">المحتوى العربي</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            العنوان الرئيسي *
                          </label>
                          <input
                            type="text"
                            required={heroData.isHero}
                            dir="rtl"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={heroData.titleAr}
                            onChange={(e) => setHeroData({ ...heroData, titleAr: e.target.value })}
                            placeholder="مثال: برامج مساعدة رواد الأعمال"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            العنوان الفرعي *
                          </label>
                          <input
                            type="text"
                            required={heroData.isHero}
                            dir="rtl"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={heroData.subtitleAr}
                            onChange={(e) => setHeroData({ ...heroData, subtitleAr: e.target.value })}
                            placeholder="مثال: طوّر عملك مع حلولنا"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            الوصف *
                          </label>
                          <textarea
                            rows={4}
                            required={heroData.isHero}
                            dir="rtl"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            value={heroData.descriptionAr}
                            onChange={(e) => setHeroData({ ...heroData, descriptionAr: e.target.value })}
                            placeholder="وصف مفصل للبرنامج..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || (heroData.isHero && !!imageError)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Traitement...
                  </>
                ) : (
                  <>
                    <Share className="w-4 h-4 mr-2" />
                    {heroData.isHero ? "Publier" : "Dépublier"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublishProgramModal;