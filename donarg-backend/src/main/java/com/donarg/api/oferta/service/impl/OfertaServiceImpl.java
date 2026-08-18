package com.donarg.api.oferta.service.impl;

import com.donarg.api.exception.OfertaDuplicadaException;
import com.donarg.api.exception.OperacionInvalidaException;
import com.donarg.api.exception.ResourceNotFoundException;
import com.donarg.api.oferta.dto.request.OfertaRequest;
import com.donarg.api.oferta.dto.response.OfertaResponse;
import com.donarg.api.oferta.mapper.OfertaMapper;
import com.donarg.api.oferta.model.Oferta;
import com.donarg.api.oferta.repository.OfertaRepository;
import com.donarg.api.oferta.service.OfertaService;
import com.donarg.api.publicacion.model.EstadoPublicacion;
import com.donarg.api.publicacion.model.Publicacion;
import com.donarg.api.publicacion.model.TipoPublicacion;
import com.donarg.api.publicacion.repository.PublicacionRepository;
import com.donarg.api.usuario.model.Usuario;
import com.donarg.api.usuario.repository.UsuarioRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OfertaServiceImpl implements OfertaService {

    private final OfertaRepository ofertaRepository;
    private final PublicacionRepository publicacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final OfertaMapper ofertaMapper;

    @Override
    public OfertaResponse ofrecer(OfertaRequest request) {
        Publicacion publicacion = publicacionRepository.findById(request.getPublicacionId())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro la publicacion con id " + request.getPublicacionId()));

        if (publicacion.getTipoPublicacion() != TipoPublicacion.PEDIDO) {
            throw new OperacionInvalidaException("Solo se puede ofrecer en publicaciones de tipo PEDIDO");
        }

        if (publicacion.getEstado() != EstadoPublicacion.ACTIVA) {
            throw new OperacionInvalidaException("Solo se puede ofrecer en una publicacion en estado ACTIVA");
        }

        if (request.getUsuarioId().equals(publicacion.getUsuario().getId())) {
            throw new OperacionInvalidaException("El dueño de la publicacion no puede ofrecerse a si mismo");
        }

        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro el usuario con id " + request.getUsuarioId()));

        if (ofertaRepository.existsByPublicacionIdAndUsuarioId(request.getPublicacionId(), request.getUsuarioId())) {
            throw new OfertaDuplicadaException("Ya te ofreciste para esta publicacion");
        }

        Oferta oferta = ofertaMapper.toEntity(request, publicacion, usuario);
        Oferta ofertaGuardada = ofertaRepository.save(oferta);
        return ofertaMapper.toResponse(ofertaGuardada);
    }

    @Override
    public List<OfertaResponse> listarPorPublicacion(Long publicacionId) {
        return ofertaRepository.findByPublicacionId(publicacionId).stream()
                .map(ofertaMapper::toResponse)
                .toList();
    }

    @Override
    public void eliminar(Long id) {
        Oferta oferta = ofertaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro la oferta con id " + id));
        ofertaRepository.delete(oferta);
    }
}
