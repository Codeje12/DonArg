package com.donarg.api.publicacion.service.impl;

import com.donarg.api.categoria.model.Categoria;
import com.donarg.api.categoria.repository.CategoriaRepository;
import com.donarg.api.chat.service.ChatService;
import com.donarg.api.exception.OperacionInvalidaException;
import com.donarg.api.exception.ResourceNotFoundException;
import com.donarg.api.interes.repository.InteresRepository;
import com.donarg.api.oferta.repository.OfertaRepository;
import com.donarg.api.publicacion.dto.request.ElegirInteresadoRequest;
import com.donarg.api.publicacion.dto.request.PublicacionActualizacionRequest;
import com.donarg.api.publicacion.dto.request.PublicacionRequest;
import com.donarg.api.publicacion.dto.response.PublicacionResponse;
import com.donarg.api.publicacion.mapper.PublicacionMapper;
import com.donarg.api.publicacion.model.EstadoPublicacion;
import com.donarg.api.publicacion.model.Publicacion;
import com.donarg.api.publicacion.model.TipoPublicacion;
import com.donarg.api.publicacion.repository.PublicacionRepository;
import com.donarg.api.publicacion.service.PublicacionService;
import com.donarg.api.usuario.model.Usuario;
import com.donarg.api.usuario.repository.UsuarioRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PublicacionServiceImpl implements PublicacionService {

    private final PublicacionRepository publicacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final InteresRepository interesRepository;
    private final OfertaRepository ofertaRepository;
    private final ChatService chatService;
    private final PublicacionMapper publicacionMapper;

    @Override
    public PublicacionResponse crear(PublicacionRequest request) {
        Usuario usuario = buscarUsuarioOFallar(request.getUsuarioId());
        Categoria categoria = buscarCategoriaOFallar(request.getCategoriaId());

        Publicacion publicacion = publicacionMapper.toEntity(request, usuario, categoria);
        Publicacion publicacionGuardada = publicacionRepository.save(publicacion);
        return publicacionMapper.toResponse(publicacionGuardada);
    }

    @Override
    public List<PublicacionResponse> listar(TipoPublicacion tipo, EstadoPublicacion estado, Long categoriaId) {
        return publicacionRepository.buscarConFiltros(tipo, estado, categoriaId).stream()
                .map(publicacionMapper::toResponse)
                .toList();
    }

    @Override
    public PublicacionResponse buscarPorId(Long id) {
        return publicacionMapper.toResponse(buscarPublicacionOFallar(id));
    }

    @Override
    public PublicacionResponse actualizar(Long id, PublicacionActualizacionRequest request) {
        Publicacion publicacion = buscarPublicacionOFallar(id);

        if (publicacion.getEstado() != EstadoPublicacion.ACTIVA) {
            throw new OperacionInvalidaException("Solo se puede editar una publicacion en estado ACTIVA");
        }

        Categoria categoria = buscarCategoriaOFallar(request.getCategoriaId());

        publicacion.setCategoria(categoria);
        publicacion.setTitulo(request.getTitulo());
        publicacion.setDescripcion(request.getDescripcion());
        publicacion.setZonaAprox(request.getZonaAprox());
        publicacion.setCondicion(request.getCondicion());
        publicacion.setLatitud(request.getLatitud());
        publicacion.setLongitud(request.getLongitud());

        Publicacion publicacionActualizada = publicacionRepository.save(publicacion);
        return publicacionMapper.toResponse(publicacionActualizada);
    }

    @Override
    public PublicacionResponse elegirInteresado(Long id, ElegirInteresadoRequest request) {
        Publicacion publicacion = buscarPublicacionOFallar(id);

        if (publicacion.getEstado() != EstadoPublicacion.ACTIVA) {
            throw new OperacionInvalidaException("Solo se puede elegir un interesado sobre una publicacion en estado ACTIVA");
        }

        if (request.getUsuarioElegidoId().equals(publicacion.getUsuario().getId())) {
            throw new OperacionInvalidaException("El dueño de la publicacion no puede elegirse a si mismo");
        }

        switch (publicacion.getTipoPublicacion()) {
            case DONACION -> {
                if (!interesRepository.existsByPublicacionIdAndUsuarioId(id, request.getUsuarioElegidoId())) {
                    throw new OperacionInvalidaException("El usuario elegido no marco interes en esta publicacion");
                }
            }
            case PEDIDO -> {
                if (!ofertaRepository.existsByPublicacionIdAndUsuarioId(id, request.getUsuarioElegidoId())) {
                    throw new OperacionInvalidaException("El usuario elegido no se ofrecio para esta publicacion");
                }
            }
            case ENCONTRADO -> throw new OperacionInvalidaException(
                    "Las publicaciones de tipo ENCONTRADO se resuelven aceptando un reclamo, no eligiendo interesado");
        }

        Usuario usuarioElegido = buscarUsuarioOFallar(request.getUsuarioElegidoId());

        publicacion.setUsuarioElegido(usuarioElegido);
        publicacion.setEstado(EstadoPublicacion.RESERVADA);

        Publicacion publicacionActualizada = publicacionRepository.save(publicacion);
        chatService.crearParaPublicacion(publicacionActualizada.getId());
        return publicacionMapper.toResponse(publicacionActualizada);
    }

    @Override
    public PublicacionResponse cerrar(Long id) {
        Publicacion publicacion = buscarPublicacionOFallar(id);

        if (publicacion.getEstado() != EstadoPublicacion.RESERVADA) {
            throw new OperacionInvalidaException("Solo se puede cerrar una publicacion en estado RESERVADA");
        }

        publicacion.setEstado(EstadoPublicacion.COMPLETADA);

        Publicacion publicacionActualizada = publicacionRepository.save(publicacion);
        return publicacionMapper.toResponse(publicacionActualizada);
    }

    @Override
    public PublicacionResponse cancelar(Long id) {
        Publicacion publicacion = buscarPublicacionOFallar(id);

        if (publicacion.getEstado() != EstadoPublicacion.ACTIVA && publicacion.getEstado() != EstadoPublicacion.RESERVADA) {
            throw new OperacionInvalidaException("No se puede cancelar una publicacion en estado " + publicacion.getEstado());
        }

        publicacion.setEstado(EstadoPublicacion.CANCELADA);

        Publicacion publicacionActualizada = publicacionRepository.save(publicacion);
        return publicacionMapper.toResponse(publicacionActualizada);
    }

    private Publicacion buscarPublicacionOFallar(Long id) {
        return publicacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro la publicacion con id " + id));
    }

    private Usuario buscarUsuarioOFallar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro el usuario con id " + id));
    }

    private Categoria buscarCategoriaOFallar(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro la categoria con id " + id));
    }
}
