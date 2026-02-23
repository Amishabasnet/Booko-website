import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
        Create your Booko account 🍿
      </h1>
      <p style={{ margin: "8px 0 16px", color: "rgba(255,255,255,0.75)" }}>
        Join Booko to reserve seats, save favorites, and checkout faster.
      </p>

      <RegisterForm />
    </>
  );
}
