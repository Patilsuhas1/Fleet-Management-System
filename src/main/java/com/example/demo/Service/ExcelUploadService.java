package com.example.demo.Service;

import com.example.demo.Entity.CarTypeMaster;
import com.example.demo.Repository.CarTypeRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Iterator;
import java.util.Optional;

@Service
public class ExcelUploadService {

    @Autowired
    private CarTypeRepository carTypeRepository;

    public void saveCarTypes(MultipartFile file) {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();

                // Skip header
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                // Assume columns: 0=CarType, 1=Daily, 2=Weekly, 3=Monthly, 4=ImagePath
                // Adjust if needed or make dynamic
                String carTypeName = getCellValue(currentRow.getCell(0));

                if (carTypeName == null || carTypeName.isEmpty())
                    continue;

                double dailyRate = getNumericCellValue(currentRow.getCell(1));
                double weeklyRate = getNumericCellValue(currentRow.getCell(2));
                double monthlyRate = getNumericCellValue(currentRow.getCell(3));
                String imagePath = getCellValue(currentRow.getCell(4));

                Optional<CarTypeMaster> existing = carTypeRepository.findByCarTypeName(carTypeName);
                CarTypeMaster carType;
                if (existing.isPresent()) {
                    carType = existing.get();
                } else {
                    carType = new CarTypeMaster();
                    carType.setCarTypeName(carTypeName);
                }

                carType.setDailyRate(dailyRate);
                carType.setWeeklyRate(weeklyRate);
                carType.setMonthlyRate(monthlyRate);
                if (imagePath != null && !imagePath.isEmpty()) {
                    carType.setImagePath(imagePath);
                }

                carTypeRepository.save(carType);
            }

        } catch (IOException e) {
            throw new RuntimeException("fail to store excel data: " + e.getMessage());
        }
    }

    private String getCellValue(Cell cell) {
        if (cell == null)
            return null;
        if (cell.getCellType() == CellType.STRING)
            return cell.getStringCellValue();
        if (cell.getCellType() == CellType.NUMERIC)
            return String.valueOf(cell.getNumericCellValue());
        return "";
    }

    private double getNumericCellValue(Cell cell) {
        if (cell == null)
            return 0.0;
        if (cell.getCellType() == CellType.NUMERIC)
            return cell.getNumericCellValue();
        if (cell.getCellType() == CellType.STRING) {
            try {
                return Double.parseDouble(cell.getStringCellValue());
            } catch (NumberFormatException e) {
                return 0.0;
            }
        }
        return 0.0;
    }
}
