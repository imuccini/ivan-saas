import { AIChatInterface } from "@saas/ai/components/AIChatInterface";
import { Button } from "@ui/components/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@ui/components/sheet";
import { Sparkles, XIcon } from "lucide-react";

interface MobileChatDrawerProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	initialMessage?: string;
}

export function MobileChatDrawer({
	isOpen,
	onOpenChange,
	initialMessage,
}: MobileChatDrawerProps) {
	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			<SheetContent
				side="bottom"
				className="h-[85vh] flex flex-col rounded-t-2xl p-0"
			>
				{/* Handle bar for drag indicator */}
				<div className="flex justify-center pt-2 pb-1">
					<div className="w-12 h-1 rounded-full bg-muted-foreground/30" />
				</div>

				<SheetHeader className="px-4 pb-2 border-b">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
								<Sparkles className="size-4 text-primary" />
							</div>
							<SheetTitle>AI Assistant</SheetTitle>
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="size-8"
							onClick={() => onOpenChange(false)}
						>
							<XIcon className="size-4" />
							<span className="sr-only">Close</span>
						</Button>
					</div>
					<SheetDescription className="sr-only">
						Chat with the AI Assistant
					</SheetDescription>
				</SheetHeader>

				<AIChatInterface initialMessage={initialMessage} />
			</SheetContent>
		</Sheet>
	);
}
