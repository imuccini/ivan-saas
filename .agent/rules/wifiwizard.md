---
trigger: manual
---

The Guest WiFi Wizard is a multi-step configuration interface that allows administrators to set up and customize a guest WiFi onboarding experience. The wizard uses a context-based architecture with a split-view layout showing configuration options on the left and a live preview on the right.

Architecture
Core Components
1. WizardProvider (wizard-context.tsx)
Purpose: Centralized state management using React Context
Responsibilities:
Manages all wizard state (authentication, content, style, journey)
Handles data fetching from backend (saved config, terms, custom fields)
Provides dirty checking for unsaved changes
Exposes save/publish mutations
Implements unsaved changes confirmation dialog
Key State Categories:

Authentication: Guest registration, login options, IdPs, terms, access codes
Journey: Easy WiFi, success redirect mode, sponsorship
Content: Multi-language content (titles, descriptions, button labels)
Style: Fonts, colors, spacing, backgrounds, logo
Assets: Logo URL/size, background image URL
2. OnboardingJourneyWizard (
onboarding-journey-wizard.tsx
)
Purpose: Main wizard shell component
Structure:
<WizardProvider>
  <WizardContent>
    <WizardHeader />
    <SplitView>
      <ConfigPanel /> {/* Left: Step components */}
      <WizardPreview /> {/* Right: Live preview */}
    </SplitView>
  </WizardContent>
</WizardProvider>
3. WizardHeader (wizard-header.tsx)
Purpose: Navigation and actions
Features:
Step breadcrumb navigation (Authentication → Journey → Content)
Exit button (triggers unsaved changes check)
Save & Continue / Publish button
Step icons and labels
Step Components
Step 1: Authentication (
step-1-authentication.tsx
)
Tabs: Sign Up/Sign In | Access Control

Sign Up/Sign In Tab Sections:

Guest Accounts (auth/guest-registration-section.tsx)

Toggle: Allow Guest Registration
Display mode: Button vs Form on Homepage
Apple ID quick sign-up option
Configure Registration Form fields button
Toggle: Allow Existing User Login
Third-Party Authentication (auth/identity-providers-section.tsx)

Toggle to enable/disable
Multi-select dropdown for IdPs (Entra ID, Google Workspace, PMS systems)
Terms and Agreements (auth/terms-section.tsx)

Configure Terms button → Opens 
ConfigureTermsDialog
Manages required/optional terms for all auth methods
Access Codes

Simple toggle to enable/disable access code entry
Access Control Tab (auth/access-control-section.tsx):

Time Limit (max hours per day)
Sponsorship Approval (host approval workflow)
Verification (email/phone validation)
Access Hours (time slot restrictions)
Step 2: Journey (step-3-journey.tsx)
Sections:

Easy WiFi Setup

Toggle to enable automatic profile download
Reduces friction for returning users
Success Redirect

Mode: External URL vs Text message
Configures post-authentication experience
Step 3: Content (
step-2-content.tsx
)
Tabs: Languages | Content | Style

Languages Tab:

Multi-language selector
Active language switcher
Content is stored per language
Content Tab (Redesigned):

Left Sidebar (30%): Page navigation buttons

Home Page
Registration Page (if button mode)
Sponsor Request (if enabled)
Easy WiFi (if enabled)
Validation (if phone validation)
Success (if text mode)
Blocked
Right Panel (70%): Content editor for selected page

Dynamic fields based on selected page
Title, description, button labels
Background settings (only for Home Page)
Style Tab:

Logo upload and sizing
Global font settings (family, size, base color)
Primary accent color (buttons)
Overall spacing (compact/balanced/spacious)
Advanced customization (collapsible)
Preview Component
WizardPreview (
wizard-preview.tsx
)
Purpose: Real-time visual preview of the guest WiFi experience

Features:

Device mode selector (Mobile/Tablet/Desktop)
Page selector dropdown (synced with Content tab)
Light mode enforcement (wrapped in .light class)
Responsive preview frame with configurable dimensions
Preview Pages:

Home: Registration form/button, login, IdP buttons, access codes
Registration: Full registration form (when button mode)
Sponsor: Waiting for approval message with spinner
Easy WiFi: Profile download CTA
Validation: Phone verification code input
Success: Success message with checkmark icon
Blocked: Access denied message with X icon
Styling Application:

Applies all style settings (fonts, colors, spacing)
Renders background (image/color/gradient)
Shows logo with configured size
Displays terms checkboxes (if configured)
Data Flow
1. Initial Load
User opens wizard
  → WizardProvider fetches saved config
  → Populates all state variables
  → Sets initialConfig for dirty checking
  → Renders first step (Authentication)
2. Configuration Changes
User modifies settings
  → Updates context state via setters
  → Preview auto-updates (reactive)
  → Dirty flag set (currentConfig ≠ initialConfig)
3. Save Flow
User clicks "Save & Continue"
  → buildConfigFromState() constructs payload
  → saveMutation.mutate() sends to backend
  → On success: invalidate queries, advance step
  → On final step: close wizard
