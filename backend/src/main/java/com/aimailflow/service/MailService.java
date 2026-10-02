package com.aimailflow.service;

import com.aimailflow.request.MailRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class MailService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public MailService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmailReply(MailRequest mailRequest) {

        // Build the prompt using the email content and requested tone.
        String prompt = buildPrompt(mailRequest);

        /*
         * Gemini generateContent API expects the prompt
         * inside contents -> parts -> text.
         */
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                )
        );

        for (int attempt = 1; attempt <= 3; attempt++) {

            try {

                String response = webClient.post()
                        .uri(geminiApiUrl)
                        .header("Content-Type", "application/json")
                        .header("x-goog-api-key", geminiApiKey)
                        .bodyValue(requestBody)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();

                // Extract the generated email text from the Gemini response.
                return extractResponseContent(response);

            } catch (WebClientResponseException.ServiceUnavailable e) {

                if (attempt == 3) {

                    throw new ResponseStatusException(
                            HttpStatus.SERVICE_UNAVAILABLE,
                            "Gemini service is temporarily unavailable. Please try again later.",
                            e
                    );
                }

                try {

                    Thread.sleep(attempt * 2000L);

                } catch (InterruptedException interruptedException) {

                    // Restore the interrupted status before returning the error.
                    Thread.currentThread().interrupt();

                    throw new ResponseStatusException(
                            HttpStatus.INTERNAL_SERVER_ERROR,
                            "Request interrupted.",
                            interruptedException
                    );
                }

            } catch (Exception e) {

                // Convert unexpected API errors into a 502 response.
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Error calling Gemini API.",
                        e
                );
            }
        }

        throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Unable to generate email reply."
        );
    }

    private String extractResponseContent(String response) {

        try {

            ObjectMapper mapper = new ObjectMapper();

            JsonNode rootNode = mapper.readTree(response);

            /*
             * The generateContent API returns generated text inside:
             * candidates -> content -> parts -> text
             */
            return rootNode
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

        } catch (Exception e) {

            // Return a server-side error when the Gemini response cannot be parsed.
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error processing Gemini response.",
                    e
            );
        }
    }

    private String buildPrompt(MailRequest mailRequest) {

        StringBuilder prompt = new StringBuilder();

        prompt.append(
                "Generate a professional email reply for hte following email content. Please don't generate a subject line "
        );

        // Add the requested tone only when the client provides one.
        if (mailRequest.getTone() != null && !mailRequest.getTone().isEmpty()) {

            prompt.append("Use a ")
                    .append(mailRequest.getTone())
                    .append(" tone.");
        }

        // Add the original email as context for the model.
        prompt.append("\nOriginal email: \n")
                .append(mailRequest.getEmailContent());

        return prompt.toString();
    }
}