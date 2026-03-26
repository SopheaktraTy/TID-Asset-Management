package com.tid.asset_management_bridge.common.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("TID Asset Management - Password Reset");

        // Replace with your actual frontend URL once deployed
        String resetUrl = "http://localhost:3000/reset-password?token=" + token;

        String text = "Hello,\n\n"
                + "You requested a password reset for your account. "
                + "Please click the link below to set a new password. "
                + "This link expires in 15 minutes.\n\n"
                + resetUrl + "\n\n"
                + "If you did not request this, please disregard this email.";

        message.setText(text);
        mailSender.send(message);
    }
}