4. Unsaved Changes Guard
User clicks "Exit"
  → Check hasUnsavedChanges (deep equality via fast-deep-equal)
  → If dirty: show AlertDialog
  → User chooses: Cancel or Leave without saving
Key Technical Patterns
1. Context-Based State Management
All wizard state lives in WizardContext, eliminating prop drilling:

const { guestRegistrationEnabled, setGuestRegistrationEnabled } = useWizard();
2. Multi-Language Content
Content is stored as Record<string, ContentPerLanguage>:

{
  en: { title: "Get online...", description: "..." },
  es: { title: "Conectarse...", description: "..." }
}
Helper functions:

getContentForLanguage(lang): Retrieves content with fallback to English
updateContentForLanguage(lang, field, value): Updates specific field
3. Conditional Rendering
Preview and configuration sections conditionally render based on feature flags:

{guestRegistrationEnabled && registrationMode === "button" && (
  <RegistrationPageSection />
)}
4. Dirty Checking
Uses fast-deep-equal for reliable comparison:

const hasUnsavedChanges = useMemo(() => {
  if (!initialConfig) return false;
  const currentConfig = buildConfigFromState();
  return !equal(currentConfig, initialConfig);
}, [initialConfig, ...allStateDependencies]);
5. Preview Synchronization
The previewPage state is lifted to WizardContext and shared between:

Content tab's page navigation sidebar
Preview component's page selector dropdown
Ensures both stay in sync
File Structure
apps/web/modules/saas/guest-wifi/components/
├── onboarding-journey-wizard.tsx    # Main wizard shell
├── wizard-context.tsx                # State management
├── wizard-header.tsx                 # Navigation & actions
├── wizard-preview.tsx                # Live preview
├── configure-terms-dialog.tsx        # Terms configuration modal
├── configure-signup-form-dialog.tsx  # Form fields editor
├── steps/
│   ├── step-1-authentication.tsx     # Auth step shell
│   ├── step-2-content.tsx            # Content/Style step
│   ├── step-3-journey.tsx            # Journey step
│   └── auth/
│       ├── guest-registration-section.tsx
│       ├── identity-providers-section.tsx
│       ├── terms-section.tsx
│       └── access-control-section.tsx
Backend Integration
API Endpoints (via ORPC)
orpc.guestWifi.get: Fetch saved configuration
orpc.guestWifi.save: Save/publish configuration
orpc.terms.list: Fetch available terms (published)
orpc.customFields.list: Fetch custom fields
Configuration Schema
Defined in 
packages/api/modules/guest-wifi/types.ts
:

{
  authentication: {
    guestRegistrationEnabled: boolean;
    registrationMode: "form" | "button";
    showLoginOption: boolean;
    appleIdEnabled: boolean;
    accessCodesEnabled: boolean;
    enterpriseIdpEnabled: boolean;
    selectedIdps: string[];
    sponsorshipEnabled: boolean;
    phoneValidationEnabled: boolean;
    registrationFields: FormField[];
    terms: SelectedTerm[];
  },
  journey: {
    easyWifiEnabled: boolean;
    successRedirectMode: "external" | "text";
    autoConnectReturning: boolean;
    allowBypassWithCode: boolean;
    allowExtensionRequest: boolean;
  },
  style: {
    fontFamily: string;
    baseFontSize: string;
    baseColor: string;
    primaryColor: string;
    spacing: "compact" | "balanced" | "spacious";
    backgroundType: "image" | "color" | "gradient";
    backgroundColor?: string;
    gradientColor1?: string;
    gradientColor2?: string;
  },
  content: Record<string, ContentPerLanguage>,
  assets: {
    logoUrl?: string;
    logoSize: number;
    backgroundImageUrl?: string;
  },
  languages: string[];
  defaultLanguage: string;
}
Common Development Tasks
Adding a New Configuration Option
Add state to WizardContext
Add field to appropriate step component
Update buildConfigFromState() in context
Update backend schema if needed
Update preview rendering if visual change
Adding a New Preview Page
Add page to conditional sections in 
WizardPreview
Add option to page selector dropdown
Add navigation button in Content tab sidebar
Implement content fields in Content tab editor
Modifying Dirty Check Logic
Edit hasUnsavedChanges in WizardContext
Ensure all relevant state is in dependency array
Use initialConfig (not savedConfig) for comparison
Troubleshooting
Preview Not Updating
Check if state is properly lifted to context
Verify preview is consuming context values
Ensure no stale closures in preview component
Unsaved Changes False Positive
Verify initialConfig is set correctly on load
Check for type mismatches (null vs undefined)
Ensure defaults match between frontend and backend
Terms Not Displaying
Confirm availableTerms is fetched and passed to preview
Check term definition IDs match selected terms
Verify terms are published (not draft)
Performance Considerations
Lazy Loading: Heavy sections use dynamic imports
Memoization: Preview calculations use useMemo
Debouncing: Consider for text inputs if performance issues
Query Caching: TanStack Query caches backend responses
Deep Equality: fast-deep-equal is performant for config objects
