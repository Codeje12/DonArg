package com.donarg.api.valoracion.service.impl;

import com.donarg.api.exception.OperacionInvalidaException;
import com.donarg.api.exception.ResourceNotFoundException;
import com.donarg.api.exception.ValoracionDuplicadaException;
import com.donarg.api.publicacion.model.EstadoPublicacion;
import com.donarg.api.publicacion.model.Publicacion;
import com.donarg.api.publicacion.repository.PublicacionRepository;
import com.donarg.api.usuario.model.Usuario;
import com.donarg.api.usuario.repository.UsuarioRepository;
import com.donarg.api.valoracion.dto.request.ValoracionRequest;
import com.donarg.api.valoracion.dto.response.ValoracionResponse;
import com.donarg.api.valoracion.mapper.ValoracionMapper;
import com.donarg.api.valoracion.model.Valoracion;
import com.donarg.api.valoracion.repository.ValoracionRepository;
import com.donarg.api.valoracion.service.ValoracionService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValoracionServiceImpl implements ValoracionService {

    private final ValoracionRepository valoracionRepository;
    private final PublicacionRepository publicacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final ValoracionMapper valoracionMapper;

    @Override
    public ValoracionResponse crear(ValoracionRequest request) {
        Publicacion publicacion = publicacionRepository.findById(request.getPublicacionId())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro la publicacion con id " + request.getPublicacionId()));

        if (publicacion.getEstado() != EstadoPublicacion.COMPLETADA) {
            throw new OperacionInvalidaException("Solo se puede calificar una publicacion en estado COMPLETADA");
        }

        Usuario evaluador = usuarioRepository.findById(request.getUsuarioEvaluadorId())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro el usuario con id " + request.getUsuarioEvaluadorId()));

        Usuario evaluado = determinarEvaluado(publicacion, evaluador.getId());

        if (valoracionRepository.existsByPublicacionIdAndUsuarioEvaluadorId(request.getPublicacionId(), evaluador.getId())) {
            throw new ValoracionDuplicadaException("Ya calificaste esta publicacion");
        }

        Valoracion valoracion = valoracionMapper.toEntity(request, publicacion, evaluador, evaluado);
        Valoracion valoracionGuardada = valoracionRepository.save(valoracion);

        actualizarPromedio(evaluado);

        return valoracionMapper.toResponse(valoracionGuardada);
    }

    @Override
    public List<ValoracionResponse> listarPorPublicacion(Long publicacionId) {
        return valoracionRepository.findByPublicacionId(publicacionId).stream()
                .map(valoracionMapper::toResponse)
                .toList();
    }

    @Override
    public List<ValoracionResponse> listarPorUsuarioEvaluado(Long usuarioId) {
        return valoracionRepository.findByUsuarioEvaluadoId(usuarioId).stream()
                .map(valoracionMapper::toResponse)
                .toList();
    }

    private Usuario determinarEvaluado(Publicacion publicacion, Long evaluadorId) {
        Usuario dueño = publicacion.getUsuario();
        Usuario elegido = publicacion.getUsuarioElegido();

        if (evaluadorId.equals(dueño.getId())) {
            if (elegido == null) {
                throw new OperacionInvalidaException("Esta publicacion no tiene un usuario elegido para calificar");
            }
            return elegido;
        }

        if (elegido != null && evaluadorId.equals(elegido.getId())) {
            return dueño;
        }

        throw new OperacionInvalidaException("El usuario no participo en esta publicacion");
    }

    private void actualizarPromedio(Usuario evaluado) {
        List<Valoracion> valoraciones = valoracionRepository.findByUsuarioEvaluadoId(evaluado.getId());
        double promedio = valoraciones.stream()
                .mapToInt(Valoracion::getPuntaje)
                .average()
                .orElse(0);

        evaluado.setPromedioValoracion((float) promedio);
        usuarioRepository.save(evaluado);
    }
}
