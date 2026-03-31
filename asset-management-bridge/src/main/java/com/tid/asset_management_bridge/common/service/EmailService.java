package com.tid.asset_management_bridge.common.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
        if (toEmail == null) {
            throw new IllegalArgumentException("Recipient email must not be null");
        }
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            // true = multipart, required for inline images
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            if (fromEmail == null) {
                throw new IllegalStateException("From email must be configured");
            }
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("TID Asset Management - Password Reset");

            // Replace with your actual frontend URL once deployed
            String resetUrl = "http://localhost:5173/reset-password?token=" + token;

            String htmlContent = buildEmailHtml(resetUrl);
            helper.setText(java.util.Objects.requireNonNull(htmlContent), true); // true = isHtml

            // Inline logo — file must be at:
            // src/main/resources/assets/Logo_Bakertilly/Baker Tilly Logo_Charcoal.png
            ClassPathResource logoResource = new ClassPathResource(
                    "assets/Logo_Bakertilly/Baker Tilly Logo_Charcoal.png");
            helper.addInline("bakerTillyLogo", logoResource);

            mailSender.send(mimeMessage);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password reset email to " + toEmail, e);
        }
    }

    private String buildEmailHtml(String resetUrl) {
        return "<!DOCTYPE html>"
                + "<html lang=\"en\">"
                + "<head>"
                + "<meta charset=\"UTF-8\" />"
                + "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\"/>"
                + "<title>Password Reset</title>"
                + "</head>"
                + "<body style=\"margin:0;padding:0;background-color:#ffffff;"
                + "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;\">"

                // ── Outer wrapper ──────────────────────────────────────────────
                + "<table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\""
                + " style=\"background-color:#ffffff;padding:40px 0;\">"
                + "<tr><td align=\"center\">"

                // ── Card ───────────────────────────────────────────────────────
                + "<table role=\"presentation\" width=\"600\" cellspacing=\"0\" cellpadding=\"0\""
                + " style=\"background-color:#ffffff;border-radius:8px;"
                + "box-shadow:0 2px 12px rgba(0,0,0,0.08);max-width:600px;width:100%;\">"

                // ── Header: white bg + red bottom border + charcoal logo ───────
                + "<tr>"
                + "<td style=\"background-color:#ffffff;padding:32px 40px 24px;"
                + "border-bottom:3px solid #B8D332;text-align:left;\">"
                + "<img src=\"cid:bakerTillyLogo\" alt=\"Baker Tilly\""
                + " width=\"180\" style=\"display:block;height:auto;\" />"
                + "</td>"
                + "</tr>"

                // ── Body ───────────────────────────────────────────────────────
                + "<tr>"
                + "<td style=\"padding:40px 40px 32px;\">"
                + "<h1 style=\"margin:0 0 8px;font-size:22px;font-weight:700;"
                + "color:#231f20;letter-spacing:-0.3px;\">Password Reset Request</h1>"
                + "<p style=\"margin:0 0 24px;font-size:14px;color:#6b6b6b;\">TID Asset Management Platform</p>"
                + "<p style=\"margin:0 0 16px;font-size:15px;line-height:1.6;color:#333;\">Hello,</p>"
                + "<p style=\"margin:0 0 16px;font-size:15px;line-height:1.6;color:#333;\">"
                + "We received a request to reset the password for your account. "
                + "Click the button below to set a new password. "
                + "This link will expire in <strong>15&nbsp;minutes</strong>."
                + "</p>"

                // ── CTA Button ─────────────────────────────────────────────────
                + "<table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\""
                + " style=\"margin:32px 0;\">"
                + "<tr>"
                + "<td style=\"border-radius:4px;background-color:#231f20;\">"
                + "<a href=\"" + resetUrl + "\" target=\"_blank\""
                + " style=\"display:inline-block;padding:14px 32px;"
                + "font-size:15px;font-weight:600;color:#ffffff;"
                + "text-decoration:none;letter-spacing:0.3px;\">"
                + "Reset My Password"
                + "</a>"
                + "</td>"
                + "</tr>"
                + "</table>"

                + "<p style=\"margin:0 0 8px;font-size:13px;color:#888;\">Or copy and paste this URL into your browser:</p>"
                + "<p style=\"margin:0 0 24px;font-size:13px;\">"
                + "<a href=\"" + resetUrl + "\" style=\"color:#B8D332;word-break:break-all;\">" + resetUrl + "</a>"
                + "</p>"
                + "<p style=\"margin:0;font-size:13px;line-height:1.6;color:#aaa;\">"
                + "If you did not request a password reset, please disregard this email. "
                + "Your password will remain unchanged."
                + "</p>"
                + "</td>"
                + "</tr>"

                // ── Footer ─────────────────────────────────────────────────────
                + "<tr>"
                + "<td style=\"background-color:#f9f9f9;padding:20px 40px;"
                + "border-top:1px solid #eee;text-align:center;\">"
                + "<p style=\"margin:0;font-size:12px;color:#aaa;line-height:1.5;\">"
                + "&copy; 2025 Baker Tilly &mdash; TID Asset Management Platform<br/>"
                + "This is an automated message. Please do not reply to this email."
                + "</p>"
                + "</td>"
                + "</tr>"

                + "</table>" // /card
                + "</td></tr>"
                + "</table>" // /outer wrapper
                + "</body></html>";
    }
}