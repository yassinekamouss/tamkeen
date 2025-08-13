import React, { useCallback, useEffect, useState } from "react";
import TestCard from "../../components/admin/TestCard";
import { fetchTests } from "../../services/testService";
import type { TestItem } from "../../types/test";
import { REGIONS } from "../../components/eligibility/constants";
import { getAdminSocket } from "../../api/socket";
// Realtime event type not needed here since we refetch on event

type EligibleFilter = "all" | "true" | "false";

type ApplicantType = "" | "physique" | "morale";

const Tests: React.FC = () => {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [eligible, setEligible] = useState<EligibleFilter>("all");
  const [applicantType, setApplicantType] = useState<ApplicantType>("");
  const [region, setRegion] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const [hasMore, setHasMore] = useState(false);

  // no memo key, load() already memoized

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await fetchTests({
        q: q || undefined,
        eligible: eligible === "all" ? undefined : eligible === "true",
        applicantType: applicantType || undefined,
        region: region || undefined,
        page,
        limit,
      });
      setTests(resp.tests);
      setTotal(resp.total);
      setHasMore(resp.hasMore);
    } catch (e) {
      setError("Erreur lors du chargement des tests");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [q, eligible, applicantType, region, page, limit]);

  useEffect(() => {
    load();
  }, [load]);

  // Realtime: listen for new test submissions and prepend
  useEffect(() => {
    const s = getAdminSocket();
    const onNew = () => {
      // Refresh list if on first page and no active filters, so we display accurate data
      if (page !== 1 || q || region || applicantType || eligible !== "all")
        return;
      load();
    };
    s.on("form:submitted", onNew);
    return () => {
      s.off("form:submitted", onNew);
    };
  }, [page, q, region, applicantType, eligible, load]);

  const resetAndSearch = () => setPage(1);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          <svg
            className="inline-block w-8 h-8 mr-3 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Tests d'éligibilité
        </h1>
        <p className="text-gray-600">Historique des tests récents.</p>
      </div>

      {/* Filtres: une seule ligne avec wrap si manque d'espace */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-[280px] flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && resetAndSearch()}
              placeholder="Rechercher (nom, prénom, email)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
            />
          </div>

          <select
            value={eligible}
            onChange={(e) => {
              const val = e.target.value as EligibleFilter;
              setEligible(val);
              resetAndSearch();
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white">
            <option value="all">Tous les statuts</option>
            <option value="true">Éligible</option>
            <option value="false">Non éligible</option>
          </select>

          <select
            value={applicantType}
            onChange={(e) => {
              const val = e.target.value as ApplicantType;
              setApplicantType(val);
              resetAndSearch();
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white">
            <option value="">Tous les types</option>
            <option value="physique">Personne physique</option>
            <option value="morale">Personne morale</option>
          </select>

          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              resetAndSearch();
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white">
            <option value="">Toutes les régions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => {
                setQ("");
                setEligible("all");
                setApplicantType("");
                setRegion("");
                setPage(1);
              }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              Réinitialiser
            </button>
            <button
              onClick={resetAndSearch}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Rechercher
            </button>
          </div>
        </div>
      </div>

      {/* Liste */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-600">
          Chargement…
        </div>
      ) : tests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-600">
          Aucun test trouvé
        </div>
      ) : (
        <div className="space-y-4">
          {tests.map((t, i) => (
            <TestCard key={t._id} test={t} index={(page - 1) * limit + i} />
          ))}
        </div>
      )}

      {/* Pagination simple */}
      <div className="flex items-center justify-between mt-6 text-sm text-slate-600">
        <div>
          Total: <span className="font-medium">{total}</span>
        </div>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`px-3 py-2 border rounded-lg ${
              page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
            }`}>
            Précédent
          </button>
          <span className="px-2 py-2">Page {page}</span>
          <button
            disabled={!hasMore}
            onClick={() => setPage((p) => p + 1)}
            className={`px-3 py-2 border rounded-lg ${
              !hasMore ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
            }`}>
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tests;
