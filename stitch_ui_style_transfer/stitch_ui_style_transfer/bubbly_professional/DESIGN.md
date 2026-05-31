---
name: Bubbly Professional
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#f0eeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#4d4632'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ec'
  outline: '#7f7660'
  outline-variant: '#d1c6ab'
  surface-tint: '#735c00'
  primary: '#735c00'
  on-primary: '#ffffff'
  primary-container: '#facc15'
  on-primary-container: '#6c5700'
  inverse-primary: '#eec200'
  secondary: '#a83639'
  on-secondary: '#ffffff'
  secondary-container: '#fe7676'
  on-secondary-container: '#720b17'
  tertiary: '#555f6f'
  on-tertiary: '#ffffff'
  tertiary-container: '#c7d1e4'
  on-tertiary-container: '#505a69'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe083'
  primary-fixed-dim: '#eec200'
  on-primary-fixed: '#231b00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#ffdad8'
  secondary-fixed-dim: '#ffb3b0'
  on-secondary-fixed: '#410006'
  on-secondary-fixed-variant: '#881d24'
  tertiary-fixed: '#d9e3f6'
  tertiary-fixed-dim: '#bdc7d9'
  on-tertiary-fixed: '#121c2a'
  on-tertiary-fixed-variant: '#3d4756'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  margin-page: 40px
  gutter: 24px
  card-padding: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is defined by a friendly, optimistic, and highly tactile personality. It transforms the stressful job search process into a playful, encouraging experience. The style is a hybrid of **Modern Minimalism** and **Bubbly Neomorphism**, utilizing soft, organic shapes and high-quality whitespace to create a sense of calm and accessibility.

The aesthetic prioritizes a "toy-like" feel that remains functional and professional. It targets modern job seekers who value clarity and a stress-free digital environment. Visuals should evoke feelings of warmth, safety, and progress through rounded geometry and a soft, cream-based atmosphere.

## Colors

The palette is anchored by a warm, paper-like cream background, which reduces eye strain and provides a more sophisticated alternative to pure white. 

- **Primary (Soft Yellow):** Used for primary actions, success states, and progress highlights. It evokes optimism.
- **Secondary (Soft Red):** Used for alerts, significant milestones, or "urgent" job status updates.
- **Tertiary (Dark Charcoal):** Used for high-contrast elements like sidebars, primary buttons, and dark-mode cards to create depth.
- **Neutral (Cream & Stone):** The foundation of the UI. `F5F3EF` is the primary canvas color, while slightly darker stone tones are used for container backgrounds.

## Typography

This design system utilizes **Plus Jakarta Sans** for its approachable yet modern proportions. The type scale is bold and expressive, with tight letter spacing for headlines to emphasize the "bubbly" feel. 

Headlines should be set in extra-bold weights to contrast against the soft shapes of the UI. Body text remains medium-weight to ensure legibility against the cream backgrounds. Use larger font sizes for data points (like salary offers) to make them feel impactful and immediate.

## Layout & Spacing

The layout follows a **Fluid Grid** model with generous safe areas. 

- **Sidebar:** A floating, slim vertical navigation bar with a distinct rounded background.
- **Main Canvas:** Uses a 12-column grid on desktop. Large-scale margins (40px) ensure the "floating card" effect is maintained.
- **Responsive Behavior:** On mobile, the 12-column grid collapses to a single column, and the 40px page margins reduce to 16px. Cards maintain their 24px+ corner radius even on small screens to preserve the brand's shape language.
- **Rhythm:** Spacing follows an 8px base unit. Content within cards uses consistent 32px padding to feel spacious and premium.

## Elevation & Depth

Depth is achieved through **Soft Ambient Shadows** and **Tonal Layering**. 

1. **Base Layer:** The cream canvas (`#F5F3EF`).
2. **Surface Layer:** White cards or dark charcoal containers.
3. **Shadows:** Use extremely diffused shadows with a large blur radius (e.g., `0 20px 40px rgba(0,0,0,0.04)`). Avoid harsh edges.
4. **Interaction:** Buttons and interactive elements should use a "squishy" physical metaphor—subtle scale-downs on click and a slight increase in shadow depth on hover to suggest they are being lifted off the surface.

## Shapes

The shape language is the core differentiator of the design system. It is defined by **Extreme Roundedness**.

- **Containers & Cards:** Use a minimum radius of 32px.
- **Buttons:** Fully pill-shaped (rounded-full).
- **Navigation:** Floating "pill" containers for active states and sidebars.
- **Visual Flourishes:** Use circular or "blob" shapes for background decorations or status indicators to reinforce the organic feel.

## Components

- **Buttons:** Primary buttons are either deep charcoal with white text or bright yellow with charcoal text. They should be tall (min 56px) with pill-shaped ends.
- **Job Cards:** Large white surfaces with 32px corners. The job logo should be housed in its own rounded square with a 16px radius. Use a large font for the job title and a secondary "tag" style for location/salary.
- **Sidebar:** A floating, white or light-grey vertical bar with a "bead" indicator for the active state. Icons should be thick-stroked and friendly.
- **Inputs:** Search bars should be pill-shaped with subtle interior shadows to appear slightly recessed into the page.
- **Offer Comparison:** Uses a "Split Card" view where two highly rounded containers sit side-by-side. Use soft color gradients (yellow-to-cream or red-to-cream) for progress bars or offer strengths.
- **Chips/Badges:** Small, highly rounded labels using high-contrast colors (e.g., a yellow chip on a charcoal background).