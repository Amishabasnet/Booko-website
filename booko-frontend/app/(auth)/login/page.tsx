import AuthForm from "../components/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="w-96">
        <h1 className="text-2xl mb-4">Login</h1>
        <AuthForm type="login" />
      </div>
    </div>
  );
}
