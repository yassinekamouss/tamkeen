import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import { Building2, User2 } from "lucide-react"; // icônes Lucide

interface Test {
  _id: string;
  secteurTravail: string;
  region: string;
  statutJuridique?: string;
  anneeCreation: number;
  chiffreAffaire?: number;
  montantPrevisionnelInvestissement: number;
  programmesEligibles: string[];
  personne: {
    _id: string;
    type: "physique" | "morale";
    nom?: string;
    prenom?: string;
    denomination?: string;
    email: string;
    telephone: string;
  };
}

const UserDetails = () => {
  const { id } = useParams();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios
        .get(`test/eligibilite/personne/${id}`)
        .then((res) => {
          setTests(res.data.tests);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erreur lors du chargement :", err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <p className="p-4">Chargement...</p>;

  const personne = tests[0]?.personne;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-8">
          {/* Panneau d'informations utilisateur */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm sticky top-6">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    {personne?.type === "morale" ? (
                      <Building2 className="w-5 h-5 text-slate-600" />
                    ) : (
                      <User2 className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {personne?.type === "morale"
                        ? "Personne morale"
                        : "Personne physique"}
                    </h2>
                    <p className="text-sm text-slate-500">ID: {id}</p>
                  </div>
                </div>

                {personne && (
                  <div className="space-y-3">
                    {personne.type === "morale" ? (
                      <div className="space-y-1">
                        <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Dénomination
                        </dt>
                        <dd className="text-sm font-medium text-slate-900">
                          {personne.denomination}
                        </dd>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Nom complet
                          </dt>
                          <dd className="text-sm font-medium text-slate-900">
                            {personne.nom} {personne.prenom}
                          </dd>
                        </div>
                      </>
                    )}
                    <div className="space-y-1">
                      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Email
                      </dt>
                      <dd className="text-sm text-slate-700 break-all">
                        {personne.email}
                      </dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Téléphone
                      </dt>
                      <dd className="text-sm text-slate-700">
                        {personne.telephone}
                      </dd>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {tests.length}
                  </div>
                  <div className="text-sm text-slate-500">
                    Test(s) effectué(s)
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-slate-900">
                      {
                        tests.filter(
                          (test) => test.programmesEligibles.length > 0
                        ).length
                      }
                    </div>
                    <div className="text-sm text-slate-500">
                      Test(s) éligible(s)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Zone principale des tests */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Historique des tests d'éligibilité
              </h1>
              <p className="text-slate-600">
                Consultez l'ensemble des tests effectués et leurs résultats
              </p>
            </div>

            {tests.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User2 className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Aucun test trouvé
                </h3>
                <p className="text-slate-500">
                  Cette personne n'a encore effectué aucun test d'éligibilité.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tests.map((test, index) => (
                  <div
                    key={test._id}
                    className="bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-all duration-200">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              Test #{test._id.slice(-6)}
                            </h3>
                            <p className="text-sm text-slate-500">
                              ID: {test._id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {test.programmesEligibles.length > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              ✓ Éligible
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              ✕ Non éligible
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-slate-900 border-b border-slate-100 pb-2">
                            Informations générales
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <dt className="text-xs font-medium text-slate-500 mb-1">
                                Secteur d'activité
                              </dt>
                              <dd className="text-sm text-slate-900">
                                {test.secteurTravail}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs font-medium text-slate-500 mb-1">
                                Région
                              </dt>
                              <dd className="text-sm text-slate-900">
                                {test.region}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs font-medium text-slate-500 mb-1">
                                Statut juridique
                              </dt>
                              <dd className="text-sm text-slate-900">
                                {test.statutJuridique || "Non spécifié"}
                              </dd>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-slate-900 border-b border-slate-100 pb-2">
                            Données financières
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <dt className="text-xs font-medium text-slate-500 mb-1">
                                Année de création
                              </dt>
                              <dd className="text-sm text-slate-900">
                                {test.anneeCreation}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs font-medium text-slate-500 mb-1">
                                Chiffre d'affaires
                              </dt>
                              <dd className="text-sm text-slate-900">
                                {test.chiffreAffaire
                                  ? `${test.chiffreAffaire.toLocaleString()} MAD`
                                  : "Non spécifié"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs font-medium text-slate-500 mb-1">
                                Montant d'investissement
                              </dt>
                              <dd className="text-sm text-slate-900">
                                {test.montantPrevisionnelInvestissement
                                  ? `${test.montantPrevisionnelInvestissement.toLocaleString()} MAD`
                                  : "Non spécifié"}
                              </dd>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-slate-900 border-b border-slate-100 pb-2">
                            Résultats
                          </h4>
                          <div>
                            <dt className="text-xs font-medium text-slate-500 mb-2">
                              Programmes éligibles
                            </dt>
                            {test.programmesEligibles.length > 0 ? (
                              <div className="space-y-1">
                                {test.programmesEligibles.map(
                                  (programme, idx) => (
                                    <dd
                                      key={idx}
                                      className="text-sm text-slate-900 bg-slate-50 px-2 py-1 rounded">
                                      {programme}
                                    </dd>
                                  )
                                )}
                              </div>
                            ) : (
                              <dd className="text-sm text-slate-500 italic">
                                Aucun programme éligible
                              </dd>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
