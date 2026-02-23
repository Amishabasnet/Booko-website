import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
        Welcome back 🎬
      </h1>
      <p style={{ margin: "8px 0 16px", color: "rgba(255,255,255,0.75)" }}>
        Login to continue booking tickets on <b>Booko</b>.
      </p>

      <LoginForm />
    </>
  );
}
