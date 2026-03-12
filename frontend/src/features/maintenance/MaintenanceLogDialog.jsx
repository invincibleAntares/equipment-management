import { useEffect, useState } from "react"

import { createMaintenance } from "@/api/equipment"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

function todayIsoDate() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export function MaintenanceLogDialog({ open, onOpenChange, equipment, onLogged }) {
  const [maintenanceDate, setMaintenanceDate] = useState(todayIsoDate())
  const [performedBy, setPerformedBy] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (!open) return
    setMaintenanceDate(todayIsoDate())
    setPerformedBy("")
    setNotes("")
    setError("")
    setFieldErrors({})
  }, [open])

  function validate() {
    const errs = {}
    if (!equipment?.id) errs.equipment = "Equipment is required."
    if (!maintenanceDate) errs.maintenanceDate = "Maintenance date is required."
    if (!performedBy.trim()) errs.performedBy = "Performed by is required."
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function onSubmit() {
    setError("")
    if (!validate()) return
    setSubmitting(true)
    try {
      await createMaintenance({
        equipmentId: equipment.id,
        maintenanceDate,
        notes: notes.trim() ? notes : null,
        performedBy,
      })
      onLogged?.()
      onOpenChange(false)
    } catch (e) {
      const body = e?.body
      setError(body?.message || e?.message || "Failed to log maintenance.")
      setFieldErrors(body?.fieldErrors || {})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Log maintenance</DialogTitle>
          <DialogDescription>
            {equipment ? `For ${equipment.name}` : "Select equipment"}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="maint-date">Maintenance date</Label>
            <Input
              id="maint-date"
              type="date"
              value={maintenanceDate}
              onChange={(e) => setMaintenanceDate(e.target.value)}
            />
            {fieldErrors.maintenanceDate ? (
              <p className="text-sm text-red-600">{fieldErrors.maintenanceDate}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="performed-by">Performed by</Label>
            <Input
              id="performed-by"
              value={performedBy}
              onChange={(e) => setPerformedBy(e.target.value)}
              placeholder="e.g. Ayesha"
            />
            {fieldErrors.performedBy ? (
              <p className="text-sm text-red-600">{fieldErrors.performedBy}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="maint-notes">Notes (optional)</Label>
            <Textarea
              id="maint-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What was done?"
            />
            {fieldErrors.notes ? (
              <p className="text-sm text-red-600">{fieldErrors.notes}</p>
            ) : null}
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button
            variant="secondary"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onSubmit} disabled={submitting || !equipment?.id}>
            {submitting ? "Saving..." : "Log"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

