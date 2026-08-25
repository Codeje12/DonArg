package com.donarg.api.interes.service.impl;

import com.donarg.api.exception.InteresDuplicadoException;
import com.donarg.api.exception.OperacionInvalidaException;
import com.donarg.api.exception.ResourceNotFoundException;
import com.donarg.api.interes.dto.request.InteresRequest;
import com.donarg.api.interes.dto.response.InteresResponse;
import com.donarg.api.interes.mapper.InteresMapper;
import com.donarg.api.interes.model.Interes;
import com.donarg.api.interes.repository.InteresRepository;
import com.donarg.api.interes.service.InteresService;
import com.donarg.api.publicacion.model.EstadoPublicacion;
import com.donarg.api.publicacion.model.Publicacion;
import com.donarg.api.publicacion.model.TipoPublicacion;
import com.donarg.api.publicacion.repository.PublicacionRepository;
import com.donarg.api.usuario.model.Usuario;
import com.donarg.api.usuario.security.UsuarioActualProvider;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InteresServiceImpl implements InteresService {

    private final InteresRepository interesRepository;
    private final PublicacionRepository publicacionRepository;
    private final UsuarioActualProvider usuarioActualProvider;
    private final InteresMapper interesMapper;

    @Override
    public InteresResponse marcar(InteresRequest request) {
        Publicacion publicacion = publicacionRepository.findById(request.getPublicacionId())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro la publicacion con id " + request.getPublicacionId()));

        if (publicacion.getTipoPublicacion() != TipoPublicacion.DONACION) {
            throw new OperacionInvalidaException("Solo se puede marcar interes en publicaciones de tipo DONACION");
        }

        if (publicacion.getEstado() != EstadoPublicacion.ACTIVA) {
            throw new OperacionInvalidaException("Solo se puede marcar interes en una publicacion en estado ACTIVA");
        }

        Usuario usuario = usuarioActualProvider.obtener();

        if (usuario.getId().equals(publicacion.getUsuario().getId())) {
            throw new OperacionInvalidaException("El dueño de la publicacion no puede marcar interes en su propia publicacion");
        }

        if (interesRepository.existsByPublicacionIdAndUsuarioId(request.getPublicacionId(), usuario.getId())) {
            throw new InteresDuplicadoException("Ya marcaste interes en esta publicacion");
        }

        Interes interes = interesMapper.toEntity(request, publicacion, usuario);
        Interes interesGuardado = interesRepository.save(interes);
        return interesMapper.toResponse(interesGuardado);
    }

    @Override
    public List<InteresResponse> listarPorPublicacion(Long publicacionId) {
        return interesRepository.findByPublicacionId(publicacionId).stream()
                .map(interesMapper::toResponse)
                .toList();
    }

    @Override
    public void eliminar(Long id) {
        Interes interes = interesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro el interes con id " + id));

        if (!interes.getUsuario().getId().equals(usuarioActualProvider.obtenerId())) {
            throw new OperacionInvalidaException("Solo quien marco el interes lo puede borrar");
        }

        interesRepository.delete(interes);
    }
}
