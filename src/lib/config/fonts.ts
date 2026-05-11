/**
 * Font configuration.
 *
 * Two loading modes are supported:
 *
 *   'self-hosted'  — fonts are bundled via @fontsource packages (no external requests).
 *                    The corresponding @import lines must be present in layout.css.
 *
 *   'google'       — fonts are loaded from Google Fonts CDN via a <link> tag.
 *                    Comment out (or remove) the @fontsource @import lines in layout.css,
 *                    and set googleUrl to your Google Fonts stylesheet URL.
 *
 *   'system'       — no custom font loaded; relies entirely on the family stack fallbacks.
 *
 * The `family` value must also be reflected in the --font-serif / --font-body
 * @theme declarations in layout.css so that Tailwind utilities resolve correctly.
 */

export type FontSource = 'self-hosted' | 'google' | 'system';

export interface FontConfig {
	/** CSS font-family stack. Keep in sync with --font-serif in layout.css @theme. */
	family: string;
	source: FontSource;
	/** Google Fonts stylesheet href — required when source is 'google'. */
	googleUrl?: string;
}

export const FONTS: { serif: FontConfig; sans: FontConfig } = {
	// ── Body / serif font ────────────────────────────────────────────────────────
	// Change this to switch fonts across the whole app.
	//
	// Self-hosted examples (install the @fontsource package and add @import to layout.css):
	//   "Gentium Plus"       @fontsource/gentium-plus
	//   "EB Garamond"        @fontsource/eb-garamond
	//   "Sorts Mill Goudy"   @fontsource/sorts-mill-goudy
	//
	// Google Fonts examples (set source: 'google', paste the stylesheet URL):
	//   Cormorant Garamond   https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap
	//   Lora                 https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400;1,700&display=swap
	//   Playfair Display     https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap
	//   EB Garamond          https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400;1,700&display=swap
	serif: {
		source: 'self-hosted',
		family: '"Gentium Plus", Georgia, "Times New Roman", serif',
		// Kept here for reference if you switch to source: 'google':
		googleUrl:
			'https://fonts.googleapis.com/css2?family=Gentium+Plus:ital,wght@0,400;0,700;1,400;1,700&display=swap',
	},

	// ── UI / sans-serif font ─────────────────────────────────────────────────────
	// Used for nav, labels, and admin UI. Defaults to the OS system font stack.
	sans: {
		source: 'system',
		family: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
	},
};
