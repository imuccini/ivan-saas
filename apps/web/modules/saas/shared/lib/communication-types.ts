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
		defaultBody:
			"<p>Dear {$; guest_name},</p><p>Welcome to our WiFi network! We're glad to have you connected.</p><p>If you need any assistance, please don't hesitate to contact our support team.</p><p>Best regards,<br/>The Team</p>",
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
