import axios from "../../api/axios";
import React, { useEffect, useState } from "react";
import {
    Plus, Edit,
    Trash2,
    Handshake,
    Upload,
} from "lucide-react";

interface Partenaire {
    _id: string;
    nom: string;
    url: string;
    img: string;
    imageFile?: File;
}

const Partenaires: React.FC = () => {
    const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    // Etats pour la gestion d'images (upload + preview + drag & drop)
    const [isDragging, setIsDragging] = useState(false);
    const [imageError, setImageError] = useState<string>("");

    //pour gérer le modal d'ajout

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // const [newPartenaire, setNewPartenaire] = useState<Partenaire | null>(null);

    // Pour gérer le modal de modification
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPartenaire, setCurrentPartenaire] = useState<Partenaire | null>(
        null
    );

    const adminProfile = JSON.parse(localStorage.getItem("adminProfile") || "null");

    const isAdministrator = adminProfile?.role === "Administrateur";


    const fetchPartenaires = async () => {
        try {
            const response = await axios.get("/partenaires");
            setPartenaires(response.data);
        } catch {
            setError("Erreur lors du chargement des partenaires.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchPartenaires();
    }, []);


    const updatePartenaire = async (updatedPartenaire: Partenaire) => {
        try {
            let response;
            if (updatedPartenaire.imageFile) {
                const fd = new FormData();
                fd.append("nom", updatedPartenaire.nom);
                fd.append("url", updatedPartenaire.url);
                // Changer "img" en "image"
                fd.append("image", updatedPartenaire.imageFile as File);

                response = await axios.put(`/partenaires/${updatedPartenaire._id}`, fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                response = await axios.put(
                    `/partenaires/${updatedPartenaire._id}`,
                    {
                        nom: updatedPartenaire.nom,
                        url: updatedPartenaire.url,
                        img: updatedPartenaire.img,
                    }
                );
            }

            setPartenaires((prev) =>
                prev.map((p) =>
                    p._id === updatedPartenaire._id ? response.data.partenaire : p
                )
            );

            setIsModalOpen(false);
            setCurrentPartenaire(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    };

    // Supprimer un partenaire
    const handleDelete = async (id: string) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce partenaire ?")) {
            try {
                await axios.delete(`/partenaires/${id}`);
                setPartenaires((prev) => prev.filter((p) => p._id !== id));
            } catch (error) {
                console.error("Erreur lors de la suppression :", error);
            }
        }
    };

    //ajouter partenaire : 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentPartenaire?.imageFile) {
                const fd = new FormData();
                fd.append("nom", currentPartenaire.nom);
                fd.append("url", currentPartenaire.url);
                // Changer "img" en "image" pour correspondre à multer
                fd.append("image", currentPartenaire.imageFile);

                await axios.post("/partenaires/add", fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await axios.post("/partenaires/add", {
                    nom: currentPartenaire?.nom,
                    url: currentPartenaire?.url,
                });
            }
            await fetchPartenaires();
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
        }
    }

    // Handlers pour input file et drag & drop
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (!currentPartenaire) return;

        if (file) {
            if (!file.type.startsWith("image/")) {
                setImageError("Le fichier sélectionné n'est pas une image valide.");
                return;
            }

            const imageUrl = URL.createObjectURL(file);
            setCurrentPartenaire({ ...currentPartenaire, img: imageUrl, imageFile: file });
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
        if (!currentPartenaire) return;

        if (file && file.type.startsWith("image/")) {
            const imageUrl = URL.createObjectURL(file);
            setCurrentPartenaire({ ...currentPartenaire, img: imageUrl, imageFile: file });
            setImageError("");
        } else {
            setImageError("Le fichier déposé n'est pas une image valide (PNG/JPG requis).");
        }
    };




    if (loading) return <p className="text-center mt-8">Chargement...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

    return (
        <div className="p-8">

            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                            <Handshake className="w-8 h-8 mr-3 text-gray-600" />
                            Gestion des Partenaires
                        </h1>
                        <p className="text-gray-600">
                            Gérer les Partenaires
                        </p>
                    </div>
                    {isAdministrator && (
                        <button
                            onClick={() => {
                                setCurrentPartenaire({ _id: "", nom: "", url: "", img: "" });
                                setIsAddModalOpen(true);
                            }}
                            className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center">
                            <Plus className="w-5 h-5 mr-2" />
                            Nouveau Partenaire
                        </button>
                    )}
                </div>
            </div>

            {partenaires.length === 0 ? (
                <p className="text-gray-500">Aucun partenaire trouvé.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {partenaires.map((partenaire) => (
                        <div
                            key={partenaire._id}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-3 rounded-t-xl ">
                                <h3 className="text-lg font-bold text-white text-center truncate">
                                    {partenaire.nom}
                                </h3>
                            </div>

                            {/* Image */}
                            <img
                                src={partenaire.img}
                                alt={partenaire.nom}
                                className="w-full h-40 object-cover"
                            />

                            {/* Content */}
                            <div className="p-4 flex flex-col gap-3">
                                {/* Lien */}
                                <a
                                    href={partenaire.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 text-sm truncate hover:text-gray-700"
                                >
                                    {partenaire.url}
                                </a>

                                {/* Boutons (si admin) */}
                                {isAdministrator && (
                                    <div className="flex gap-2">
                                        {/* Bouton Modifier */}
                                        <button
                                            onClick={() => {
                                                setCurrentPartenaire(partenaire);
                                                setIsModalOpen(true);
                                            }}
                                            className="flex-1 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            <Edit className="w-4 h-4 mr-1" />

                                        </button>

                                        {/* Bouton Supprimer */}
                                        <button
                                            onClick={() => handleDelete(partenaire._id)}
                                            className="flex-1 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />

                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>


            )}

            {/* Modal Ajouter */}
            {isAddModalOpen && currentPartenaire && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Ajouter un partenaire</h2>
                        <form
                            onSubmit={(e) => {
                                handleSubmit(e);
                                setIsAddModalOpen(false);
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium">Nom</label>
                                <input
                                    type="text"
                                    value={currentPartenaire.nom}
                                    onChange={(e) =>
                                        setCurrentPartenaire({
                                            ...currentPartenaire,
                                            nom: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">URL</label>
                                <input
                                    type="text"
                                    value={currentPartenaire.url}
                                    onChange={(e) =>
                                        setCurrentPartenaire({
                                            ...currentPartenaire,
                                            url: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Image du partenaire</label>

                                <label
                                    htmlFor="partner-image-upload"
                                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md bg-white transition-colors cursor-pointer relative group w-full ${isDragging ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50 border-gray-300'}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <span className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">Télécharger un fichier</span>
                                            <p className="pl-1">ou glisser-déposer</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, max 5MB</p>

                                        <input
                                            id="partner-image-upload"
                                            name="partner-image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                        />

                                        {currentPartenaire.imageFile ? (
                                            <p className="text-sm font-medium text-gray-900 truncate mt-2">**Fichier prêt:** {currentPartenaire.imageFile.name}</p>
                                        ) : currentPartenaire.img ? (
                                            <p className="text-sm text-gray-500 truncate mt-2">**Image actuelle:** {currentPartenaire.img.substring(currentPartenaire.img.lastIndexOf('/') + 1)}</p>
                                        ) : (
                                            <p className="text-sm text-gray-500 mt-2">Aucun fichier sélectionné</p>
                                        )}
                                    </div>
                                </label>

                                {imageError && <p className="text-red-600 text-sm mt-1">{imageError}</p>}

                                {/* Aperçu */}
                                {currentPartenaire.img && (
                                    <div className="mt-3">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Aperçu:</p>
                                        <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                                            <img src={currentPartenaire.img} alt={currentPartenaire.nom} className="w-full h-28 object-cover rounded" />
                                        </div>
                                    </div>
                                )}

                                {/* URL manuelle (facultatif) */}
                                <div className="mt-3">
                                    <label className="block text-sm font-medium">Image (URL) — facultatif</label>
                                    <input
                                        type="text"
                                        value={currentPartenaire.img}
                                        onChange={(e) =>
                                            setCurrentPartenaire({ ...currentPartenaire, img: e.target.value, imageFile: undefined })
                                        }
                                        className="w-full border rounded p-2"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && currentPartenaire && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            Modifier les informations
                        </h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                updatePartenaire(currentPartenaire);
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                                <input
                                    type="text"
                                    value={currentPartenaire.nom}
                                    onChange={(e) =>
                                        setCurrentPartenaire({
                                            ...currentPartenaire,
                                            nom: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                                <input
                                    type="text"
                                    value={currentPartenaire.url}
                                    onChange={(e) =>
                                        setCurrentPartenaire({
                                            ...currentPartenaire,
                                            url: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image du partenaire</label>

                                <label
                                    htmlFor="partner-image-upload-edit"
                                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md bg-white transition-colors cursor-pointer relative group w-full ${isDragging ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50 border-gray-300'}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <span className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">Télécharger un fichier</span>
                                            <p className="pl-1">ou glisser-déposer</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, max 5MB</p>

                                        <input
                                            id="partner-image-upload-edit"
                                            name="partner-image-upload-edit"
                                            type="file"
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                        />

                                        {currentPartenaire.imageFile ? (
                                            <p className="text-sm font-medium text-gray-900 truncate mt-2">**Fichier prêt:** {currentPartenaire.imageFile.name}</p>
                                        ) : currentPartenaire.img ? (
                                            <p className="text-sm text-gray-500 truncate mt-2">**Image actuelle:** {currentPartenaire.img.substring(currentPartenaire.img.lastIndexOf('/') + 1)}</p>
                                        ) : (
                                            <p className="text-sm text-gray-500 mt-2">Aucun fichier sélectionné</p>
                                        )}
                                    </div>
                                </label>

                                {imageError && <p className="text-red-600 text-sm mt-1">{imageError}</p>}

                                {currentPartenaire.img && (
                                    <div className="mt-3">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Aperçu:</p>
                                        <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                                            <img src={currentPartenaire.img} alt={currentPartenaire.nom} className="w-full h-28 object-cover rounded" />
                                        </div>
                                    </div>
                                )}

                                <div className="mt-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image (URL) — facultatif</label>
                                    <input
                                        type="text"
                                        value={currentPartenaire.img}
                                        onChange={(e) =>
                                            setCurrentPartenaire({ ...currentPartenaire, img: e.target.value, imageFile: undefined })
                                        }
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">

                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 text-sm font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900 transition">

                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Partenaires;
