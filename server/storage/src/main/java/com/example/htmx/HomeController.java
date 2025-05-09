package com.example.htmx;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/time")
    public String timeFragment(@RequestParam(defaultValue = "") String tz, Model model) {
        model.addAttribute("time", java.time.ZonedDateTime.now());
        return "fragments :: currentTime";
    }
}
