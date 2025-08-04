import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

interface DialogProps {
	id: string
	title: string
	description?: string
	confirmText?: string
	cancelText?: string
	onConfirm: () => void
	onCancel?: () => void
}

interface DialogState {
	dialogs: DialogProps[]
	open: (props: Omit<DialogProps, 'id'>) => void
	close: (id: string) => void
}

const useDialogStore = create<DialogState>((set: any) => ({
	dialogs: [],
	 open: (props: any) =>
  set((state: any) => ({
			dialogs: [...state.dialogs, { ...props, id: uuidv4() }],
		})),
	 close: (id: any) =>
  set((state: any) => ({
   dialogs: state.dialogs.filter((d: any) => d.id !== id),
		})),
}))

export const useDialog = () => {
	const { dialogs, open, close } = useDialogStore()
	return {
		dialogs,
		open,
		close,
	}
}

// You would typically have a component that renders these dialogs, e.g., <DialogManager />
// This component would live in your main layout. 