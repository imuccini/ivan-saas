export default function NotFound() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-4">
			<div className="text-center">
				<h1 className="text-4xl font-bold">404</h1>
				<p className="mt-2 text-lg text-muted-foreground">
					Portal not found
				</p>
				<p className="mt-4 text-sm text-muted-foreground">
					This portal may have been deactivated or the URL is
					incorrect.
				</p>
			</div>
		</main>
	);
}
