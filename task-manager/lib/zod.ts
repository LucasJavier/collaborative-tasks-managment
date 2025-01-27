import { z } from "zod";

export const loginSchema = z.object({
  usuario_correo: z.string()
    .refine((val) => {
      if (val.includes('@')) {
        return (val.includes('.com') && val.length >= 10);
      }
      return val.length <= 20;
    }, {
      message: "El valor debe ser un correo electrónico válido o un nombre de usuario de máximo 20 caracteres."
    }),
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .nonempty("La contraseña es requerida."),
});

export const registroSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido."),
  apellido: z.string().min(1, "El apellido es requerido."),
  nombreUsuario: z
    .string()
    .min(4, "El nombre de usuario debe tener al menos 4 caracteres."),
  email: z
    .string()
    .email("Correo electrónico inválido.")
    .min(1, "El correo es requerido.")
    .refine((val) => val.includes('@') && val.includes('.com'), {
      message: "El correo debe contener '@' y '.com'.",
    }),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .min(1, "La contraseña es requerida."),
})