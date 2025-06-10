import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ConfirmCancelDialog(
    {
        isOpen,
        title,
        description,
        confirmText = "예",
        cancelText = "아니오",
        onConfirm,
        onCancel,
    }:{
        isOpen: boolean
        title: string
        description?: string
        confirmText?: string
        cancelText?: string
        onConfirm: () => void
        onCancel: () => void
    }) {
    return (
        <div>
            <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        {description && (
                            <AlertDialogDescription>
                                {description}
                            </AlertDialogDescription>
                        )}
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <button onClick={onCancel}>
                                {cancelText}
                            </button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <button onClick={onConfirm}>
                                {confirmText}
                            </button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )

}