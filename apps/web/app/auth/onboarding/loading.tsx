import { LoaderIcon } from "lucide-react";

export default function Loading() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
			<LoaderIcon className="size-8 animate-spin text-primary" />
			<div className="text-center">
				<h2 className="font-semibold text-lg">
					Loading...
				</h2>
			</div>
		</div>
	);
}
