package com.mysterygame;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mystery")
public class MysteryController {

    @GetMapping("/test")
    public String test() {
        return "Mystery API is working!";
    }
}