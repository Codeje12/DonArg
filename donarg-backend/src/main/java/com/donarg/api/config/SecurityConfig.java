package com.donarg.api.config;

import com.donarg.api.usuario.security.PasswordEncoderLegacy;
import com.donarg.api.usuario.security.UsuarioDetailsService;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final String URL_FRONT ="http://localhost:5173";

    // Se arma a mano (en vez de dejar que Spring lo adivine) para poder engancharle el
    // UserDetailsPasswordService: es lo que hace que, despues de un login exitoso con una
    // contrasena legacy (ver PasswordEncoderLegacy), Spring guarde sola la version hasheada.
    @Bean
    public AuthenticationManager authenticationManager(UsuarioDetailsService usuarioDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(usuarioDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        provider.setUserDetailsPasswordService(usuarioDetailsService);
        return new ProviderManager(provider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new PasswordEncoderLegacy();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                /*
                 .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                  IF_REQUIRED significa "creá una sesión HTTP si en algún momento hace falta una, no la fuerces de entrada".
                   Es literalmente el valor por defecto de Spring Security cuando no configurás nada — no cambia el comportamiento de tu app
                  en nada todavía. Lo agregué solo para dejarlo escrito a propósito en el código: alguien que lea SecurityConfig.java de acá
                  a un año va a ver explícitamente que esta app usa sesiones por decisión, no porque "quedó así".*/
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                        // publico: registro, login, logout y las consultas de apoyo del registro (no piden sesion)
                        .requestMatchers(HttpMethod.POST, "/api/usuarios", "/api/usuarios/login", "/api/usuarios/logout").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/usuarios/**").permitAll()
                        //navegar el feed, sus fotos y las categorias sin cuenta
                        .requestMatchers(HttpMethod.GET, "/api/publicaciones/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/imagenes/**").permitAll()
                        // las imagenes ya subidas (los <img> del navegador no mandan cookies de sesion)
                        .requestMatchers("/uploads/**").permitAll()
                        // todo lo demas (crear publicacion, ofertar, mensajes, etc.) pide sesion activa
                        .anyRequest().authenticated());
        return http.build();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(URL_FRONT));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE"));
        config.setAllowedHeaders(List.of("*"));
        /* Le dice al navegador "está bien que este backend reciba y devuelva cookies en pedidos que vengan de localhost:5173".
            Sin esto, aunque más adelante el backend te mande la cookie de sesión (JSESSIONID) en la respuesta del login,
            el navegador la va a tirar directo a la basura por venir de un pedido cross-origin sin permiso explícito de credenciales.
            Es la pieza que te permite tener sesiones funcionando entre un frontend en un puerto y un backend en otro
            (que es justo tu caso).
        */
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
