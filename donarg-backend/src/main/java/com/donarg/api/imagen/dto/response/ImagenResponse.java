package com.donarg.api.imagen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImagenResponse {

    private Long id;
    private Long publicacionId;
    private String nombreArchivo;
}
