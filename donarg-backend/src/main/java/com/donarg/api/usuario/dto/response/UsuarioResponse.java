package com.donarg.api.usuario.dto.response;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponse {

    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private String nombreUsuario;
    private LocalDate fechaNacimiento;
    private boolean verificado;
    private boolean emailVerificado;
    private float promedioValoracion;
    private String fotoPerfil;
}
