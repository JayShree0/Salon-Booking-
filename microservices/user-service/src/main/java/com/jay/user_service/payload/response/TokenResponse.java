package com.jay.user_service.payload.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class TokenResponse {

    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("refresh_token")
    private String refreshToken;

    @JsonProperty("expired_in")
    private int expiresIn;

    @JsonProperty("token_property")
    private String tokenType;
}
