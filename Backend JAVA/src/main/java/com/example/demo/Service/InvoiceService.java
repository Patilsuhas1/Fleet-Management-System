package com.example.demo.Service;

import com.example.demo.Entity.BookingHeaderTable;
import com.example.demo.Entity.BookingDetailTable;
import com.example.demo.Repository.BookingRepository;
import com.example.demo.Repository.BookingDetailRepository;
import com.itextpdf.text.Document;
import java.time.LocalDate;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.BaseColor;
import java.time.format.DateTimeFormatter;
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

    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    public void sendInvoiceEmail(Long bookingId, String toEmail) {
        try {
            byte[] pdfBytes = generateInvoicePDF(bookingId);

            jakarta.mail.internet.MimeMessage message = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(
                    message, true);

            helper.setTo(toEmail);
            helper.setSubject("Your Invoice from IndiaDrive - Booking " + bookingId);
            helper.setText("Dear Customer,\n\nPlease find attached your invoice for Booking ID: " + bookingId
                    + ".\n\nThank you for choosing IndiaDrive.\n\nBest Regards,\nIndiaDrive Team");

            org.springframework.core.io.ByteArrayResource attachment = new org.springframework.core.io.ByteArrayResource(
                    pdfBytes);
            helper.addAttachment("Invoice_" + bookingId + ".pdf", attachment);

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            // Don't rethrow to avoid breaking the return flow, just log it
        }
    }

    public byte[] generateInvoicePDF(Long bookingId) {
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

            // Font Definitions
            Font brandFont = new Font(Font.FontFamily.HELVETICA, 24, Font.BOLD, new BaseColor(0, 102, 204));
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.WHITE);
            Font regularFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL);
            Font boldFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD);
            Font smallFont = new Font(Font.FontFamily.HELVETICA, 8, Font.NORMAL, BaseColor.GRAY);

            // Header Section
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);

            PdfPCell brandCell = new PdfPCell(new Paragraph("IndiaDrive", brandFont));
            brandCell.setBorder(PdfPCell.NO_BORDER);
            brandCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            headerTable.addCell(brandCell);

            PdfPCell invoiceTitleCell = new PdfPCell(new Paragraph("TAX INVOICE", titleFont));
            invoiceTitleCell.setBorder(PdfPCell.NO_BORDER);
            invoiceTitleCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            invoiceTitleCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            headerTable.addCell(invoiceTitleCell);

            document.add(headerTable);
            document.add(new Paragraph("\n"));

            // Info Section (Customer & Booking)
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);

            // Customer Info
            PdfPCell customerCell = new PdfPCell();
            customerCell.setBorder(PdfPCell.NO_BORDER);
            customerCell.addElement(new Paragraph("BILL TO:", boldFont));
            customerCell.addElement(new Paragraph(booking.getFirstName() + " " + booking.getLastName(), regularFont));
            customerCell.addElement(new Paragraph(booking.getEmailId(), regularFont));
            customerCell.addElement(new Paragraph(
                    booking.getAddress() != null ? booking.getAddress() : "Address Not Provided", regularFont));
            infoTable.addCell(customerCell);

            // Booking Info
            PdfPCell bookingInfoCell = new PdfPCell();
            bookingInfoCell.setBorder(PdfPCell.NO_BORDER);
            bookingInfoCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            Paragraph bookingLines = new Paragraph();
            bookingLines.setAlignment(Element.ALIGN_RIGHT);
            bookingLines.add(new Paragraph("Booking ID: " + booking.getBookingId(), regularFont));
            bookingLines.add(new Paragraph("Confirmation: " + booking.getConfirmationNumber(), boldFont));
            bookingLines.add(new Paragraph(
                    "Date: " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")), regularFont));
            bookingInfoCell.addElement(bookingLines);
            infoTable.addCell(bookingInfoCell);

            document.add(infoTable);
            document.add(new Paragraph("\n"));

            // Vehicle Section
            Paragraph vehicleHeader = new Paragraph("VEHICLE DETAILS", boldFont);
            vehicleHeader.setSpacingAfter(5f);
            document.add(vehicleHeader);

            PdfPTable vehicleTable = new PdfPTable(3);
            vehicleTable.setWidthPercentage(100);
            vehicleTable.addCell(createCell("Car Model", boldFont));
            vehicleTable.addCell(createCell("Type", boldFont));
            vehicleTable.addCell(createCell("Number Plate", boldFont));

            vehicleTable.addCell(createCell(booking.getBookcar(), regularFont));
            vehicleTable.addCell(createCell(
                    booking.getCarType() != null ? booking.getCarType().getCarTypeName() : "N/A", regularFont));
            vehicleTable.addCell(
                    createCell(booking.getCar() != null ? booking.getCar().getNumberPlate() : "N/A", regularFont));
            document.add(vehicleTable);
            document.add(new Paragraph("\n"));

            // Calculation
            long days = 0;
            LocalDate calcEndDate = booking.getEndDate();
            if (booking.getReturnTime() != null) {
                calcEndDate = booking.getReturnTime().toLocalDate();
            }
            if (booking.getStartDate() != null && calcEndDate != null) {
                days = java.time.temporal.ChronoUnit.DAYS.between(booking.getStartDate(), calcEndDate);
                if (days <= 0)
                    days = 1;
            }

            double dailyRate = booking.getDailyRate() != null ? booking.getDailyRate() : 0.0;
            double rentalSubtotal = days * dailyRate;

            double totalAddonDailyRate = bookingDetailRepository.findByBooking_BookingId(bookingId)
                    .stream()
                    .mapToDouble(BookingDetailTable::getAddonRate)
                    .sum();
            double addonAmt = totalAddonDailyRate * days;
            double totalAmount = rentalSubtotal + addonAmt;

            // Charges Table
            PdfPTable chargesTable = new PdfPTable(4);
            chargesTable.setWidthPercentage(100);
            chargesTable.setWidths(new float[] { 4, 1, 2, 2 });

            chargesTable.addCell(createStyledHeader("Description", headerFont));
            chargesTable.addCell(createStyledHeader("Qty", headerFont));
            chargesTable.addCell(createStyledHeader("Rate", headerFont));
            chargesTable.addCell(createStyledHeader("Amount", headerFont));

            // Base Rental Row
            chargesTable
                    .addCell(createCell("Base Rental - " + booking.getBookcar() + " (" + days + " days)", regularFont));
            chargesTable.addCell(createCell(String.valueOf(days), regularFont));
            chargesTable.addCell(createCell("Rs. " + String.format("%.2f", dailyRate), regularFont));
            chargesTable.addCell(createCell("Rs. " + String.format("%.2f", rentalSubtotal), regularFont));

            // Addons Row
            chargesTable.addCell(createCell("Value Added Services & Add-ons", regularFont));
            chargesTable.addCell(createCell(String.valueOf(days), regularFont));
            chargesTable.addCell(createCell("Rs. " + String.format("%.2f", totalAddonDailyRate), regularFont));
            chargesTable.addCell(createCell("Rs. " + String.format("%.2f", addonAmt), regularFont));

            document.add(chargesTable);

            // Total Section
            PdfPTable totalTable = new PdfPTable(2);
            totalTable.setWidthPercentage(40);
            totalTable.setHorizontalAlignment(Element.ALIGN_RIGHT);

            totalTable.addCell(createCell("Subtotal:", boldFont));
            totalTable.addCell(createCell("Rs. " + String.format("%.2f", totalAmount), regularFont));

            PdfPCell totalLabelCell = new PdfPCell(new Paragraph("TOTAL AMOUNT", boldFont));
            totalLabelCell.setBackgroundColor(new BaseColor(240, 240, 240));
            totalTable.addCell(totalLabelCell);

            PdfPCell totalValCell = new PdfPCell(new Paragraph("Rs. " + String.format("%.2f", totalAmount), boldFont));
            totalValCell.setBackgroundColor(new BaseColor(240, 240, 240));
            totalTable.addCell(totalValCell);

            document.add(totalTable);

            document.add(new Paragraph("\n\n"));
            Paragraph footer = new Paragraph("Thank you for choosing IndiaDrive!\nSafe Travels.", regularFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            Paragraph terms = new Paragraph("Terms: This is a computer generated invoice. No signature is required.",
                    smallFont);
            terms.setAlignment(Element.ALIGN_CENTER);
            terms.setSpacingBefore(20f);
            document.add(terms);

            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF invoice: " + e.getMessage());
        }

        return out.toByteArray();
    }

    private PdfPCell createCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setPadding(8f);
        cell.setBorderColor(BaseColor.LIGHT_GRAY);
        return cell;
    }

    private PdfPCell createStyledHeader(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setBackgroundColor(new BaseColor(0, 102, 204));
        cell.setPadding(8f);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        return cell;
    }
}
