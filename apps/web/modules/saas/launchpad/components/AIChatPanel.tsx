import { AIChatInterface } from "@saas/ai/components/AIChatInterface";
import { Button } from "@ui/components/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@ui/components/sheet";
import { SparklesIcon, XIcon } from "lucide-react";

interface AIChatPanelProps {
	open: boolean;
	onClose: () => void;
	initialMessage?: string;
}

export function AIChatPanel({
	open,
	onClose,
	initialMessage,
}: AIChatPanelProps) {
	return (
		<Sheet open={open} onOpenChange={onClose}>
			<SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
				<SheetHeader className="border-b px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
								<SparklesIcon className="size-4 text-primary" />
							</div>
							<SheetTitle>AI Assistant</SheetTitle>
						</div>
						<Button variant="ghost" size="icon" onClick={onClose}>
							<XIcon className="size-4" />
						</Button>
					</div>
				</SheetHeader>

				<AIChatInterface initialMessage={initialMessage} />
			</SheetContent>
		</Sheet>
	);
}
