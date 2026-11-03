import { useNavigation, usePreventRemove } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";

export function useUnsavedChanges(dirty: boolean, busy = false) {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [bypass, setBypass] = useState(false);
  const pendingExit = useRef<(() => void) | null>(null);
  const allowedExit = useRef<(() => void) | null>(null);
  usePreventRemove((dirty || busy) && !bypass, ({ data }) => {
    if (busy) return;
    pendingExit.current = () => navigation.dispatch(data.action);
    setVisible(true);
  });
  useEffect(() => {
    if (bypass) {
      const action = allowedExit.current;
      allowedExit.current = null;
      action?.();
    }
  }, [bypass]);
  const allowExit = (action: () => void) => { allowedExit.current = action; setBypass(true); };
  return {
    visible,
    keepEditing: () => { pendingExit.current = null; setVisible(false); },
    discard: () => { const action = pendingExit.current; setVisible(false); if (action) allowExit(action); },
    allowExit,
  };
}
