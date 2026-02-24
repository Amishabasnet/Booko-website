import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
        Welcome back <span className="text-primary">.</span>
      </h1>
      <p className="text-sm text-white/50 mb-10 leading-relaxed max-w-sm">
        Login to continue booking tickets on <b className="text-white">Booko</b>.
      </p>

      <LoginForm />
    </div>
  );
}
