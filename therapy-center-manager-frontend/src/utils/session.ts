export function getSessionStatusTone(status?: string) {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "CANCELLED":
      return "danger";
    case "SCHEDULED":
    default:
      return "warning";
  }
}

export function getSessionStatusLabel(status?: string) {
  switch (status) {
    case "COMPLETED":
      return "Ολοκληρωμένη";
    case "CANCELLED":
      return "Ακυρωμένη";
    case "SCHEDULED":
    default:
      return "Προγραμματισμένη";
  }
}