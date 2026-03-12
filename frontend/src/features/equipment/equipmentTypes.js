export const EQUIPMENT_STATUSES = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "UNDER_MAINTENANCE", label: "Under Maintenance" },
]

export function statusToBadgeVariant(status) {
  switch (status) {
    case "ACTIVE":
      return "default"
    case "INACTIVE":
      return "secondary"
    case "UNDER_MAINTENANCE":
      return "outline"
    default:
      return "secondary"
  }
}

