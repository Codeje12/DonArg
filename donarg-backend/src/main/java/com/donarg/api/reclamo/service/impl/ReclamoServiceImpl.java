package com.donarg.api.reclamo.service.impl;

import com.donarg.api.chat.service.ChatService;
import com.donarg.api.exception.OperacionInvalidaException;
import com.donarg.api.exception.ResourceNotFoundException;
import com.donarg.api.publicacion.model.EstadoPublicacion;
import com.donarg.api.publicacion.model.Publicacion;
import com.donarg.api.publicacion.model.TipoPublicacion;
import com.donarg.api.publicacion.repository.PublicacionRepository;
import com.donarg.api.reclamo.dto.request.ReclamoRequest;
import com.donarg.api.reclamo.dto.response.ReclamoResponse;
import com.donarg.api.reclamo.mapper.ReclamoMapper;
import com.donarg.api.reclamo.model.EstadoReclamo;
import com.donarg.api.reclamo.model.Reclamo;
import com.donarg.api.reclamo.repository.ReclamoRepository;
import com.donarg.api.reclamo.service.ReclamoService;
import com.donarg.api.usuario.model.Usuario;
import com.donarg.api.usuario.security.UsuarioActualProvider;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReclamoServiceImpl implements ReclamoService {

    private final ReclamoRepository reclamoRepository;
    private final PublicacionRepository publicacionRepository;
    private final UsuarioActualProvider usuarioActualProvider;
    private final ChatService chatService;
    private final ReclamoMapper reclamoMapper;

    @Override
    public ReclamoResponse crear(ReclamoRequest request) {
        Publicacion publicacion = publicacionRepository.findById(request.getPublicacionId())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro la publicacion con id " + request.getPublicacionId()));

        if (publicacion.getTipoPublicacion() != TipoPublicacion.ENCONTRADO) {
            throw new OperacionInvalidaException("Solo se puede reclamar sobre publicaciones de tipo ENCONTRADO");
        }

        if (publicacion.getEstado() != EstadoPublicacion.ACTIVA) {
            throw new OperacionInvalidaException("Solo se puede reclamar sobre una publicacion en estado ACTIVA");
        }

        Usuario usuario = usuarioActualProvider.obtener();

        if (usuario.getId().equals(publicacion.getUsuario().getId())) {
            throw new OperacionInvalidaException("El dueño de la publicacion no puede reclamar su propio hallazgo");
        }

        Reclamo reclamo = reclamoMapper.toEntity(request, publicacion, usuario);
        Reclamo reclamoGuardado = reclamoRepository.save(reclamo);
        return reclamoMapper.toResponse(reclamoGuardado);
    }

    @Override
    public List<ReclamoResponse> listarPorPublicacion(Long publicacionId) {
        return reclamoRepository.findByPublicacionId(publicacionId).stream()
                .map(reclamoMapper::toResponse)
                .toList();
    }

    @Override
    public ReclamoResponse aceptar(Long id) {
        Reclamo reclamo = buscarReclamoOFallar(id);
        validarDueño(reclamo.getPublicacion());

        if (reclamo.getEstado() != EstadoReclamo.PENDIENTE) {
            throw new OperacionInvalidaException("Solo se puede aceptar un reclamo en estado PENDIENTE");
        }

        Publicacion publicacion = reclamo.getPublicacion();
        if (publicacion.getEstado() != EstadoPublicacion.ACTIVA) {
            throw new OperacionInvalidaException("La publicacion ya no esta en estado ACTIVA");
        }

        reclamo.setEstado(EstadoReclamo.ACEPTADO);
        reclamoRepository.save(reclamo);

        publicacion.setUsuarioElegido(reclamo.getUsuario());
        publicacion.setEstado(EstadoPublicacion.RESERVADA);
        publicacionRepository.save(publicacion);
        chatService.crearParaPublicacion(publicacion.getId());

        reclamoRepository.findByPublicacionIdAndEstado(publicacion.getId(), EstadoReclamo.PENDIENTE)
                .forEach(otro -> {
                    otro.setEstado(EstadoReclamo.RECHAZADO);
                    reclamoRepository.save(otro);
                });

        return reclamoMapper.toResponse(reclamo);
    }

    @Override
    public ReclamoResponse rechazar(Long id) {
        Reclamo reclamo = buscarReclamoOFallar(id);
        validarDueño(reclamo.getPublicacion());

        if (reclamo.getEstado() != EstadoReclamo.PENDIENTE) {
            throw new OperacionInvalidaException("Solo se puede rechazar un reclamo en estado PENDIENTE");
        }

        reclamo.setEstado(EstadoReclamo.RECHAZADO);
        Reclamo reclamoActualizado = reclamoRepository.save(reclamo);
        return reclamoMapper.toResponse(reclamoActualizado);
    }

    private void validarDueño(Publicacion publicacion) {
        if (!publicacion.getUsuario().getId().equals(usuarioActualProvider.obtenerId())) {
            throw new OperacionInvalidaException("Solo el dueño de la publicacion puede resolver este reclamo");
        }
    }

    private Reclamo buscarReclamoOFallar(Long id) {
        return reclamoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro el reclamo con id " + id));
    }
}
