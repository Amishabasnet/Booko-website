import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
        Join the club <span className="text-primary">.</span>
      </h1>
      <p className="text-sm text-white/50 mb-10 leading-relaxed max-w-sm">
        Join Booko to reserve seats, save favorites, and experience cinema like never before.
      </p>

      <RegisterForm />
    </div>
  );
}
