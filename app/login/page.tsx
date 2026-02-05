import { Hero } from "../components/ui/Hero";
import { Pill } from "../components/ui/Pill";

export default function LoginPage() {
  return (
    <div className="container page-stack">
      <Hero className="reveal">
        <div>
          <Pill>Member Portal</Pill>
          <h1>Welcome back to BDS.</h1>
          <p>Manage bookings, passes, and class history.</p>
        </div>
        <div className="hero-card">
          <form className="form">
            <input type="email" placeholder="Email address" />
            <input type="password" placeholder="Password" />
            <button className="cta" type="submit">
              Log In
            </button>
            <button className="cta secondary" type="button">
              Continue with Google
            </button>
          </form>
        </div>
      </Hero>
    </div>
  );
}
