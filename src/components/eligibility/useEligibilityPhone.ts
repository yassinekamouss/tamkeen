import { useState, useEffect } from "react";
import api from "../../api/axios";
import type { FormData } from "./types";

export function useEligibilityPhone(
  email: string,
  telephone: string | undefined,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
) {
  const [availablePhones, setAvailablePhones] = useState<string[]>([]);
  const [phoneMode, setPhoneMode] = useState<"select" | "new">("new");

  useEffect(() => {
    const isValidEmail = /\S+@\S+\.\S+/.test(email);
    if (!isValidEmail) {
      setAvailablePhones([]);
      setPhoneMode("new");
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        const { data } = await api.get("/test/eligibilite/phones", {
          params: { email },
        });
        if (cancelled) return;
        const phones: string[] = data?.telephones || [];
        setAvailablePhones(phones);
        if (phones.length > 0) {
          setPhoneMode("select");
          const current = telephone;
          const selected = current && phones.includes(current) ? current : phones[0];
          if (selected) {
            setFormData((prev) => ({ ...prev, telephone: selected }));
          }
        } else {
          setPhoneMode("new");
        }
      } catch {
        setAvailablePhones([]);
        setPhoneMode("new");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [email, telephone, setFormData]);

  return {
    availablePhones,
    phoneMode,
    setPhoneMode,
  };
}
