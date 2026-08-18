package com.donarg.api.imagen.service.impl;

import com.donarg.api.exception.ArchivoInvalidoException;
import com.donarg.api.exception.ResourceNotFoundException;
import com.donarg.api.imagen.dto.response.ImagenResponse;
import com.donarg.api.imagen.mapper.ImagenMapper;
import com.donarg.api.imagen.model.Imagen;
import com.donarg.api.imagen.repository.ImagenRepository;
import com.donarg.api.imagen.service.ImagenService;
import com.donarg.api.publicacion.model.Publicacion;
import com.donarg.api.publicacion.repository.PublicacionRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ImagenServiceImpl implements ImagenService {

    // Nomenclatura pedida: fecha + hora + milisegundo, ej. 20260817153045123.jpg
    private static final DateTimeFormatter FORMATO_NOMBRE = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");

    private final ImagenRepository imagenRepository;
    private final PublicacionRepository publicacionRepository;
    private final ImagenMapper imagenMapper;

    @Value("${donarg.imagenes.directorio}")
    private String directorioImagenes;

    @Override
    public ImagenResponse agregar(Long publicacionId, MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new ArchivoInvalidoException("El archivo esta vacio");
        }

        String contentType = archivo.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ArchivoInvalidoException("El archivo debe ser una imagen");
        }

        Publicacion publicacion = publicacionRepository.findById(publicacionId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro la publicacion con id " + publicacionId));

        String nombreArchivo = generarNombreArchivo(archivo.getOriginalFilename());
        guardarEnDisco(archivo, nombreArchivo);

        Imagen imagen = imagenMapper.toEntity(nombreArchivo, publicacion);
        Imagen imagenGuardada = imagenRepository.save(imagen);
        return imagenMapper.toResponse(imagenGuardada);
    }

    @Override
    public List<ImagenResponse> listarPorPublicacion(Long publicacionId) {
        return imagenRepository.findByPublicacionId(publicacionId).stream()
                .map(imagenMapper::toResponse)
                .toList();
    }

    @Override
    public void eliminar(Long id) {
        Imagen imagen = imagenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro la imagen con id " + id));
        imagenRepository.delete(imagen);
    }

    private String generarNombreArchivo(String nombreOriginal) {
        String extension = "";
        if (nombreOriginal != null && nombreOriginal.contains(".")) {
            extension = nombreOriginal.substring(nombreOriginal.lastIndexOf('.'));
        }
        return LocalDateTime.now().format(FORMATO_NOMBRE) + extension;
    }

    private void guardarEnDisco(MultipartFile archivo, String nombreArchivo) {
        try {
            Path directorio = Path.of(directorioImagenes);
            Files.createDirectories(directorio);
            Path destino = directorio.resolve(nombreArchivo);
            Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo guardar el archivo en disco", e);
        }
    }
}
