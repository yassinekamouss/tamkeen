import { useEffect, useRef, useState } from "react";
import { getAdminSocket } from "../../api/socket";
import type { FormSubmittedEventDTO } from "../../types/test";

export function useAdminSocket(onForm?: (e: FormSubmittedEventDTO) => void) {
  const [connected, setConnected] = useState(false);
  const unreadRef = useRef(0);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const s = getAdminSocket();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);

  const onFormSubmitted = (e: FormSubmittedEventDTO) => {
      unreadRef.current += 1;
      setUnread(unreadRef.current);
      onForm?.(e);
    };

    s.on("form:submitted", onFormSubmitted);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off("form:submitted", onFormSubmitted);
    };
  }, [onForm]);

  const resetUnread = () => {
    unreadRef.current = 0;
    setUnread(0);
  };

  return { connected, unread, resetUnread };
}
