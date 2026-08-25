package com.donarg.api.usuario.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

// Compara contra BCrypt como siempre, pero si el valor guardado no tiene pinta de hash
// (cuentas cargadas a mano en la base, de antes de que existiera el hasheo, etc.) tambien
// acepta el texto plano exacto. Sirve para migrar esas cuentas solas, en su proximo login,
// sin tener que resetearles la contrasena a mano una por una.
public class PasswordEncoderLegacy implements PasswordEncoder {

    private final BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();

    @Override
    public String encode(CharSequence rawPassword) {
        // las contraseñas nuevas (o ya migradas) siempre nacen como hash BCrypt real
        return bcrypt.encode(rawPassword);
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        if (bcrypt.matches(rawPassword, encodedPassword)) {
            return true;
        }

        // no matcheo como BCrypt: probamos el caso legacy -- el valor guardado no
        // parece un hash (no arranca con "$2") y coincide letra por letra con lo tipeado
        boolean pareceHash = encodedPassword != null && encodedPassword.startsWith("$2");
        return !pareceHash && rawPassword.toString().equals(encodedPassword);
    }

    @Override
    public boolean upgradeEncoding(String encodedPassword) {
        // le avisa a Spring Security "esto hay que volver a guardarlo" cuando lo guardado
        // todavia no es un hash BCrypt de verdad
        return encodedPassword == null || !encodedPassword.startsWith("$2");
    }
}
