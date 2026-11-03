# Local Logbook Data

Aircraft and flights are saved on the device. iOS and Android use `expo-sqlite` with `pspace-logbook.db`; the web preview uses browser local storage. Flight and aircraft records are not uploaded. Accounts and shared profile details come from PSPACE Flask and are cached locally; see [Mobile Authentication](mobile-auth.md).

## Record Relationships

- Aircraft registrations are unique within each account after trimming and conversion to uppercase.
- Flights reference an existing aircraft ID, with a snapshot of its name and registration for display.
- Flight durations are stored as integer minutes. Display hours and Day/Night totals are calculated from these minutes.
- Logbook, Flight List, Dashboard and aircraft logged hours all read the same saved flights.
- Optional fields remain blank in storage and display as "Not provided" in details.

## Application Flow

1. Add an aircraft, review it, and confirm the save.
2. Add a flight using a saved aircraft. The date, Day/Night selection, duration, landings and optional details are saved together.
3. Review the flight through Flights or Logbook. Logbook filters and totals use those same records.
4. Export aircraft details as a locally generated PDF. The device share sheet provides Save to Files and other available destinations.

The five main routes are Dashboard, Aircrafts, Flights, Logbook and Profile. Earlier UI implementations are retained in `legacy/screens/` outside the routing and compilation paths.

## Platform Integration

Authentication uses PSPACE accounts, including verified Student and Instructor signup. Records belong to a stable PSPACE account ID and server origin. Earlier unowned records require an explicit import choice. Account switching clears in-memory records without deleting either account's saved data. There is no aircraft/flight cloud backup or synchronization yet.

## Verification

`npm test` checks duration/date handling, totals, PDF escaping, exact aircraft lookup, SQLite persistence, unique registrations and aircraft-flight foreign keys. The test runner uses Node's SQLite API and requires Node 22.13 or newer.
