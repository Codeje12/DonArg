package com.donarg.api.exception;

import java.util.Map;

public class RegistroInvalidoException extends RuntimeException {

    private final Map<String, String> errores;

    public RegistroInvalidoException(Map<String, String> errores) {
        super("Hay datos invalidos en el registro");
        this.errores = errores;
    }

    public Map<String, String> getErrores() {
        return errores;
    }
}
