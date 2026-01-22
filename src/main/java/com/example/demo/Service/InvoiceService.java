package com.example.demo.Service;

import com.example.demo.Entity.BookingHeaderTable;
import com.example.demo.Repository.BookingRepository;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Optional;

@Service
public class InvoiceService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private org.springframework.mail.javamail.JavaMailSender mailSender;

    public void sendInvoiceEmail(Long bookingId, String toEmail) {
        try {
            ByteArrayInputStream pdfStream = generateInvoicePDF(bookingId);

            jakarta.mail.internet.MimeMessage message = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(
                    message, true);

            helper.setTo(toEmail);
            helper.setSubject("Your Invoice from IndiaDrive - Booking " + bookingId);
            helper.setText("Dear Customer,\n\nPlease find attached your invoice for Booking ID: " + bookingId
                    + ".\n\nThank you for choosing IndiaDrive.\n\nBest Regards,\nIndiaDrive Team");

            org.springframework.core.io.InputStreamSource attachment = new org.springframework.core.io.InputStreamResource(
                    pdfStream);
            helper.addAttachment("Invoice_" + bookingId + ".pdf", attachment);

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            // Don't rethrow to avoid breaking the return flow, just log it
        }
    }

    public ByteArrayInputStream generateInvoicePDF(Long bookingId) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            Optional<BookingHeaderTable> bookingOpt = bookingRepository.findById(bookingId);
            if (bookingOpt.isEmpty()) {
                throw new RuntimeException("Booking not found with ID: " + bookingId);
            }
            BookingHeaderTable booking = bookingOpt.get();

            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Font regularFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);
            Font boldFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);

            // Title
            Paragraph title = new Paragraph("INVOICE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("\n"));

            // Booking Details
            document.add(new Paragraph("Booking ID: " + booking.getBookingId(), regularFont));
            document.add(new Paragraph("Confirmation Number: " + booking.getConfirmationNumber(), boldFont));
            document.add(new Paragraph("Date: " + booking.getBookingDate(), regularFont));
            document.add(new Paragraph("\n"));

            // Customer Details
            document.add(new Paragraph("Customer Details:", boldFont));
            document.add(new Paragraph("Name: " + booking.getFirstName() + " " + booking.getLastName(), regularFont));
            document.add(new Paragraph("Email: " + booking.getEmailId(), regularFont));
            document.add(new Paragraph("Address: " + booking.getAddress(), regularFont));
            document.add(new Paragraph("\n"));

            // Car Details
            document.add(new Paragraph("Car Details:", boldFont));
            document.add(new Paragraph("Car Name: " + booking.getBookcar(), regularFont));
            document.add(new Paragraph("\n"));

            // Rental Details
            document.add(new Paragraph("Rental Period:", boldFont));
            document.add(new Paragraph(
                    "Pickup Hub: " + (booking.getPickupHub() != null ? booking.getPickupHub().getHubName() : "N/A"),
                    regularFont));
            document.add(new Paragraph(
                    "Return Hub: " + (booking.getReturnHub() != null ? booking.getReturnHub().getHubName() : "N/A"),
                    regularFont));
            document.add(new Paragraph("Start Date: " + booking.getStartDate(), regularFont));
            document.add(new Paragraph("End Date: " + booking.getEndDate(), regularFont));
            document.add(new Paragraph("\n"));

            // Note: Total Amount calculation logic can be added here if available in entity
            document.add(new Paragraph("TOTAL AMOUNT: $ (Calculation logic pending)", boldFont));

            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF invoice: " + e.getMessage());
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
