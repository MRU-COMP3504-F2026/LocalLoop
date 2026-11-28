import LoginForm from "@/components/loginForm";

export default function BusinessLoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center px-5 py-10 text-center text-loop-green-dark sm:px-6 sm:py-14">
      <p className="text-sm uppercase tracking-[0.2em] text-loop-green">welcome back</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">business sign in</h1>
      <p className="mt-3 text-loop-green">Email and password for your shop.</p>
      <div className="mt-8 w-full text-left">
        <LoginForm accountType="business" />
      </div>
    </main>
  );
}
