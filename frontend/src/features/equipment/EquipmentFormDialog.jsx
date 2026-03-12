import { useEffect, useMemo, useState } from "react"

import { createEquipment, updateEquipment } from "@/api/equipment"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EQUIPMENT_STATUSES } from "@/features/equipment/equipmentTypes"

function formatDateInput(d) {
  if (!d) return ""
  return d
}

export function EquipmentFormDialog({
  open,
  onOpenChange,
  mode,
  equipment,
  types,
  onSaved,
}) {
  const isEdit = mode === "edit"

  const initial = useMemo(() => {
    const defaultTypeId = types?.[0]?.id ? String(types[0].id) : ""
    return {
      name: equipment?.name ?? "",
      typeId: equipment?.type?.id ? String(equipment.type.id) : defaultTypeId,
      status: equipment?.status ?? "INACTIVE",
      lastCleanedDate: formatDateInput(equipment?.lastCleanedDate ?? ""),
    }
  }, [equipment, types])

  const [form, setForm] = useState(initial)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (open) {
      setForm(initial)
      setFormError("")
      setFieldErrors({})
    }
  }, [open, initial])

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = "Name is required."
    if (!form.typeId) errs.typeId = "Type is required."
    if (!form.status) errs.status = "Status is required."
    if (!form.lastCleanedDate) errs.lastCleanedDate = "Last cleaned date is required."
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function onSubmit() {
    setFormError("")
    if (!validate()) return
    setSubmitting(true)
    try {
      const payload = {
        name: form.name,
        typeId: Number(form.typeId),
        status: form.status,
        lastCleanedDate: form.lastCleanedDate,
      }

      if (isEdit) {
        await updateEquipment(equipment.id, payload)
      } else {
        await createEquipment(payload)
      }
      onSaved?.()
      onOpenChange(false)
    } catch (e) {
      const body = e?.body
      setFormError(body?.message || e?.message || "Failed to save equipment.")
      setFieldErrors(body?.fieldErrors || {})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit equipment" : "Add equipment"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the equipment details."
              : "Create a new equipment record."}
          </DialogDescription>
        </DialogHeader>

        {formError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        ) : null}

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="equip-name">Name</Label>
            <Input
              id="equip-name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Generator A"
            />
            {fieldErrors.name ? (
              <p className="text-sm text-red-600">{fieldErrors.name}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label>Type</Label>
            <Select value={form.typeId} onValueChange={(v) => update("typeId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.typeId ? (
              <p className="text-sm text-red-600">{fieldErrors.typeId}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => update("status", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {EQUIPMENT_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.status ? (
              <p className="text-sm text-red-600">{fieldErrors.status}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="equip-last-cleaned">Last cleaned date</Label>
            <Input
              id="equip-last-cleaned"
              type="date"
              value={form.lastCleanedDate}
              onChange={(e) => update("lastCleanedDate", e.target.value)}
            />
            {fieldErrors.lastCleanedDate ? (
              <p className="text-sm text-red-600">{fieldErrors.lastCleanedDate}</p>
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
          <Button type="button" onClick={onSubmit} disabled={submitting}>
            {submitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

