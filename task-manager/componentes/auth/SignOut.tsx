import { handleSignOut } from "@/handlers/signOutAccion";

export default function SignOut() {
  return (
    <form action={handleSignOut}>
      <button type="submit">Cerrar sesión</button>
    </form>
  );
}