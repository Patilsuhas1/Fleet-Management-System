package com.example.demo.Service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class LocaleService {

    public Map<String, Object> getTranslations(String lang) {
        ResourceBundle.clearCache();
        Locale locale = new Locale(lang);
        ResourceBundle bundle;
        try {
            bundle = ResourceBundle.getBundle("messages", locale);
        } catch (MissingResourceException e) {
            // Fallback to English
            bundle = ResourceBundle.getBundle("messages", Locale.ENGLISH);
        }

        Map<String, Object> translations = new HashMap<>();
        Enumeration<String> keys = bundle.getKeys();
        while (keys.hasMoreElements()) {
            String key = keys.nextElement();
            String value = bundle.getString(key);

            // Convert flat keys (home.heroTitle) to nested structure for i18next if needed
            // Or just return flat if frontend can handle it.
            // i18next handles flat keys if configured, but nested is standard.
            buildNestedMap(translations, key, value);
        }
        return translations;
    }

    @SuppressWarnings("unchecked")
    private void buildNestedMap(Map<String, Object> map, String key, String value) {
        String[] parts = key.split("\\.");
        Map<String, Object> current = map;
        for (int i = 0; i < parts.length - 1; i++) {
            Object obj = current.computeIfAbsent(parts[i], k -> new HashMap<String, Object>());
            if (obj instanceof Map) {
                current = (Map<String, Object>) obj;
            }
        }
        current.put(parts[parts.length - 1], value);
    }
}
