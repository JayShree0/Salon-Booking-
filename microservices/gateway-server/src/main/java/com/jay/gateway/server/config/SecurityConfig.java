package com.jay.gateway.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.oauth2.server.resource.web.server.authentication.ServerBearerTokenAuthenticationConverter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.server.WebFilter;
import reactor.core.publisher.Mono;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Value("${jwt.secret:SalonBookingSecretKeyForJwtTokenSigningAndValidation2026WithMinimum256BitsLength}")
    private String jwtSecret;

    private static boolean isPublicEndpoint(HttpMethod method, String path) {
        if (path.equals("/auth/me") || path.equals("/api/auth/me")) {
            return false;
        }
        if (path.startsWith("/auth/") || path.startsWith("/api/auth/") || path.startsWith("/api/notifications/ws")) {
            return true;
        }

        if (method == HttpMethod.GET) {
            // Owner-specific salon endpoints must remain authenticated
            if (path.startsWith("/api/salons/owner")) {
                return false;
            }
            if (path.contains("salon-owner")) {
                return false;
            }
            if (path.startsWith("/api/salons") || path.startsWith("/salons")) {
                return true;
            }
            if (path.startsWith("/api/categories") || path.startsWith("/api/service-offering")) {
                return true;
            }
            if (path.startsWith("/api/bookings/slots") || path.startsWith("/api/reviews")) {
                return true;
            }
        }

        return false;
    }

    /**
     * Remove unnecessary Authorization header on public GET requests before
     * forwarding downstream or triggering unnecessary token validation.
     */
    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public WebFilter publicEndpointsHeaderFilter() {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            if (isPublicEndpoint(request.getMethod(), request.getPath().value())) {
                if (request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    ServerHttpRequest mutatedRequest = request.mutate()
                            .headers(headers -> headers.remove(HttpHeaders.AUTHORIZATION))
                            .build();
                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                }
            }
            return chain.filter(exchange);
        };
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .authorizeExchange(exchanges -> exchanges

                        // 1. Public Auth & WebSockets
                        .pathMatchers("/auth/me", "/api/auth/me").authenticated()
                        .pathMatchers("/auth/**", "/api/auth/**").permitAll()
                        .pathMatchers("/api/notifications/ws/**").permitAll()

                        // 2. Salon Owner & Admin protected endpoints
                        .pathMatchers(
                                "/api/salons/owner/**",
                                "/api/salons/owner",
                                "/api/categories/salon-owner**",
                                "/api/categories/salon-owner/**",
                                "/api/notifications/salon-owner/**",
                                "/api/service-offering/salon-owner/**",
                                "/api/bookings/salon/**",
                                "/api/bookings/salon",
                                "/api/bookings/report/**",
                                "/api/bookings/report"
                        ).hasAnyRole("SALON_OWNER", "ADMIN")

                        .pathMatchers(HttpMethod.POST, "/api/salons/**", "/salons/**").hasAnyRole("SALON_OWNER", "ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/salons/**", "/salons/**").hasAnyRole("SALON_OWNER", "ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/api/salons/**", "/salons/**").hasAnyRole("SALON_OWNER", "ADMIN")

                        // 3. Public GET endpoints for Salon Browsing
                        .pathMatchers(HttpMethod.GET,
                                "/api/salons",
                                "/api/salons/",
                                "/api/salons/search/**",
                                "/api/salons/search",
                                "/api/salons/*",
                                "/salons/**"
                        ).permitAll()

                        // 4. Public GET endpoints for Categories, Services, Slots & Reviews
                        .pathMatchers(HttpMethod.GET,
                                "/api/categories/**",
                                "/api/service-offering/**",
                                "/api/bookings/slots/**",
                                "/api/reviews/**"
                        ).permitAll()

                        // 5. Customer-Only Operations (Booking Creation, Customer History, Payment Order Creation)
                        .pathMatchers(HttpMethod.POST, "/api/bookings", "/api/bookings/").hasRole("CUSTOMER")
                        .pathMatchers("/api/bookings/customer/**", "/api/bookings/customer").hasRole("CUSTOMER")
                        .pathMatchers(HttpMethod.POST, "/api/payments/create", "/api/payments/create/").hasRole("CUSTOMER")

                        // 6. Protected Operations (Require Login: Customer, Owner, Admin)
                        .pathMatchers(
                                "/api/bookings/**",
                                "/api/payments/**",
                                "/api/users/**",
                                "/api/notifications/**"
                        ).hasAnyRole("CUSTOMER", "SALON_OWNER", "ADMIN")

                        .anyExchange().authenticated()
                )

                .oauth2ResourceServer(oauth2 -> oauth2
                        .bearerTokenConverter(bearerTokenConverter())
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(grantAuthoritiesExtractor()))
                );

        return http.build();
    }

    @Bean
    public ReactiveJwtDecoder reactiveJwtDecoder() {
        SecretKeySpec secretKey = new SecretKeySpec(
                jwtSecret.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
        );
        return NimbusReactiveJwtDecoder.withSecretKey(secretKey).build();
    }

    private ServerAuthenticationConverter bearerTokenConverter() {
        ServerBearerTokenAuthenticationConverter defaultConverter = new ServerBearerTokenAuthenticationConverter();
        return exchange -> {
            ServerHttpRequest request = exchange.getRequest();
            if (isPublicEndpoint(request.getMethod(), request.getPath().value())) {
                return Mono.empty();
            }
            return defaultConverter.convert(exchange);
        };
    }

    private CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:5170",
                "http://localhost:5173",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:5170",
                "http://127.0.0.1:5173"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private Converter<Jwt, Mono<AbstractAuthenticationToken>> grantAuthoritiesExtractor() {

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(
                new JwtRoleConverter());

        return new ReactiveJwtAuthenticationConverterAdapter(jwtAuthenticationConverter);
    }
}
