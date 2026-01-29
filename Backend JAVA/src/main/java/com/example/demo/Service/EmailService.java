package com.example.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String toEmail, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Password Reset Request - IndiaDrive");

            String resetLink = "http://localhost:3000/reset-password?token=" + token;

            String htmlContent = "<h3>IndiaDrive Password Reset</h3>" +
                    "<p>You requested a password reset. Click the link below to set a new password:</p>" +
                    "<a href=\"" + resetLink + "\">Reset Password</a>" +
                    "<p>This link will expire in 1 hour.</p>" +
                    "<p>If you didn't request this, please ignore this email.</p>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email: " + e.getMessage());
        }
    }
}
