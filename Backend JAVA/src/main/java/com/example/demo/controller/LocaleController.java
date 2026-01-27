package com.example.demo.controller;

import com.example.demo.Service.LocaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/locales")
@CrossOrigin(origins = "http://localhost:3000")
public class LocaleController {

    @Autowired
    private LocaleService localeService;

    @GetMapping("/{lang}")
    public Map<String, Object> getTranslations(@PathVariable String lang) {
        return localeService.getTranslations(lang);
    }
}
