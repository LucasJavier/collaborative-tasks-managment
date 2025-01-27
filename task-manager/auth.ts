import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { prisma } from "./lib/prisma";
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcrypt";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub,
    Credentials({
      name: "Credenciales",
      credentials: { // Que credenciales/campos de un formulario queremos validar
        usuario_correo: {label: "Usuario o Correo", type: "string"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials: {usuario_correo: string; password: string}){
        if (!credentials?.usuario_correo || !credentials?.password) {
          throw new Error("Credenciales incompletas.");
        }
        const {usuario_correo, password} = credentials;
      
        const user = await prisma.usuario.findFirst({
          where: {
            OR: [
              { email: usuario_correo},
              { nombreUsuario: usuario_correo}
            ]
          },
        });

        if(!user) {throw new Error("No user found");}

        const isValidPassword = await compare(password, user.password);
        if(!isValidPassword) throw new Error("Invalid password");

        return{
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          nombreUsuario: user.nombreUsuario,
          email: user.email,
          rolID: user.rolID
        }
      } 
    })
  ],
  callbacks: {
    async signIn({user}){
      const nombre = user.name! || "usuario desconocido";
      const email = user.email!;

      await prisma.usuario.upsert({ 
        where: { email }, 
        update: {}, 
        create: { 
          nombre,
          apellido:"",
          nombreUsuario:"",
          email,
          password:"",
          rolID:1, },
      });
      return true;
    },
    async jwt( {token,user}: {token: any; user: any}){
      if(user){
        const dbUser = await prisma.usuario.findUnique({where: {email: user.email}});
        if (!dbUser) throw new Error("Usuario no encontrado");
        token.rolId = dbUser?.rolID || 1;
        token.id = dbUser.id;
        token.nombreUsuario = dbUser.nombreUsuario;
      }
      return token;
    },
    async session( {session,token}: {session: any; token: any}){
      session.user = session.user || {};
      if(token?.rolId){
        session.user.rolId = token.rolId;
        session.user.id = token.id;
        session.user.name = token.nombreUsuario;
      }
      return session;
    }
  },
  secret: process.env.JWT_CLAVE!,
  session: {
    strategy: "jwt", // Usamos JWT para manejar sesiones
  },
  pages: {
    signIn: "/auth/login", // Página personalizada de inicio de sesión
    error: "/auth/unauthorized", // Página personalizada de error
  },
});