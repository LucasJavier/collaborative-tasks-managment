import { handleGitHubSignIn } from "@/handlers/gitHubAccion";

export default function GitHubSignIn() {
  return (
    <form action={handleGitHubSignIn}>
      <button
        type="submit"
        className="bg-[rgb(28,27,25)] text-white py-2 px-6 rounded transition duration-300 ease-in-out transform hover:bg-green-500 hover:scale-105"
      >
        Inicia sesión con GitHub
      </button>
    </form>
  );
}