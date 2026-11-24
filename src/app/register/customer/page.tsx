import PageFrame from "@/components/pageFrame";
import ShopperForm from "@/components/register/shopperForm";

export default function ClientRegisterPage() {
  return (
    <PageFrame
      eyebrow="join in"
      title="shopper profile"
      description="Create an profile to follow local businesses."
    >
      <ShopperForm />
    </PageFrame>
  );
}
