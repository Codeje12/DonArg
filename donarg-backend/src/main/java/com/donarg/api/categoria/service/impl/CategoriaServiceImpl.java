package com.donarg.api.categoria.service.impl;

import com.donarg.api.categoria.dto.request.CategoriaRequest;
import com.donarg.api.categoria.dto.response.CategoriaResponse;
import com.donarg.api.categoria.mapper.CategoriaMapper;
import com.donarg.api.categoria.model.Categoria;
import com.donarg.api.categoria.repository.CategoriaRepository;
import com.donarg.api.categoria.service.CategoriaService;
import com.donarg.api.exception.CategoriaDuplicadaException;
import com.donarg.api.exception.ResourceNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final CategoriaMapper categoriaMapper;

    @Override
    public CategoriaResponse crear(CategoriaRequest request) {
        if (categoriaRepository.existsByNombre(request.getNombre())) {
            throw new CategoriaDuplicadaException("Ya existe una categoria con ese nombre");
        }

        Categoria categoria = categoriaMapper.toEntity(request);
        Categoria categoriaGuardada = categoriaRepository.save(categoria);
        return categoriaMapper.toResponse(categoriaGuardada);
    }

    @Override
    public List<CategoriaResponse> listar() {
        return categoriaRepository.findAll().stream()
                .map(categoriaMapper::toResponse)
                .toList();
    }

    @Override
    public CategoriaResponse buscarPorId(Long id) {
        return categoriaMapper.toResponse(buscarCategoriaOFallar(id));
    }

    @Override
    public CategoriaResponse actualizar(Long id, CategoriaRequest request) {
        Categoria categoria = buscarCategoriaOFallar(id);

        if (!categoria.getNombre().equals(request.getNombre())
                && categoriaRepository.existsByNombre(request.getNombre())) {
            throw new CategoriaDuplicadaException("Ya existe una categoria con ese nombre");
        }

        categoria.setNombre(request.getNombre());
        Categoria categoriaActualizada = categoriaRepository.save(categoria);
        return categoriaMapper.toResponse(categoriaActualizada);
    }

    @Override
    public void eliminar(Long id) {
        Categoria categoria = buscarCategoriaOFallar(id);
        categoriaRepository.delete(categoria);
    }

    private Categoria buscarCategoriaOFallar(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro la categoria con id " + id));
    }
}
