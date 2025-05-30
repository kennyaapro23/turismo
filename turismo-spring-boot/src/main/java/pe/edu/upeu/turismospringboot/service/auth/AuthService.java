package pe.edu.upeu.turismospringboot.service.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pe.edu.upeu.turismospringboot.model.dto.auth.AuthResponse;
import pe.edu.upeu.turismospringboot.model.dto.auth.LoginRequest;
import pe.edu.upeu.turismospringboot.model.dto.auth.RegisterRequest;
import pe.edu.upeu.turismospringboot.model.entity.Persona;
import pe.edu.upeu.turismospringboot.model.entity.Rol;
import pe.edu.upeu.turismospringboot.model.entity.Usuario;
import pe.edu.upeu.turismospringboot.model.enums.EstadoCuenta;
import pe.edu.upeu.turismospringboot.repository.PersonaRepository;
import pe.edu.upeu.turismospringboot.repository.RolRepository;
import pe.edu.upeu.turismospringboot.repository.UsuarioRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final PersonaRepository personaRepository;
    private final RolRepository rolRepository;

    public AuthResponse login(LoginRequest request) {
        // ✅ Autenticar
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        Usuario userEntity = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        UserDetails userDetails = userEntity; // Usuario implementa UserDetails

        // ✅ Construir claims extra
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("idUsuario", userEntity.getIdUsuario());
        extraClaims.put("authorities", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        // ✅ Generar token con claims
        String token = jwtService.getToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        // Buscar el rol
        Rol rol = rolRepository.findByNombre("ROLE_USUARIO")
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        // Crear persona
        Persona persona = new Persona();
        persona.setNombres(request.getNombres());
        persona.setApellidos(request.getApellidos());
        persona.setTipoDocumento(request.getTipoDocumento());
        persona.setNumeroDocumento(request.getNumeroDocumento());
        persona.setTelefono(request.getTelefono());
        persona.setDireccion(request.getDireccion());
        persona.setCorreoElectronico(request.getCorreoElectronico());
        persona.setFechaNacimiento(request.getFechaNacimiento());
        personaRepository.save(persona);

        // Crear usuario
        Usuario usuario = new Usuario();
        usuario.setUsername(request.getUsername());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setEstado(EstadoCuenta.ACTIVO);
        usuario.setRol(rol);
        usuario.setPersona(persona);
        usuarioRepository.save(usuario);

        // ✅ UserDetails
        UserDetails userDetails = usuario;

        // ✅ Claims extra
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("idUsuario", usuario.getIdUsuario());
        extraClaims.put("authorities", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        String token = jwtService.getToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .build();
    }
}
