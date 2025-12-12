export type CommunicationType =
	| "guest-welcome"
	| "byod-invite"
	| "byod-onboarding"
	| "sponsor-approval";

export interface CommunicationVariable {
	key: string;
	label: string;
	description?: string;
	example?: string;
}

export interface CommunicationDefinition {
	name: string;
	trigger: string;
	variables: CommunicationVariable[];
	defaultSubject: string;
	defaultBody: string;
}

export const DEFAULT_COMMUNICATIONS: Record<
	CommunicationType,
	CommunicationDefinition
> = {
	"guest-welcome": {
		name: "Guest Welcome Email",
		trigger: "Guest Sign Up via Captive Portal",
		variables: [
			{
				key: "guest_name",
				label: "Guest Name",
				description: "The name of the guest user",
				example: "John Doe",
			},
			{
				key: "network_name",
				label: "Network Name",
				description: "The name of the WiFi network",
				example: "Guest WiFi",
			},
			{
				key: "wifi_password",
				label: "WiFi Password",
				description: "The password for the WiFi network",
				example: "SecurePass123",
			},
			{
				key: "company_name",
				label: "Company Name",
				description: "The name of the organization",
				example: "Acme Corp",
			},
		],
		defaultSubject: "Welcome to Our Guest WiFi Network",
		defaultBody: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #374151; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
    <div style="background-color: #000000; padding: 32px 24px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; text-align: center; letter-spacing: -0.025em;">Welcome to {$; company_name}</h1>
    </div>
    <div style="padding: 32px 24px; background-color: #ffffff;">
        <p style="font-size: 16px; margin-top: 0; margin-bottom: 24px; line-height: 1.6;">Hi <strong>{$; guest_name}</strong>,</p>
        <p style="font-size: 16px; margin-bottom: 24px; line-height: 1.6;">We're thrilled to have you with us! You are now successfully connected to our Guest WiFi network.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Network Information</p>
            <div style="margin-top: 12px;">
                <p style="margin: 4px 0; font-size: 15px;"><strong>Network:</strong> {$; network_name}</p>
                <p style="margin: 4px 0; font-size: 15px;"><strong>Organization:</strong> {$; company_name}</p>
            </div>
        </div>

        <p style="font-size: 16px; margin-bottom: 24px; line-height: 1.6;">Enjoy fast and secure internet access. If you need any assistance, please don't hesitate to reach out to our support team.</p>
        
        <p style="margin-top: 32px; font-size: 16px; color: #4b5563;">Best regards,<br/>The {$; company_name} Team</p>
    </div>
    <div style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0;">&copy; {$; company_name}. All rights reserved.</p>
    </div>
</div>`,
	},
	"byod-invite": {
		name: "BYOD Invite Email",
		trigger: "Employee Sign Up via Captive Portal",
		variables: [
			{
				key: "employee_name",
				label: "Employee Name",
				description: "The name of the employee",
				example: "Jane Smith",
			},
			{
				key: "company_name",
				label: "Company Name",
				description: "The name of the organization",
				example: "Acme Corp",
			},
			{
				key: "enrollment_link",
				label: "Enrollment Link",
				description: "Link to enroll the device",
				example: "https://portal.example.com/enroll/abc123",
			},
			{
				key: "expiry_date",
				label: "Link Expiry Date",
				description: "When the enrollment link expires",
				example: "December 15, 2024",
			},
		],
		defaultSubject: "Enroll Your Device - {$; company_name}",
		defaultBody:
			"<p>Hi {$; employee_name},</p><p>Welcome to {$; company_name}! To get started with our network, please enroll your device using the link below:</p><p><a href='{$; enrollment_link}'>Enroll My Device</a></p><p>This link will expire on {$; expiry_date}.</p><p>Best regards,<br/>IT Department</p>",
	},
	"byod-onboarding": {
		name: "BYOD Onboarding Email",
		trigger: "Employee Active",
		variables: [
			{
				key: "employee_name",
				label: "Employee Name",
				description: "The name of the employee",
				example: "Jane Smith",
			},
			{
				key: "company_name",
				label: "Company Name",
				description: "The name of the organization",
				example: "Acme Corp",
			},
			{
				key: "network_name",
				label: "Network Name",
				description: "The name of the employee WiFi network",
				example: "Acme-Employee",
			},
			{
				key: "support_email",
				label: "Support Email",
				description: "IT support contact email",
				example: "support@acme.com",
			},
		],
		defaultSubject: "Your Network Access is Ready - {$; company_name}",
		defaultBody:
			"<p>Hi {$; employee_name},</p><p>Your device has been successfully enrolled! You now have access to the {$; network_name} network.</p><p>If you experience any issues, please contact IT support at {$; support_email}.</p><p>Best regards,<br/>IT Department</p>",
	},
	"sponsor-approval": {
		name: "Sponsor Approval Request",
		trigger: "Guest Requests Approval",
		variables: [
			{
				key: "guest_name",
				label: "Guest Name",
				description: "The name of the guest requesting access",
				example: "John Doe",
			},
			{
				key: "guest_email",
				label: "Guest Email",
				description: "The email of the guest",
				example: "john.doe@example.com",
			},
			{
				key: "sponsor_name",
				label: "Sponsor Name",
				description: "The name of the sponsor",
				example: "Jane Smith",
			},
			{
				key: "approval_link",
				label: "Approval Link",
				description: "Link to approve the guest",
				example: "https://portal.example.com/approve/xyz789",
			},
			{
				key: "deny_link",
				label: "Deny Link",
				description: "Link to deny the guest",
				example: "https://portal.example.com/deny/xyz789",
			},
		],
		defaultSubject: "Guest Access Approval Required",
		defaultBody:
			"<p>Hi {$; sponsor_name},</p><p>{$; guest_name} ({$; guest_email}) is requesting access to the guest WiFi network and has selected you as their sponsor.</p><p>Please approve or deny this request:</p><p><a href='{$; approval_link}'>Approve Access</a> | <a href='{$; deny_link}'>Deny Access</a></p><p>Best regards,<br/>The Team</p>",
	},
};
