import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Props {
  abierto: boolean
  titulo: string
  descripcion: string
  onConfirmar: () => void
  onCancelar: () => void
  textoConfirmar?: string
  textoCancelar?: string
}

export default function ConfirmDialog({
  abierto,
  titulo,
  descripcion,
  onConfirmar,
  onCancelar,
  textoConfirmar = "Eliminar",
  textoCancelar = "Cancelar",
}: Props) {
  return (
    <AlertDialog open={abierto} onOpenChange={(open) => !open && onCancelar()}>
      <AlertDialogContent className="bg-slate-900 border-slate-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">{titulo}</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            {descripcion}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onCancelar}
            className="bg-slate-800 hover:bg-slate-700 text-white border-slate-800"
          >
            {textoCancelar}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmar}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {textoConfirmar}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}