package com.example.demo.Service;

import com.example.demo.Entity.CarMaster;
import com.example.demo.Entity.CarMaster.AvailabilityStatus;
import com.example.demo.Entity.CarTypeMaster;
import com.example.demo.Entity.HubMaster;
import com.example.demo.Repository.CarRepository;
import com.example.demo.Repository.CarTypeMasterRepository;
import com.example.demo.Repository.HubRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@Service
public class ExcelUploadService {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private CarTypeMasterRepository carTypeRepository;

    @Autowired
    private HubRepository hubRepository;

    // --- CAR INVENTORY UPLOAD ---
    public void save(MultipartFile file) {
        try {
            List<CarMaster> cars = parseExcelFile(file.getInputStream());
            carRepository.saveAll(cars);
        } catch (IOException e) {
            throw new RuntimeException("fail to store excel data: " + e.getMessage());
        }
    }

    public List<CarMaster> parseExcelFile(InputStream is) {
        try {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheet("Cars");
            if (sheet == null)
                sheet = workbook.getSheetAt(0);

            Iterator<Row> rows = sheet.iterator();
            List<CarMaster> cars = new ArrayList<>();
            int rowNumber = 0;

            while (rows.hasNext()) {
                Row currentRow = rows.next();
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                } // Skip header

                try {
                    CarMaster car = new CarMaster();
                    // Cell 0: Car Name
                    Cell nameCell = currentRow.getCell(0);
                    if (nameCell != null)
                        car.setCarName(getCellValueAsString(nameCell));

                    // Cell 1: Number Plate
                    Cell plateCell = currentRow.getCell(1);
                    if (plateCell != null)
                        car.setNumberPlate(getCellValueAsString(plateCell));

                    // Cell 2: Car Type ID
                    Cell typeCell = currentRow.getCell(2);
                    if (typeCell != null) {
                        long typeId = (long) typeCell.getNumericCellValue();
                        Optional<CarTypeMaster> typeOpt = carTypeRepository.findById(typeId);
                        typeOpt.ifPresent(car::setCarType);
                    }

                    // Cell 3: Hub ID
                    Cell hubCell = currentRow.getCell(3);
                    if (hubCell != null) {
                        int hubId = (int) hubCell.getNumericCellValue();
                        Optional<HubMaster> hubOpt = hubRepository.findById(hubId);
                        hubOpt.ifPresent(car::setHub);
                    }

                    // Cell 4: Mileage
                    Cell mileageCell = currentRow.getCell(4);
                    if (mileageCell != null)
                        car.setMileage(mileageCell.getNumericCellValue());

                    // Cell 5: Status
                    Cell statusCell = currentRow.getCell(5);
                    if (statusCell != null)
                        car.setStatus(getCellValueAsString(statusCell));

                    car.setIsAvailable(AvailabilityStatus.Y);

                    if (car.getCarName() != null && car.getNumberPlate() != null) {
                        cars.add(car);
                    }
                } catch (Exception e) {
                    System.err.println("Error parsing car row " + rowNumber + ": " + e.getMessage());
                }
                rowNumber++;
            }
            workbook.close();
            return cars;
        } catch (IOException e) {
            throw new RuntimeException("fail to parse Excel file: " + e.getMessage());
        }
    }

    // --- CAR TYPE (RATES) UPLOAD ---
    public void saveCarTypes(MultipartFile file) {
        try {
            List<CarTypeMaster> types = parseCarTypeExcel(file.getInputStream());
            carTypeRepository.saveAll(types);
        } catch (IOException e) {
            throw new RuntimeException("fail to store rates excel data: " + e.getMessage());
        }
    }

    public List<CarTypeMaster> parseCarTypeExcel(InputStream is) {
        try {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheet("Rates");
            if (sheet == null)
                sheet = workbook.getSheetAt(0);

            Iterator<Row> rows = sheet.iterator();
            List<CarTypeMaster> types = new ArrayList<>();
            int rowNumber = 0;

            while (rows.hasNext()) {
                Row currentRow = rows.next();
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                try {
                    // Cell 0: Name, 1: Daily, 2: Weekly, 3: Monthly, 4: ImagePath
                    Cell nameCell = currentRow.getCell(0);
                    if (nameCell == null)
                        continue;

                    String typeName = getCellValueAsString(nameCell);
                    if (typeName == null || typeName.trim().isEmpty())
                        continue;

                    // Save or Update logic: Check if exists
                    Optional<CarTypeMaster> existingType = carTypeRepository.findByCarTypeName(typeName);
                    CarTypeMaster type = existingType.orElse(new CarTypeMaster());

                    type.setCarTypeName(typeName);

                    Cell dailyCell = currentRow.getCell(1);
                    if (dailyCell != null)
                        type.setDailyRate(dailyCell.getNumericCellValue());

                    Cell weeklyCell = currentRow.getCell(2);
                    if (weeklyCell != null)
                        type.setWeeklyRate(weeklyCell.getNumericCellValue());

                    Cell monthlyCell = currentRow.getCell(3);
                    if (monthlyCell != null)
                        type.setMonthlyRate(monthlyCell.getNumericCellValue());

                    Cell imgCell = currentRow.getCell(4);
                    if (imgCell != null)
                        type.setImagePath(getCellValueAsString(imgCell));

                    types.add(type);
                } catch (Exception e) {
                    System.err.println("Error parsing rates row " + rowNumber + ": " + e.getMessage());
                }
                rowNumber++;
            }
            workbook.close();
            return types;
        } catch (IOException e) {
            throw new RuntimeException("fail to parse Rates Excel: " + e.getMessage());
        }
    }

    private String getCellValueAsString(Cell cell) {
        if (cell.getCellType() == CellType.STRING) {
            return cell.getStringCellValue();
        } else if (cell.getCellType() == CellType.NUMERIC) {
            return String.valueOf((int) cell.getNumericCellValue());
        } else {
            return "";
        }
    }
}
