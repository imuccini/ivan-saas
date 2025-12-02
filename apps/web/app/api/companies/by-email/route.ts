import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const email = searchParams.get("email");

	if (!email) {
		return NextResponse.json(
			{ error: "Email parameter is required" },
			{ status: 400 },
		);
	}

	const token = process.env.COMPANIES_API_TOKEN;

	if (!token) {
		console.error("COMPANIES_API_TOKEN not configured");
		return NextResponse.json(
			{ error: "API token not configured" },
			{ status: 500 },
		);
	}

	try {
		console.log(`Fetching company data for email: ${email}`);
		const apiUrl = `https://api.thecompaniesapi.com/v2/companies/by-email?email=${encodeURIComponent(email)}`;
		console.log(`API URL: ${apiUrl}`);

		const response = await fetch(apiUrl, {
			headers: {
				Authorization: `Basic ${token}`,
			},
		});

		console.log(`API Response Status: ${response.status}`);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`API Error Response: ${errorText}`);

			if (response.status === 404) {
				return NextResponse.json(
					{ error: "Company not found" },
					{ status: 404 },
				);
			}
			throw new Error(`API responded with status ${response.status}`);
		}

		const data = await response.json();
		console.log("API Response Data:", JSON.stringify(data, null, 2));

		// Extract relevant company information from correct structure
		const company = data.company || {};
		const about = company.about || {};
		const domain = company.domain || {};
		const locations = company.locations || {};
		const headquarters = locations.headquarters || {};
		const country = headquarters.country || {};

		const companyData = {
			name: about.name || "",
			website: domain.domain ? `https://${domain.domain}` : "",
			industry: about.industry || "",
			country: country.name || "",
		};

		console.log("Extracted Company Data:", companyData);
		return NextResponse.json(companyData);
	} catch (error) {
		console.error("Error fetching company data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch company data" },
			{ status: 500 },
		);
	}
}
