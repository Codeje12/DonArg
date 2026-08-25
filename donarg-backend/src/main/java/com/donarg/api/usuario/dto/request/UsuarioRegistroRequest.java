package com.donarg.api.usuario.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRegistroRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    private String apellido;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no tiene un formato valido")
    private String email;

    @NotBlank(message = "El usuario es obligatorio")
    @Size(min = 3, max = 50, message = "El usuario debe tener al menos 3 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9._]+$", message = "El usuario solo puede tener letras, numeros, puntos y guiones bajos")
    private String nombreUsuario;

    @NotBlank(message = "La contrasena es obligatoria")
    @Size(min = 8, message = "La contrasena debe tener al menos 8 caracteres")
    private String password;

    @NotBlank(message = "El DNI es obligatorio")
    @Pattern(regexp = "^\\d{7,8}$", message = "El DNI debe tener 7 u 8 digitos")
    private String dni;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    private LocalDate fechaNacimiento;
}
