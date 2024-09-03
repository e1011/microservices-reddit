package com.microservices.email_service.controller;

import com.microservices.email_service.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send_email")
    public String sendEmail(@RequestParam String to,
                            @RequestParam String subject,
                            @RequestParam String body) {
        boolean success = emailService.sendSimpleEmail(to, subject, body);
        return success ? "Email sent succesfully!" : "Failed to send email.";
    }
}