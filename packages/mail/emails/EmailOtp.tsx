import { Text, Section, Heading } from "@react-email/components";
import React from "react";
import Wrapper from "../src/components/Wrapper";
import { defaultLocale, defaultTranslations } from "../src/util/translations";
import type { BaseMailProps } from "../types";

export function EmailOtp({
	otp,
	locale,
	translations,
}: {
	otp: string;
} & BaseMailProps) {
	return (
		<Wrapper>
			<Heading className="text-2xl font-bold text-center my-4">
				Your Verification Code
			</Heading>
			<Text>
				Enter the following code to verify your email address.
			</Text>

			<Section className="bg-gray-100 rounded-lg p-4 text-center my-6">
				<Text className="text-4xl font-mono font-bold tracking-widest m-0">
					{otp}
				</Text>
			</Section>

			<Text className="text-sm text-muted-foreground">
				If you didn't request this code, you can safely ignore this email.
			</Text>
		</Wrapper>
	);
}

EmailOtp.PreviewProps = {
	locale: defaultLocale,
	translations: defaultTranslations,
	otp: "123456",
};

export default EmailOtp;
