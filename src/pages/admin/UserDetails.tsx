// src/pages/DetailsPersonne.tsx
import { useParams } from "react-router-dom";

const UserDetails = () => {
    const { id } = useParams();

    // Tu peux maintenant faire une requête fetch ou axios avec cet id
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Détails de la personne</h2>
            <p>ID de la personne : {id}</p>
            {/* Tu affiches ici les infos de l'autre collection */}
        </div>
    );
};

export default UserDetails;
