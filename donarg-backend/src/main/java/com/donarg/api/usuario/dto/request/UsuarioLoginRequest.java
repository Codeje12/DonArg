package com.donarg.api.usuario.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioLoginRequest {

    @NotBlank(message = "Ingresa tu email o usuario")
    private String identificador;

    @NotBlank(message = "Ingresa tu contrasena")
    private String password;
}
