"use client";

import OfferingForm from "@/components/offerings/offeringForm";
import { useService } from "@/context/serviceContext";
import type { OfferingDraft } from "@/lib/offering";

const SERVICE_TYPES = ["Class", "Appointment", "Repair", "Rental", "Experience"];

export default function ServiceRegistrationForm() {
  const { services, addService, updateService, editingIndex, saveError } = useService();
  const editing = editingIndex !== null ? services[editingIndex] : undefined;

  function toService(draft: OfferingDraft) {
    return {
      serviceName: draft.name,
      serviceType: draft.type,
      serviceDescription: draft.description,
      servicePrice: draft.price,
      serviceQuantity: draft.quantity,
      images: draft.images,
      details: draft.details,
    };
  }

  return (
    <>
    {saveError ? <p className="mb-4 text-sm text-red-700">{saveError}</p> : null}
    <OfferingForm
      key={editing ? `edit-${editingIndex}` : "new"}
      title={editing ? "edit a service" : "register a service"}
      subtitle={
        editing
          ? "Update what neighbours see for this service."
          : "Add something neighbours can book or join."
      }
      nameLabel="Service name"
      typeSuggestions={SERVICE_TYPES}
      quantityLabel="Spots"
      submitLabel={editing ? "Save changes" : "Add to listings"}
      savedLabel={editing ? "Saved" : "Added"}
      initial={
        editing
          ? {
              name: editing.serviceName,
              type: editing.serviceType,
              description: editing.serviceDescription,
              price: editing.servicePrice,
              quantity: editing.serviceQuantity,
              images: editing.images,
              details: editing.details,
            }
          : undefined
      }
      onSave={(draft) => {
        const service = toService(draft);
        if (editingIndex !== null && services[editingIndex]) updateService(editingIndex, service);
        else addService(service);
      }}
    />
    </>
  );
}
