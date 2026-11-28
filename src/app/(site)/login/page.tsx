import Link from "next/link";
import PageFrame from "@/components/pageFrame";

const choices = [
  {
    href: "/login/business",
    label: "Business Account",
    detail: "Back to your shop",
  },
  {
    href: "/login/customer",
    label: "Shopper Account",
    detail: "Find businesses nearby",
  },
];

export default function LoginPage() {
  return (
    <PageFrame
      eyebrow="welcome back"
      title="sign in"
      description="Choose the kind of account you have."
    >
      <ul className="grid gap-4 md:grid-cols-2">
        {choices.map((choice) => (
          <li key={choice.href}>
            <Link
              href={choice.href}
              className="flex h-full flex-col justify-between rounded-[28px] bg-white p-5 hover:bg-loop-sage"
            >
              <span>
                <span className="block font-serif text-2xl">{choice.label}</span>
                <span className="mt-2 block text-sm text-loop-green">{choice.detail}</span>
              </span>
              <span className="mt-6 inline-flex w-fit rounded-full bg-loop-green-dark px-5 py-3 text-sm font-semibold text-white">
                Continue
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
