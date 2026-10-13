package tech.com.project.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.com.project.dto.request.LoginRequestDto;
import tech.com.project.dto.response.LoginResponseDto;
import tech.com.project.dto.response.UserProfileDto;
import tech.com.project.security.jwt.JwtUtils;
import tech.com.project.security.services.UserDetailsImpl;
import tech.com.project.service.AuthService;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Override
    public LoginResponseDto login(LoginRequestDto request) {
        log.info("Procesando autenticación para el usuario: {}", request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateToken(userDetails);

        log.info("Autenticación exitosa. Token generado para: {}", userDetails.getUsername());

        return LoginResponseDto.builder()
                .token(jwt)
                .type("Bearer")
                .id(userDetails.getId())
                .email(userDetails.getEmail())
                .firstName(userDetails.getFirstName())
                .lastName(userDetails.getLastName())
                .roles(userDetails.getRoleNames())
                .permissions(userDetails.getPermissionNames())
                .expiresIn(jwtUtils.getJwtExpirationMs())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl userDetails)) {
            throw new IllegalStateException("No hay un usuario autenticado en la sesión actual.");
        }

        return UserProfileDto.builder()
                .id(userDetails.getId())
                .firstName(userDetails.getFirstName())
                .lastName(userDetails.getLastName())
                .email(userDetails.getEmail())
                .isActive(userDetails.isEnabled())
                .roles(userDetails.getRoleNames())
                .permissions(userDetails.getPermissionNames())
                .build();
    }
}
