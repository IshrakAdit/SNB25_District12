package com.sadi.backend.configs;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.AuthErrorCode;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.JwtValidationException;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FirebaseJwtDecoder implements JwtDecoder {
    private final FirebaseAuth firebaseAuth;

    public FirebaseJwtDecoder(FirebaseApp firebaseApp) {
        this.firebaseAuth = FirebaseAuth.getInstance(firebaseApp);
    }

    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            FirebaseToken firebaseToken = validateToken(token);
            return createJwt(firebaseToken, token);
        } catch (FirebaseAuthException e) {
            AuthErrorCode authErrorCode = e.getAuthErrorCode();
            throw new JwtValidationException(e.getMessage(),
                    List.of(new OAuth2Error(authErrorCode.name(), e.getMessage(), null)));
        }
    }

    private Jwt createJwt(FirebaseToken firebaseToken, String token) {
        return Jwt.withTokenValue(token)
                .header("alg", "RS256")
                .header("type", "JWT")
                .subject(firebaseToken.getUid())
                .claim("email", firebaseToken.getEmail())
                .claim("email_verified", firebaseToken.isEmailVerified())
                .claim("iss", firebaseToken.getIssuer())
                .claim("scp", firebaseToken.getClaims().get("scp"))
                .build();
    }

    private FirebaseToken validateToken(String token) throws FirebaseAuthException {
        return firebaseAuth.verifyIdToken(token);
    }
}