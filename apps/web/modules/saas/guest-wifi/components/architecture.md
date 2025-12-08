# Guest WiFi Wizard Architecture

## Overview
The Guest WiFi Wizard is a complex multi-step form used to configure the guest WiFi experience. To manage the extensive state and component hierarchy, it uses a **Context API** pattern combined with **Component Composition**.

## Key Components

### 1. WizardContext (`wizard-context.tsx`)
- **Role**: The "Brain" of the wizard.
- **Responsibilities**:
    - Manages all global state (Authentication, Journey, Style, Content).
    - Handles data fetching (loading existing config, available terms).
    - Handles data persistence (saving config).
    - Exposes `useWizard` hook for components to consume state and actions.

### 2. OnboardingJourneyWizard (`onboarding-journey-wizard.tsx`)
- **Role**: The Entry Point.
- **Responsibilities**:
    - Wraps the content in `WizardProvider`.
    - Renders `WizardContent` which orchestrates the layout.

### 3. WizardHeader (`wizard-header.tsx`)
- **Role**: Navigation and Actions.
- **Responsibilities**:
    - Displays breadcrumb navigation.
    - Handles "Exit" and "Save & Continue" actions.
    - Consumes `useWizard` to trigger save mutations.

### 4. Steps (`steps/`)
- **Step 1: Authentication (`step-1-authentication.tsx`)**:
    - Acts as a layout shell.
    - Composes smaller sections: `GuestRegistrationSection`, `IdentityProvidersSection`, `TermsSection`, `AccessControlSection`.
    - These sections consume `useWizard` directly.
- **Step 2: Journey (`step-2-journey.tsx`)**:
    - Handles journey configuration (Easy WiFi, Redirects).
- **Step 3: Content (`step-3-content.tsx`)**:
    - Handles content customization (Text, Branding, Languages).

## State Management Pattern
Instead of passing props down 3-4 levels (Prop Drilling), components consume the `useWizard` hook directly.

**Old Pattern (Prop Drilling):**
`OnboardingJourneyWizard` -> `StepAuthentication` -> `GuestRegistrationSection` -> `Switch`

**New Pattern (Context):**
`GuestRegistrationSection` -> `useWizard()` -> `Switch`

## Adding New Features
1.  **State**: Add new state variables to `WizardState` interface and `WizardProvider` in `wizard-context.tsx`.
2.  **UI**: Create a new component in the appropriate step folder.
3.  **Logic**: Consume `useWizard` in your new component to access/update state.
