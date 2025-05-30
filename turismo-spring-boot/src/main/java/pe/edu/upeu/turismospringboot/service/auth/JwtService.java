package pe.edu.upeu.turismospringboot.service.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import pe.edu.upeu.turismospringboot.model.entity.Usuario;

import java.security.Key;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtService {

    private static final String SECRET_KEY = "586E3272357538782F413F4428472B4B6250655368566B597033733676397924";
    private Key key;

    private final long EXPIRATION_MS = 1000 * 60 * 60 * 4; // 4 horas

    @PostConstruct
    public void init() {
        byte[] keyBytes = SECRET_KEY.getBytes(); // ← 💡 ahora usamos directamente la constante
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // ✅ Generar token desde Usuario
    public String getToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();

        // ✅ authorities
        List<String> authorities = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        claims.put("authorities", authorities);

        // ✅ idUsuario si es instancia de Usuario
        if (userDetails instanceof Usuario usuario) {
            claims.put("idUsuario", usuario.getIdUsuario());
            claims.put("role", usuario.getRol().getNombre().replace("ROLE_", "")); // e.g., "USUARIO"
        }

        return buildToken(claims, userDetails.getUsername());
    }

    // ✅ Construcción final del token
    private String buildToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + EXPIRATION_MS);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiration)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Extraer claims
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(this.key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String getUsernameFromToken(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // ✅ Extraer authorities desde el token
    public List<String> getAuthoritiesFromToken(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("authorities", List.class);
    }
}
