import Link from "next/link";
import PageFrame from "@/components/pageFrame";

const choices = [
  {
    href: "/register/business",
    label: "Create Business Profile",
    detail: "Put your shop on the map",
  },
  {
    href: "/register/customer",
    label: "Create Shopper Profile",
    detail: "Follow businesses nearby",
  },
];

export default function RegisterPage() {
  return (
    <PageFrame
      eyebrow="join in"
      title="create an profile"
      description="Choose the kind of profile you need."
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
