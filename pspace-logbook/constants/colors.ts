// C:\nginx\html\pspace-logbook\pspace-logbook\constants\colors.ts

const Colors = {
  // ── Primary / Brand ──────────────────────────────────────────────────────
  primary:              "#FFB547",   // Orange — Add Aircraft button, active toggle
  primaryDark:          "#1B2A4A",   // Dark navy — logo gear icon, title text

  // ── Accent ───────────────────────────────────────────────────────────────
  accentRed:            "#C0392B",   // Red — logo plane/slash accent

  // ── Backgrounds ──────────────────────────────────────────────────────────
  background:           "#F2F4F7",   // Light gray — main screen background
  cardBackground:       "#FFFFFF",   // White — card/form containers

  // ── Text ─────────────────────────────────────────────────────────────────
  textPrimary:          "#1A1A2E",   // Near-black — title, label text
  textSecondary:        "#555555",   // Medium gray — cancel button text
  textPlaceholder:      "#BBBBBB",   // Light gray — input placeholder text

  // ── Toggles / Chips ──────────────────────────────────────────────────────
  toggleInactive:           "#F0F0F0", // Light gray — inactive toggle bg
  toggleInactiveText:       "#555555", // Gray — inactive toggle text
  toggleActiveBackground:   "#FFB547", // Orange — active toggle bg
  toggleActiveText:         "#FFFFFF", // White — active toggle text

  // ── Buttons ──────────────────────────────────────────────────────────────
  cancelButton:         "#D0D0D0",   // Gray — Cancel button background
  cancelText:           "#555555",   // Gray — Cancel button text

  // ── Dividers & Borders ───────────────────────────────────────────────────
  divider:              "#F0F0F0",   // Very light gray — row dividers inside cards
  border:               "#DDDDDD",   // Light gray — input bottom borders

  // ── Shadows ──────────────────────────────────────────────────────────────
  shadow:               "#000000",   // Black base (use with opacity)

  // ── Flight Screen ────────────────────────────────────────────────────────
  hero:                 "#032451",   // Dark blue — hero section background
  heroMap:              "#3A5E83",   // Blue — world map tint overlay
  bodyBackground:       "#DEDEDF",   // Light gray — flight list body
  card:                 "#E8E8E9",   // Flight card background
  cardBorder:           "#C8C9CC",   // Flight card border
  white:                "#F5F6F8",   // Off-white — hero text
  yellow:               "#F8BD53",   // Yellow — icons, add button, active pill
  blueStroke:           "#2A65FF",   // Blue — active pill border, add button border
  textLight:            "#F1F5FB",   // Light — hero heading text
  muted:                "#8A8C91",   // Gray — secondary labels
  placeholder:          "#B7B9BD",   // Light gray — tertiary text

  // ── Flight Type Accents ───────────────────────────────────────────────────
  commercialAccent:     "#1A6FD4",
  commercialBg:         "#D8E8FB",
  privateAccent:        "#1E8A56",
  privateBg:            "#D4F0E3",
  charterAccent:        "#7B2FBE",
  charterBg:            "#EBD9F8",
  cargoAccent:          "#C47B12",
  cargoBg:              "#FBF0D4",
} as const;

export type AppColors = typeof Colors;
export default Colors;