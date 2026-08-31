package com.jay.user_service.service;

import com.jay.user_service.payload.dto.*;
import com.jay.user_service.payload.response.TokenResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KeycloakService {

    private static final String KEYCLOAK_BASE_URL = "http://localhost:8080";

    private static final String KEYCLOAK_ADMIN_API =
            KEYCLOAK_BASE_URL + "/admin/realms/master/users";

    private static final String TOKEN_URL =
            KEYCLOAK_BASE_URL + "/realms/master/protocol/openid-connect/token";

    private static final String CLIENT_ID = "salon-booking-client";

    private static final String CLIENT_SECRET =
            "FSLWTfaDudEAIg7CyHXMpYRw2tAMrGvujv3r3DxF64Xfs4MGmmPSfzQ5ZTtbfICbS3OlyKHgYFwK2nMaTzmra5";

    private static final String GRANT_TYPE = "password";

    private static final String scope = "openid profile email";

    private static final String username = "jay";

    private static final String password = "jay@123";

    private static final String clientId =
            "6c60cf93-f1a7-4946-99cf-0be9b1bfcfbc";

    private final RestTemplate restTemplate;

    public void createUser(SignupDTO signupDTO) throws Exception {

        String ACCESS_TOKEN = getAdminAccessToken(
                username,
                password,
                GRANT_TYPE,
                null
        ).getAccessToken();

        Credential credential = new Credential();
        credential.setTemporary(false);
        credential.setType("password");
        credential.setValue(signupDTO.getPassword());

        UserRequest userRequest = new UserRequest();
        userRequest.setUsername(signupDTO.getUsername());
        userRequest.setFirstName(signupDTO.getFullName());
        userRequest.setEmail(signupDTO.getEmail());
        userRequest.getCredentials().add(credential);
        userRequest.setEnabled(true);

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        httpHeaders.setBearerAuth(ACCESS_TOKEN);

        HttpEntity<UserRequest> requestEntity =
                new HttpEntity<>(userRequest, httpHeaders);

        ResponseEntity<String> response = restTemplate.exchange(
                KEYCLOAK_ADMIN_API,
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        if (response.getStatusCode() == HttpStatus.CREATED) {

            System.out.println("User created successfully");

            KeycloakUserDTO user =
                    fetchFirstUserByUsername(
                            signupDTO.getUsername(),
                            ACCESS_TOKEN
                    );

            KeycloakRole role =
                    getRoleByName(
                            clientId,
                            ACCESS_TOKEN,
                            signupDTO.getRole().toString()
                    );

            List<KeycloakRole> roles = new ArrayList<>();
            roles.add(role);

            assignRoleToUser(
                    user.getId(),
                    clientId,
                    roles,
                    ACCESS_TOKEN
            );

        } else {

            System.out.println("User creation failed");
            throw new Exception(response.getBody());
        }
    }

    public TokenResponse getAdminAccessToken(String username,
                                             String password,
                                             String grantType,
                                             String refreshToken) throws Exception {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();

        requestBody.add("grant_type", grantType);
        requestBody.add("username", username);
        requestBody.add("password", password);
        requestBody.add("client_id", CLIENT_ID);
        requestBody.add("client_secret", CLIENT_SECRET);
        requestBody.add("scope", scope);

        if (refreshToken != null) {
            requestBody.add("refresh_token", refreshToken);
        }

        HttpEntity<MultiValueMap<String, String>> requestEntity =
                new HttpEntity<>(requestBody, headers);

        ResponseEntity<TokenResponse> response =
                restTemplate.exchange(
                        TOKEN_URL,
                        HttpMethod.POST,
                        requestEntity,
                        TokenResponse.class
                );

        if (response.getStatusCode() == HttpStatus.OK &&
                response.getBody() != null) {
            return response.getBody();
        }

        throw new Exception("Failed to obtain access token");
    }

    public KeycloakRole getRoleByName(String clientId,
                                      String token,
                                      String role) throws Exception {

        String url = KEYCLOAK_BASE_URL
                + "/admin/realms/master/clients/"
                + clientId
                + "/roles/"
                + role;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        ResponseEntity<KeycloakRole> response =
                restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        requestEntity,
                        KeycloakRole.class
                );

        return response.getBody();
    }

    public KeycloakUserDTO fetchFirstUserByUsername(String username,
                                                    String token) throws Exception {

        String url = KEYCLOAK_BASE_URL
                + "/admin/realms/master/users?username="
                + username;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        ResponseEntity<KeycloakUserDTO[]> response =
                restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        requestEntity,
                        KeycloakUserDTO[].class
                );

        KeycloakUserDTO[] users = response.getBody();

        if (users != null && users.length > 0) {
            return users[0];
        }

        throw new Exception("User not found with username " + username);
    }

    public void assignRoleToUser(String userId,
                                 String clientId,
                                 List<KeycloakRole> roles,
                                 String token) {

        String url = KEYCLOAK_BASE_URL
                + "/admin/realms/master/users/"
                + userId
                + "/role-mappings/clients/"
                + clientId;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<List<KeycloakRole>> requestEntity =
                new HttpEntity<>(roles, headers);

        try {
            ResponseEntity<String> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.POST,
                            requestEntity,
                            String.class
                    );

        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to assign role: " + e.getMessage());
        }
    }

    public KeycloakUserDTO fetchUserProfileByJwt(String token)
            throws Exception {
        String url = KEYCLOAK_BASE_URL + "/realms/master/protocol/openid-connect/userinfo";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        try {
            ResponseEntity<KeycloakUserDTO> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    requestEntity,
                    KeycloakUserDTO.class
            );
            return response.getBody();

        } catch (Exception e) {
            throw new RuntimeException("Failed to get user info " + e.getMessage());
        }

    }
}