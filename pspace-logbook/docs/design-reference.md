# Design Reference Alignment

The full screenshot set supplied on November 3, 2026 is the visual reference. Layouts adapt to mobile text sizes and touch targets instead of reproducing the screenshots at their original small scale.

## Current Pass

| Screenshot | Active application reference |
| --- | --- |
| 1 | Sidebar logo, profile summary, Main / Training / Account sections, navy active item. Deferred destinations stay disabled. |
| 2 | Profile summary, three bordered metrics, outlined menu rows. All displayed metrics use saved records. |
| 3 | Dashboard logo/title, welcome row with one bell, certification cards, percentage and progress bar. |
| 4–5 | Full-screen progress ring, three summary boxes, centered amber action. Night Rating uses its correct title. |
| 7 | Registration form rows, engine category options, cyan information panel. Aircraft and flight information remain separate workflows. |
| 8–9 | Aircraft confirmation/success dialogs with circular illustrations, navy primary and outlined secondary buttons. |
| 10 | Registration Details summary, local-record badge, two-column data table, information panel and export/share actions. |
| 11 | Add Flight Entry rows, Day/Night selection, remarks, Save Flight action. |
| 12 | Flight List date-strip record cards, search, bottom Add Flight action. |
| 13 | Navy flight-details panel with amber route accents, adapted as a readable mobile sheet. |
| 14–15 | Flight save review and unsaved-changes confirmation. |

Logbook reuses the same flight records and visual language, adding compact calculated totals and date/aircraft filters. The existing five-tab navigation remains consistent across main screens. Forms use a back button and guard edited drafts against accidental navigation.

## Deferred References

Analytics (6), cloud synchronization messaging (16), aircraft archiving (17), flight deletion (18), and complete Logbook export (19) are references for a later implementation pass. Aircraft PDF export remains available. PSPACE authentication and local offline access were added in the subsequent [mobile authentication pass](mobile-auth.md); aircraft and flight cloud synchronization remains deferred.

## Shared Visual Rules

- White page backgrounds with restrained gray map artwork; Profile uses the reference's light neutral background.
- Montserrat typography with regular and semibold weights, navy `#032451`, amber `#FFBB57`, cyan information panels and thin gray borders.
- Compact outlined records and side-by-side labels/fields where space permits. Narrow screens and larger text settings stack form fields.
- Buttons retain a mobile touch area of at least 44 points. Confirmation buttons are pill shaped; primary screen actions are centered and amber.
- Saved records and unknown values remain truthful: no fabricated registry data, verification claims or promised cloud synchronization.
