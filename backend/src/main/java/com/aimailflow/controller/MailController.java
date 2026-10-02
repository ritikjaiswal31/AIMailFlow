package com.aimailflow.controller;

import com.aimailflow.request.MailRequest;
import com.aimailflow.service.MailService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class MailController {

    private final MailService mailService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(
            @RequestBody MailRequest mailRequest
    ) {
        // Delegate email generation to the service layer.
        String response = mailService.generateEmailReply(mailRequest);

        return ResponseEntity.ok(response);
    }
}