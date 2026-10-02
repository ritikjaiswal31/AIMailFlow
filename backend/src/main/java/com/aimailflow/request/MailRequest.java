package com.aimailflow.request;

import lombok.Data;

@Data
public class MailRequest {

    // Email content that the AI will use as context for generating the reply.
    private String emailContent;

    // Tone requested for the generated email reply.
    private String tone;
}