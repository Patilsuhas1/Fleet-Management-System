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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

            // --- FONTS & COLORS ---
            BaseColor colorPrimary = new BaseColor(63, 81, 181); // Indigo

            BaseColor colorText = new BaseColor(50, 50, 50); // Dark Gray

            Font fontLogo = new Font(Font.FontFamily.HELVETICA, 26, Font.BOLD, colorPrimary);
            Font fontHeader = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.WHITE);
            Font fontLabel = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, colorText);
            Font fontValue = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, colorText);

            Font fontSmall = new Font(Font.FontFamily.HELVETICA, 8, Font.NORMAL, BaseColor.GRAY);

            // --- HEADER SECTION ---
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[] { 1, 1 });

            // Company Logo/Name
            PdfPCell companyCell = new PdfPCell();
            companyCell.setBorder(PdfPCell.NO_BORDER);
            companyCell.addElement(new Paragraph("FLEEMAN", fontLogo));
            companyCell.addElement(new Paragraph("123, Innovation Dr.", fontValue));
            companyCell.addElement(new Paragraph("Tech City, TC 560001", fontValue));
            companyCell.addElement(new Paragraph("support@fleeman.com", fontValue));
            headerTable.addCell(companyCell);

            // Invoice Title & Details
            PdfPCell invoiceDetailsCell = new PdfPCell();
            invoiceDetailsCell.setBorder(PdfPCell.NO_BORDER);
            invoiceDetailsCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            Paragraph invoiceTitle = new Paragraph("INVOICE",
                    new Font(Font.FontFamily.HELVETICA, 24, Font.BOLD, BaseColor.LIGHT_GRAY));
            invoiceTitle.setAlignment(Element.ALIGN_RIGHT);
            invoiceDetailsCell.addElement(invoiceTitle);

            PdfPTable detailsTable = new PdfPTable(2);
            detailsTable.setWidthPercentage(100);
            detailsTable.setHorizontalAlignment(Element.ALIGN_RIGHT);

            addDetailRow(detailsTable, "Invoice #:", "INV-" + booking.getBookingId(), fontLabel, fontValue);
            addDetailRow(detailsTable, "Date:", LocalDate.now().toString(), fontLabel, fontValue);
            addDetailRow(detailsTable, "Booking Ref:",
                    booking.getConfirmationNumber() != null ? booking.getConfirmationNumber() : "N/A", fontLabel,
                    fontValue);

            invoiceDetailsCell.addElement(detailsTable);
            headerTable.addCell(invoiceDetailsCell);

            document.add(headerTable);
            document.add(new Paragraph("\n")); // Spacer

            // --- BILL TO & TRIP DETAILS ---
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setWidths(new float[] { 1, 1 });
            infoTable.setSpacingAfter(20f);

            // Bill To
            PdfPCell billToCell = new PdfPCell();
            billToCell.setBorder(PdfPCell.NO_BORDER);
            billToCell.addElement(new Paragraph("BILL TO", fontSmall));
            billToCell.addElement(new Paragraph(booking.getFirstName() + " " + booking.getLastName(),
                    new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, colorText)));
            billToCell.addElement(new Paragraph(booking.getAddress() + ", " + booking.getState(), fontValue));
            billToCell.addElement(new Paragraph(booking.getEmailId(), fontValue));
            infoTable.addCell(billToCell);

            // Trip Details
            PdfPCell tripCell = new PdfPCell();
            tripCell.setBorder(PdfPCell.NO_BORDER);
            tripCell.addElement(new Paragraph("TRIP DETAILS", fontSmall));
            String carName = booking.getBookcar() != null ? booking.getBookcar()
                    : (booking.getCarType() != null ? booking.getCarType().getCarTypeName() : "Vehicle");
            tripCell.addElement(new Paragraph("Vehicle: " + carName, fontValue));

            String pickup = booking.getStartDate() != null ? booking.getStartDate().toString() : "N/A";
            String dropoff = booking.getEndDate() != null ? booking.getEndDate().toString() : "N/A";

            if (booking.getPickupHub() != null)
                pickup += " (" + booking.getPickupHub().getHubName() + ")";
            tripCell.addElement(new Paragraph("Pickup: " + pickup, fontValue));
            tripCell.addElement(new Paragraph("Return: " + dropoff, fontValue));
            infoTable.addCell(tripCell);

            document.add(infoTable);

            // --- INVOICE ITEMS TABLE ---
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[] { 4, 1, 2, 2 }); // Description, Qty, Rate, Total
            table.setHeaderRows(1);

            // Table Header
            addTableHeader(table, "DESCRIPTION", fontHeader, colorPrimary);
            addTableHeader(table, "DAYS", fontHeader, colorPrimary);
            addTableHeader(table, "RATE", fontHeader, colorPrimary);
            addTableHeader(table, "AMOUNT", fontHeader, colorPrimary);

            // Calculations
            long days = 1;
            if (booking.getStartDate() != null && booking.getEndDate() != null) {
                days = java.time.temporal.ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate());
                if (days == 0)
                    days = 1; // Minimum 1 day
                else
                    days += 1; // Inclusive (usually rental logic)
            }
            double dailyRate = booking.getDailyRate() != null ? booking.getDailyRate() : 0.0;
            double rentalTotal = days * dailyRate;

            // Row 1: Vehicle Rental
            addTableRow(table, "Vehicle Rental Charges - " + carName, String.valueOf(days), formatCurrency(dailyRate),
                    formatCurrency(rentalTotal), fontValue);

            // Add-ons
            double addonsTotal = 0.0;
            var addons = bookingDetailRepository.findByBooking_BookingId(bookingId);
            for (BookingDetailTable addon : addons) {
                double addonRate = addon.getAddonRate();
                double lineTotal = addonRate * days; // Assuming per-day addon rate
                addonsTotal += lineTotal;

                String addonName = "Add-on Service"; // Generic name since details seem to be in detail table

                addTableRow(table, addonName, String.valueOf(days), formatCurrency(addonRate),
                        formatCurrency(lineTotal), fontValue);
            }

            // Totals
            double subtotal = rentalTotal + addonsTotal;
            double taxRate = 0.18;
            double taxAmount = subtotal * taxRate;
            double grandTotal = subtotal + taxAmount;

            document.add(table);

            // --- TOTALS SECTION ---
            PdfPTable totalTable = new PdfPTable(2);
            totalTable.setWidthPercentage(100);
            totalTable.setWidths(new float[] { 3, 1 });
            totalTable.setSpacingBefore(10f);

            addTotalRow(totalTable, "Subtotal:", formatCurrency(subtotal), fontLabel, fontValue);
            addTotalRow(totalTable, "Tax (18% GST):", formatCurrency(taxAmount), fontLabel, fontValue);
            addTotalRow(totalTable, "GRAND TOTAL:", formatCurrency(grandTotal),
                    new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, colorPrimary),
                    new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, colorPrimary));

            document.add(totalTable);

            // --- FOOTER ---
            document.add(new Paragraph("\n\n"));
            Paragraph footer = new Paragraph("Thank you for your business!", fontLabel);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            Paragraph terms = new Paragraph(
                    "Terms & Conditions: Payment is due within 15 days. \nFor support, contact support@fleeman.com.",
                    fontSmall);
            terms.setAlignment(Element.ALIGN_CENTER);
            document.add(terms);

            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Error generating Invoice PDF: " + e.getMessage());
        }

        return out.toByteArray();
    }

    private void addDetailRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Paragraph(label, labelFont));
        labelCell.setBorder(PdfPCell.NO_BORDER);
        labelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Paragraph(value, valueFont));
        valueCell.setBorder(PdfPCell.NO_BORDER);
        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(valueCell);
    }

    private void addTableHeader(PdfPTable table, String headerTitle, Font font, BaseColor backgroundColor) {
        PdfPCell header = new PdfPCell();
        header.setBackgroundColor(backgroundColor);
        header.setBorderWidth(1);
        header.setPadding(8);
        header.setPhrase(new Paragraph(headerTitle, font));
        table.addCell(header);
    }

    private void addTableRow(PdfPTable table, String desc, String qty, String rate, String total, Font font) {
        PdfPCell cellDesc = new PdfPCell(new Paragraph(desc, font));
        cellDesc.setPadding(6);
        table.addCell(cellDesc);

        PdfPCell cellQty = new PdfPCell(new Paragraph(qty, font));
        cellQty.setPadding(6);
        cellQty.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cellQty);

        PdfPCell cellRate = new PdfPCell(new Paragraph(rate, font));
        cellRate.setPadding(6);
        cellRate.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(cellRate);

        PdfPCell cellTotal = new PdfPCell(new Paragraph(total, font));
        cellTotal.setPadding(6);
        cellTotal.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(cellTotal);
    }

    private void addTotalRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Paragraph(label, labelFont));
        labelCell.setBorder(PdfPCell.NO_BORDER);
        labelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        labelCell.setPaddingRight(10);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Paragraph(value, valueFont));
        valueCell.setBorder(PdfPCell.BOTTOM);
        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(valueCell);
    }

    private String formatCurrency(double amount) {
        return String.format("Rs %.2f", amount);
    }
}
