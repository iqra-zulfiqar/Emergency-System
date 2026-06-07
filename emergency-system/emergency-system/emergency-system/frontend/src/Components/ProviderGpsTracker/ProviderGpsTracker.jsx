import { useMemo } from "react";
import { useProviderTracking } from "../../hooks/useProviderTracking";

const ProviderGpsTracker = ({ bookings, providerId }) => {
  const acceptedBookingIds = useMemo(
    () =>
      (bookings || [])
        .filter((b) => (b.status || "pending") === "accepted")
        .map((b) => String(b._id)),
    [bookings],
  );

  useProviderTracking(acceptedBookingIds, providerId);

  if (acceptedBookingIds.length === 0) return null;

  return (
    <p className="provider-gps-hint">
      Live GPS active for {acceptedBookingIds.length} accepted booking
      {acceptedBookingIds.length > 1 ? "s" : ""}. Keep this dashboard open while
      traveling to the customer.
    </p>
  );
};

export { ProviderGpsTracker };
