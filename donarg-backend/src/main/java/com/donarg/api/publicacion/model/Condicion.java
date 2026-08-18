package com.donarg.api.publicacion.model;

public enum Condicion {
    NUEVO("Nuevo"),
    POCO_USO("Poco uso"),
    USADO("Usado");

    private final String etiqueta;

    Condicion(String etiqueta) {
        this.etiqueta = etiqueta;
    }

    public String getEtiqueta() {
        return etiqueta;
    }
}