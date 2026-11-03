import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import { File, Paths } from "expo-file-system";

import type { Aircraft, Flight } from "@/types/records";
import { aircraftName, aircraftValue, getAircraftDetails, getAircraftFlightSummary } from "@/utils/aircraft-details";

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

export function buildAircraftPdfHtml(aircraft: Aircraft, flights: readonly Flight[]): string {
  const summary = getAircraftFlightSummary(aircraft.id, flights);
  const rows = getAircraftDetails(aircraft).map(({ label, value }) => `<tr><th scope="row">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Aircraft ${escapeHtml(aircraftValue(aircraft.registration))} - Local Record</title>
  <style>
    @page { margin: 36px; }
    * { box-sizing: border-box; }
    body { font-family: Helvetica, sans-serif; color: #032451; font-size: 14px; line-height: 1.5; margin: 0; }
    header { border-top: 6px solid #FFBB57; padding-top: 18px; margin-bottom: 20px; }
    .eyebrow { font-size: 14px; font-weight: bold; letter-spacing: 1px; margin: 0 0 8px; }
    h1 { font-size: 30px; line-height: 1.2; margin: 0 0 8px; overflow-wrap: anywhere; }
    .model { margin: 0; overflow-wrap: anywhere; }
    .notice { background: #EAF0F6; padding: 14px; border-left: 4px solid #FFBB57; margin: 18px 0; }
    h2 { font-size: 18px; margin: 18px 0 10px; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    th, td { text-align: left; vertical-align: top; border-bottom: 1px solid #D9E0E8; padding: 9px 8px; overflow-wrap: anywhere; word-wrap: break-word; }
    th { width: 42%; font-weight: bold; }
    tr { break-inside: avoid; page-break-inside: avoid; }
    .stats { padding: 12px 14px; background: #F5F7FA; margin-top: 18px; }
    .stats p { margin: 4px 0; }
    footer { margin-top: 20px; font-size: 14px; color: #526279; }
  </style>
</head>
<body>
  <header>
    <p class="eyebrow">PSPACE LOGBOOK / LOCAL AIRCRAFT RECORD</p>
    <h1>${escapeHtml(aircraftValue(aircraft.registration))}</h1>
    <p class="model">${escapeHtml(aircraftName(aircraft))}</p>
  </header>
  <div class="notice"><strong>Personal logbook record</strong><br />
    Generated locally from the aircraft details saved on this device.</div>
  <h2>Saved Aircraft Details</h2>
  <table><tbody>${rows}</tbody></table>
  <div class="stats">
    <p><strong>Logged hours:</strong> ${(summary.durationMinutes / 60).toFixed(2)} h (${summary.durationMinutes} minutes)</p>
    <p><strong>Linked flights:</strong> ${summary.flightCount}</p>
  </div>
  <footer>Hours include only flights linked to this aircraft in the local logbook, not lifetime airframe hours. Missing details are shown as Not provided.</footer>
</body>
</html>`;
}

export async function shareAircraftPdf(aircraft: Aircraft, flights: readonly Flight[]): Promise<void> {
  if (Platform.OS !== "web" && !(await Sharing.isAvailableAsync())) {
    throw new Error("File sharing is unavailable on this device. Try exporting on a device with a share sheet.");
  }
  const { uri } = await Print.printToFileAsync({ html: buildAircraftPdfHtml(aircraft, flights), base64: false });
  // On web Expo opens the browser print dialog instead of creating a shareable local file.
  if (Platform.OS === "web") return;
  if (!uri) throw new Error("The PDF could not be generated. Please try again.");
  const safeRegistration = aircraft.registration.replace(/[^a-zA-Z0-9-]/g, "-").slice(0, 50);
  const namedPdf = new File(Paths.cache, `Aircraft-${safeRegistration}-${Date.now()}.pdf`);
  new File(uri).move(namedPdf);
  await Sharing.shareAsync(namedPdf.uri, { mimeType: "application/pdf", UTI: "com.adobe.pdf", dialogTitle: "Save or share aircraft PDF" });
}
