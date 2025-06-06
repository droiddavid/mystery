package com.mysterygame;

import com.mysterygame.model.MysteryInput;
import com.mysterygame.model.Mystery;
import com.mysterygame.service.OllamaService;

import org.springframework.beans.factory.annotation.Autowired;
import java.util.logging.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mystery")
public class MysteryController {

    @Autowired
    private OllamaService ollamaService;
    private static final Logger logger = Logger.getLogger(MysteryController.class.getName());


    @PostMapping("/generate")
    public Mystery generateMystery(@RequestBody MysteryInput input) {
        return ollamaService.generateMysteryFromLLM(input);
    }

    @PostMapping("/create")
    public Mystery createMystery(@RequestBody Mystery input) {
        logger.log(Level.INFO, "Entering /create with input {0}", input);
        
        try {
            if (input == null || input.toString().isEmpty()) {
                logger.log(Level.WARNING, "Input is null or empty.");
                throw new IllegalArgumentException("Input cannot be null or empty.");
            }
            logger.log(Level.INFO, "Processing successful, result: {0}", "Successfully processed: " + input.toString().toUpperCase());
            return input;
        } catch (IllegalArgumentException e) {
            logger.log(Level.SEVERE, "Error processing input: " + input, e);
            throw e; // Re-throw the exception if needed
        } finally {
            logger.log(Level.INFO, "Exiting /create api call.");
        }
    }

}
