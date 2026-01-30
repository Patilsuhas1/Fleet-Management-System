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

            // Colors
            BaseColor primaryBlue = new BaseColor(37, 99, 235); // Modern Blue
            BaseColor lightGray = new BaseColor(249, 250, 251);
            BaseColor textDark = new BaseColor(31, 41, 55);
            BaseColor textMuted = new BaseColor(107, 114, 128);

            // Font Definitions
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 24, Font.BOLD, primaryBlue);
            Font subtitleFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, textMuted);
            Font sectionHeaderFont = new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD, textDark);
            Font bodyFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, textDark);
            Font bodyBoldFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, textDark);
            Font footerFont = new Font(Font.FontFamily.HELVETICA, 8, Font.NORMAL, textMuted);

            // Title Section
            Paragraph mainTitle = new Paragraph("Trip Summary", titleFont);
            mainTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(mainTitle);

            Paragraph reference = new Paragraph("REFERENCE: #" + booking.getBookingId(), subtitleFont);
            reference.setAlignment(Element.ALIGN_CENTER);
            reference.setSpacingAfter(25f);
            document.add(reference);

            // Main Content Layout (Fleet & Hub / Schedule)
            PdfPTable mainGrid = new PdfPTable(2);
            mainGrid.setWidthPercentage(100);
            mainGrid.setSpacingAfter(20f);
            mainGrid.setWidths(new float[] { 1.2f, 1f });

            // Left Column: Fleet & Hub
            PdfPCell leftCol = new PdfPCell();
            leftCol.setBorder(PdfPCell.NO_BORDER);
            leftCol.setPaddingRight(15f);

            // Fleet Box
            leftCol.addElement(new Paragraph("SELECTED FLEET", footerFont));
            String carInfo = booking.getBookcar();
            String carType = booking.getCarType() != null ? booking.getCarType().getCarTypeName() : "Vehicle";
            leftCol.addElement(new Paragraph(carType + " - " + carInfo, bodyBoldFont));
            leftCol.addElement(new Paragraph("Automatic • Petrol • 5 Seats", footerFont)); // Generic placeholders if
                                                                                           // not info
            leftCol.addElement(new Paragraph(" ", bodyFont));

            // Hub Box
            leftCol.addElement(new Paragraph("OPERATION HUB", footerFont));
            if (booking.getPickupHub() != null) {
                leftCol.addElement(new Paragraph(booking.getPickupHub().getHubName(), bodyBoldFont));
                leftCol.addElement(new Paragraph(booking.getPickupHub().getHubAddressAndDetails(), subtitleFont));
            } else {
                leftCol.addElement(new Paragraph("Main Station", bodyBoldFont));
            }
            mainGrid.addCell(leftCol);

            // Right Column: Schedule Box
            PdfPCell scheduleBox = new PdfPCell();
            scheduleBox.setBackgroundColor(lightGray);
            scheduleBox.setPadding(15f);
            scheduleBox.setBorder(PdfPCell.NO_BORDER);

            Paragraph schedTitle = new Paragraph("RENTAL SCHEDULE", footerFont);
            schedTitle.setAlignment(Element.ALIGN_CENTER);
            scheduleBox.addElement(schedTitle);
            scheduleBox.addElement(new Paragraph(" ", bodyFont));

            Paragraph pickupLabel = new Paragraph("Pickup", footerFont);
            pickupLabel.setAlignment(Element.ALIGN_CENTER);
            scheduleBox.addElement(pickupLabel);
            Paragraph pickupDate = new Paragraph(booking.getStartDate() != null
                    ? booking.getStartDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                    : "N/A", bodyBoldFont);
            pickupDate.setAlignment(Element.ALIGN_CENTER);
            scheduleBox.addElement(pickupDate);

            scheduleBox.addElement(new Paragraph(" ", bodyFont));

            Paragraph returnLabel = new Paragraph("Return", footerFont);
            returnLabel.setAlignment(Element.ALIGN_CENTER);
            scheduleBox.addElement(returnLabel);
            LocalDate endDate = booking.getEndDate();
            if (booking.getReturnTime() != null)
                endDate = booking.getReturnTime().toLocalDate();
            Paragraph returnDate = new Paragraph(
                    endDate != null ? endDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : "N/A", bodyBoldFont);
            returnDate.setAlignment(Element.ALIGN_CENTER);
            scheduleBox.addElement(returnDate);

            mainGrid.addCell(scheduleBox);

            document.add(mainGrid);

            // Financial Overview Section
            Paragraph finHeader = new Paragraph("Financial Overview", sectionHeaderFont);
            finHeader.setSpacingBefore(10f);
            finHeader.setSpacingAfter(15f);
            document.add(finHeader);

            // Calculation Logic
            long days = 1;
            if (booking.getStartDate() != null && endDate != null) {
                days = java.time.temporal.ChronoUnit.DAYS.between(booking.getStartDate(), endDate);
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

            // Finance Table
            PdfPTable finTable = new PdfPTable(2);
            finTable.setWidthPercentage(100);
            finTable.setWidths(new float[] { 2, 1 });

            // Duration
            finTable.addCell(createCleanCell("DURATION", footerFont, Element.ALIGN_LEFT));
            finTable.addCell(createCleanCell(days + " Days", bodyBoldFont, Element.ALIGN_RIGHT));

            // Base Rental
            finTable.addCell(
                    createCleanCell("BASE RENTAL (" + days + "D)\n" + String.format("%.2f", dailyRate) + "/day",
                            subtitleFont, Element.ALIGN_LEFT));
            finTable.addCell(
                    createCleanCell("₹" + String.format("%,.0f", rentalSubtotal), bodyBoldFont, Element.ALIGN_RIGHT));

            // Addons
            finTable.addCell(createCleanCell("ADD-ON SERVICES", footerFont, Element.ALIGN_LEFT));
            finTable.addCell(
                    createCleanCell("₹" + String.format("%,.0f", addonAmt), bodyBoldFont, Element.ALIGN_RIGHT));

            // Separator
            PdfPCell separator = new PdfPCell();
            separator.setColspan(2);
            separator.setBorder(PdfPCell.BOTTOM);
            separator.setBorderColor(lightGray);
            separator.setFixedHeight(10f);
            finTable.addCell(separator);

            // Total Amount
            finTable.addCell(createCleanCell("AMOUNT PAID", bodyBoldFont, Element.ALIGN_LEFT));
            PdfPCell totalValCell = createCleanCell("₹" + String.format("%,.0f", totalAmount), titleFont,
                    Element.ALIGN_RIGHT);
            finTable.addCell(totalValCell);

            document.add(finTable);

            // Final Footer
            document.add(new Paragraph("\n\n\n"));
            Paragraph footerNote = new Paragraph("Thank you for choosing IndiaDrive!\nSafe Travels.", bodyFont);
            footerNote.setAlignment(Element.ALIGN_CENTER);
            document.add(footerNote);

            Paragraph computerGen = new Paragraph(
                    "This is a computer generated invoice and does not require a signature.", footerFont);
            computerGen.setAlignment(Element.ALIGN_CENTER);
            computerGen.setSpacingBefore(10f);
            document.add(computerGen);

            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Error generating Trip Summary PDF: " + e.getMessage());
        }

        return out.toByteArray();
    }

    private PdfPCell createCleanCell(String text, Font font, int alignment) {
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setBorder(PdfPCell.NO_BORDER);
        cell.setPaddingTop(8f);
        cell.setPaddingBottom(8f);
        cell.setHorizontalAlignment(alignment);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        return cell;
    }
}
