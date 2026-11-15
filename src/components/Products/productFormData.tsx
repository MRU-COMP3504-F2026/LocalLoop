"use client";

import OfferingForm from "@/components/offerings/offeringForm";
import { useProduct } from "@/context/productContext";
import { PRODUCT_DESCRIPTION_WORD_LIMIT, type OfferingDraft } from "@/lib/offering";

const PRODUCT_TYPES = ["Baked goods", "Prepared food", "Drink", "Goods", "Home", "Wear"];

export default function ProductRegistrationForm() {
  const { products, addProduct, updateProduct, editingIndex, saveError } = useProduct();
  const editing = editingIndex !== null ? products[editingIndex] : undefined;

  function toProduct(draft: OfferingDraft) {
    return {
      productName: draft.name,
      productType: draft.type,
      productDescription: draft.description,
      productPrice: draft.price,
      productQuantity: draft.quantity,
      images: draft.images,
      details: draft.details,
    };
  }

  return (
    <>
    {saveError ? <p className="mb-4 text-sm text-red-700">{saveError}</p> : null}
    <OfferingForm
      key={editing ? `edit-${editingIndex}` : "new"}
      title={editing ? "edit a product" : "register a product"}
      subtitle={
        editing
          ? "Update what neighbours see for this product."
          : "Add something neighbours can find in your shop."
      }
      nameLabel="Product name"
      typeSuggestions={PRODUCT_TYPES}
      quantityLabel="Quantity"
      descriptionWordLimit={PRODUCT_DESCRIPTION_WORD_LIMIT}
      submitLabel={editing ? "Save changes" : "Add to listings"}
      savedLabel={editing ? "Saved" : "Added"}
      initial={
        editing
          ? {
              name: editing.productName,
              type: editing.productType,
              description: editing.productDescription,
              price: editing.productPrice,
              quantity: editing.productQuantity,
              images: editing.images,
              details: editing.details,
            }
          : undefined
      }
      onSave={(draft) => {
        const product = toProduct(draft);
        if (editingIndex !== null && products[editingIndex]) updateProduct(editingIndex, product);
        else addProduct(product);
      }}
    />
    </>
  );
}
