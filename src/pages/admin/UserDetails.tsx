import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import { Building2, User2 } from "lucide-react"; // icônes Lucide

interface Test {
    _id: string;
    secteurActivite: string;
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
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
            {/* ✅ Colonne gauche - Infos personne */}
            <div className="w-full md:w-1/3 bg-white shadow rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-5">
                    {personne?.type === "morale" ? (
                        <Building2 className="w-6 h-6 text-gray-600" />
                    ) : (
                        <User2 className="w-6 h-6 text-gray-600" />
                    )}
                    <h2 className="text-lg font-semibold text-gray-800 capitalize">
                        {personne?.type === "morale" ? "Personne morale" : "Personne physique"}
                    </h2>
                </div>

                {personne && (
                    <div className="space-y-2 text-sm text-gray-700">
                        {personne.type === "morale" ? (
                            <p><span className="font-medium">Dénomination :</span> {personne.denomination}</p>
                        ) : (
                            <>
                                <p><span className="font-medium">Nom :</span> {personne.nom}</p>
                                <p><span className="font-medium">Prénom :</span> {personne.prenom}</p>
                            </>
                        )}
                        <p><span className="font-medium">Email :</span> {personne.email}</p>
                        <p><span className="font-medium">Téléphone :</span> {personne.telephone}</p>
                    </div>
                )}
            </div>

            {/* ✅ Colonne droite - Tests */}
            <div className="w-full md:w-2/3">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Tests effectués</h3>

                {tests.length === 0 ? (
                    <p className="text-gray-500 italic">Aucun test trouvé pour cette personne.</p>
                ) : (
                    <div className="space-y-4">
                        {tests.map((test) => (
                            <div
                                key={test._id}
                                className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                            >
                                <h4 className="text-md font-semibold text-gray-700 mb-3">
                                    Test #{test._id.slice(-5)}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                                    <p><span className="font-medium">Secteur d’activité :</span> {test.secteurActivite}</p>
                                    <p><span className="font-medium">Région :</span> {test.region}</p>
                                    <p><span className="font-medium">Statut juridique :</span> {test.statutJuridique || "-"}</p>
                                    <p><span className="font-medium">Année de création :</span> {test.anneeCreation}</p>
                                    <p><span className="font-medium">Chiffre d'affaires :</span> {test.chiffreAffaire ?? "-"}</p>
                                    <p><span className="font-medium">Montant prévisionnel :</span> {test.montantPrevisionnelInvestissement}</p>
                                    <p className="col-span-2">
                                        <span className="font-medium">Programmes éligibles :</span>{" "}
                                        {test.programmesEligibles.length > 0
                                            ? test.programmesEligibles.join(", ")
                                            : "Aucun"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

    );
};

export default UserDetails;
