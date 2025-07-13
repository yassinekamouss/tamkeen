import React from "react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
            Politique de Confidentialité
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="prose prose-sm sm:prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 sm:p-6 mb-6 sm:mb-8">
              <p className="text-blue-800 leading-relaxed">
                Bienvenue sur masubvention.ma. La protection de vos données
                personnelles est une priorité absolue pour nous. Cette politique
                de confidentialité a pour but de vous informer sur la manière
                dont nous collectons, utilisons, partageons et protégeons les
                informations que vous nous fournissez lorsque vous utilisez
                notre service de test d'éligibilité.
              </p>
            </div>

            <section className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold mr-2 sm:mr-3">
                  1
                </span>
                Collecte des Données Personnelles
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                Dans le cadre de l'évaluation de votre éligibilité à une
                subvention, nous sommes amenés à collecter les types
                d'informations suivants :
              </p>
              <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>Données d'identification :</strong> Nom, prénom,
                  adresse e-mail, numéro de téléphone, etc.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>
                    Données relatives à votre projet ou entreprise :
                  </strong>{" "}
                  Secteur d'activité, date de création, chiffre d'affaires,
                  effectif.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>Données relatives à votre éligibilité :</strong>{" "}
                  Informations sur votre projet, données financières, et tout
                  autre renseignement nécessaire pour évaluer votre dossier.
                </li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold mr-2 sm:mr-3">
                  2
                </span>
                Utilisation de vos Données
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                Les données que nous collectons sont utilisées exclusivement
                pour les finalités suivantes :
              </p>
              <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>Évaluer votre éligibilité :</strong> Analyser les
                  informations fournies pour déterminer si votre profil
                  correspond aux critères des subventions disponibles.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>Communication :</strong> Vous contacter pour vous
                  informer des résultats de votre test d'éligibilité.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>Amélioration de nos services :</strong> Analyser les
                  données d'utilisation de manière anonyme pour optimiser notre
                  site.
                </li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold mr-2 sm:mr-3">
                  3
                </span>
                Partage des Données
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                Nous nous engageons à ne jamais vendre vos données personnelles
                à des tiers. Vos informations ne seront partagées que dans les
                cas suivants :
              </p>
              <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>Avec votre consentement explicite :</strong> Si vous
                  décidez de poursuivre une demande de subvention.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>Obligations légales :</strong> Si la loi nous y
                  contraint.
                </li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold mr-2 sm:mr-3">
                  4
                </span>
                Vos Droits
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                Conformément à la loi 09-08 relative à la protection des
                personnes physiques à l'égard du traitement des données à
                caractère personnel, vous disposez des droits suivants :
              </p>
              <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>Droit d'accès :</strong> Demander une copie des
                  données que nous détenons sur vous.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>Droit de rectification :</strong> Demander la
                  correction de toute information inexacte.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>Droit d'effacement :</strong> Demander la suppression
                  de vos données.
                </li>
              </ul>
            </section>

            <div className="bg-gray-50 border rounded-lg p-3 sm:p-4">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                Contact
              </h4>
              <p className="text-gray-700 mb-2 text-sm sm:text-base">
                Pour toute question concernant cette politique de
                confidentialité :
              </p>
              <p className="text-gray-800 text-sm sm:text-base">
                <strong>Email :</strong>
                <a
                  href="mailto:contact@masubvention.ma"
                  className="text-blue-600 hover:text-blue-800 ml-1">
                  contact@masubvention.ma
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
