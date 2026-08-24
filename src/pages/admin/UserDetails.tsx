import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import { Building2, User2 } from "lucide-react";
import TestCard from "../../components/admin/TestCard";
import type { TestItem, UserLite } from "../../types/test";

const UserDetails = () => {
  const { id } = useParams();
  const [tests, setTests] = useState<TestItem[]>([]);
  const [userInfo, setUserInfo] = useState<UserLite | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        axios.get(`test/eligibilite/user/${id}`).catch(() => ({ data: { tests: [] } })),
        axios.get(`users/${id}`).catch(() => null),
      ]).then(([testsRes, userRes]) => {
        if (testsRes.data && testsRes.data.tests) {
          setTests(testsRes.data.tests);
        }
        if (userRes && userRes.data) {
          setUserInfo(userRes.data);
        }
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <p className="p-4">Chargement...</p>;

  const userObj = userInfo || tests[0]?.user || tests[0]?.personne || tests[0]?.client;

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-8">
          {/* Panneau d'informations utilisateur */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm sticky top-6">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    {userObj?.applicantType === "morale" ? (
                      <Building2 className="w-5 h-5 text-slate-600" />
                    ) : (
                      <User2 className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {userObj?.applicantType === "morale"
                        ? "Personne morale"
                        : "Personne physique"}
                    </h2>
                    <p className="text-sm text-slate-500">ID: {id}</p>
                  </div>
                </div>

                {userObj && (
                  <div className="space-y-3">
                    {userObj.applicantType === "morale" ? (
                      <div className="space-y-1">
                        <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Dénomination
                        </dt>
                        <dd className="text-sm font-medium text-slate-900">
                          {userObj.nomEntreprise || "—"}
                        </dd>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Nom complet
                          </dt>
                          <dd className="text-sm font-medium text-slate-900">
                            {userObj.nom} {userObj.prenom}
                          </dd>
                        </div>
                        <div className="space-y-1">
                          <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Téléphone(s)
                          </dt>
                          <dd className="text-sm text-slate-700">
                            {Array.isArray(userObj.telephones) &&
                            userObj.telephones.length > 0
                              ? userObj.telephones.join(", ")
                              : "—"}
                          </dd>
                        </div>
                      </>
                    )}
                    <div className="space-y-1">
                      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Email
                      </dt>
                      <dd className="text-sm text-slate-700 break-all">
                        {userObj.email}
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
                    <div className="text-2xl font-bold text-slate-900">
                      {
                        tests.filter(
                          (test) => test.programmesEligibles && test.programmesEligibles.length > 0
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
                  Cet utilisateur n'a encore effectué aucun test d'éligibilité.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tests.map((test, index) => (
                  <TestCard
                    key={test._id}
                    test={test}
                    index={index}
                    hidePerson
                  />
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
