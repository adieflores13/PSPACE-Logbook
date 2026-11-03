import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useAircraft } from "@/context/aircraft-context";
import { useFlights } from "@/context/flight-context";
import { useAuth } from "@/context/auth-context";
import { AppButton, InfoBox } from "@/components/ui/app-ui";
import { DecisionModal } from "@/components/ui/decision-modal";
import { needsLegacyChoice, resolveLegacyRecords } from "@/services/local-records";
import { palette, type } from "@/constants/ui";

export default function LocalDataGate({ children }: { children: ReactNode }) {
  const aircraft = useAircraft();
  const flights = useFlights();
  const { session, offline, signOut } = useAuth();
  const owner = session?.accountKey;
  const [choice, setChoice] = useState(false);
  const [checking, setChecking] = useState(!!owner);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const check = useCallback(async () => {
    setChecking(true); setError("");
    try { setChoice(owner ? await needsLegacyChoice(owner) : false); }
    catch { setError("Existing device records could not be checked. Please retry before continuing."); }
    finally { setChecking(false); }
  }, [owner]);
  useEffect(() => { void check(); }, [check]);
  const resolve = async (importRecords: boolean) => {
    if (!owner) return;
    setBusy(true); setError("");
    try { await resolveLegacyRecords(owner, importRecords); await aircraft.reload(); await flights.reload(); setChoice(false); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Your records could not be imported."); }
    finally { setBusy(false); }
  };
  if (!session) return <>{children}</>;
  if (aircraft.isLoading || flights.isLoading || checking) return <View style={styles.state}><ActivityIndicator size="large" color={palette.navy} /><Text style={type.body}>Opening your logbook...</Text></View>;
  if (aircraft.error || flights.error || (error && !choice)) return <View style={styles.state}><Text style={type.heading}>Unable to open saved records</Text><Text style={type.body}>{aircraft.error || flights.error || error}</Text><AppButton label="Try Again" onPress={() => { void aircraft.reload(); void flights.reload(); void check(); }} /><AppButton label="Sign Out" variant="outline" onPress={() => { void signOut().catch((cause) => setError(cause.message)); }} /></View>;
  return <><View style={styles.flex}>{offline && <InfoBox>Offline: your saved logbook is available. Reconnect to update your PSPACE profile.</InfoBox>}{children}</View><DecisionModal visible={choice} icon="folder-open-outline" title="Keep your existing records?" description={`Import this device's earlier aircraft and flights into ${session.user.email} only if they belong to you. Starting fresh leaves them unassigned and does not delete them.`} primaryLabel="Import My Records" onPrimary={() => { void resolve(true); }} secondaryLabel="Start Fresh" onSecondary={() => { void resolve(false); }} onDismiss={() => {}} loading={busy} error={error} /></>;
}
const styles = StyleSheet.create({ flex: { flex: 1 }, state: { flex: 1, justifyContent: "center", padding: 28, gap: 20, backgroundColor: palette.background } });
