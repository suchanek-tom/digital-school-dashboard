package com.dashboard.service.auth;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import com.dashboard.dto.auth.JwtValidationResult;
import com.dashboard.entity.User;

import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtService {

    private static final long CLOCK_SKEW_SECONDS = 30;

    @Value("${application.security.jwt.secret-key}")
    private final String secretKey;
    @Value("${application.security.jwt.expiration}")
    private final long jwtExpiration;
    @Value("${application.security.jwt.refresh-token.expiration}")
    private final long refreshExpiration;

    private SecretKey signingKey;
    private JwtParser parser;

    @PostConstruct
    void init() {
        this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
        this.parser = Jwts.parser()
                .verifyWith(signingKey)
                .clockSkewSeconds(CLOCK_SKEW_SECONDS)
                .build();
    }

    public ResponseCookie createRefreshTokenCookie(String refreshToken) {
        return ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/api/v1/auth/refresh")
                .maxAge(refreshExpiration / 1000) // Convert seconds to milliseconds
                .sameSite("Strict")
                .build();
    }

    public String generateToken(User user) {
        return buildToken(new HashMap<>(), user, jwtExpiration);
    }

    public String generateToken(Map<String, Object> extraClaims, User user) {
        return buildToken(extraClaims, user, jwtExpiration);
    }

    public String generateRefreshToken(User user) {
        return buildToken(new HashMap<>(), user, refreshExpiration);
    }

    /**
     * Validates a JWT token and returns detailed validation results.
     *
     * @param token the JWT token string to validate
     * @return JwtValidationResult containing validation status, expiration info,
     *         username, and status details
     *         - If valid: valid=true, expired=false, username extracted from token
     *         - If expired: valid=false, expired=true, username from expired claims
     *         - If invalid: valid=false, expired=false, username=null, error status
     */
    public JwtValidationResult validateToken(String token) {
        try {
            String username = parser.parseSignedClaims(token).getPayload().getSubject();

            return JwtValidationResult.builder()
                    .valid(true)
                    .expired(false)
                    .username(username)
                    .status(JwtValidationResult.ValidationStatus.VALID)
                    .build();

        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            return JwtValidationResult.builder()
                    .valid(false)
                    .expired(true)
                    .username(e.getClaims().getSubject())
                    .status(JwtValidationResult.ValidationStatus.EXPIRED)
                    .build();

        } catch (io.jsonwebtoken.security.SignatureException e) {
            return JwtValidationResult.builder()
                    .valid(false)
                    .expired(false)
                    .username(null)
                    .status(JwtValidationResult.ValidationStatus.INVALID_SIGNATURE)
                    .build();

        } catch (io.jsonwebtoken.MalformedJwtException e) {
            return JwtValidationResult.builder()
                    .valid(false)
                    .expired(false)
                    .username(null)
                    .status(JwtValidationResult.ValidationStatus.MALFORMED)
                    .build();

        } catch (io.jsonwebtoken.UnsupportedJwtException e) {
            return JwtValidationResult.builder()
                    .valid(false)
                    .expired(false)
                    .username(null)
                    .status(JwtValidationResult.ValidationStatus.UNSUPPORTED)
                    .build();

        } catch (IllegalArgumentException e) {
            return JwtValidationResult.builder()
                    .valid(false)
                    .expired(false)
                    .username(null)
                    .status(JwtValidationResult.ValidationStatus.ILLEGAL)
                    .build();

        } catch (io.jsonwebtoken.JwtException e) {
            return JwtValidationResult.builder()
                    .valid(false)
                    .expired(false)
                    .username(null)
                    .status(JwtValidationResult.ValidationStatus.INVALID)
                    .build();
        }
    }

    private String buildToken(Map<String, Object> extraClaims, User user, long expiration) {
        return Jwts.builder()
                .claims(extraClaims)
                .claim("uid", user.getUid())
                .claim("username", user.getUsername())
                .subject(user.getEmail())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(signingKey, Jwts.SIG.HS256)
                .compact();
    }
}
