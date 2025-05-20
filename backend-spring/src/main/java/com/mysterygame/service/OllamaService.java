package com.mysterygame.service;

// import ch.qos.logback.classic.Logger;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mysterygame.model.Mystery;
import com.mysterygame.model.MysteryInput;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class OllamaService {

    private static final Logger log = LoggerFactory.getLogger(OllamaService.class);
    
    public Mystery generateMysteryFromLLM(MysteryInput input) {
        String prompt = buildPrompt(input);

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> request = Map.of(
                "model", "mistral",
                "prompt", prompt,
                "stream", false
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity("http://localhost:11434/api/generate", entity, Map.class);

        // LLM response is inside "response.body.output"
        String rawOutput = (String) response.getBody().get("response");

        // ✅ First: check for basic JSON validity
        if (!isValidJson(rawOutput)) {
            throw new RuntimeException("The LLM response is not valid JSON. Check logs for details.");
        }

        try {
            // Attempt to parse the raw output as a Mystery object
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(rawOutput, Mystery.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse LLM response into Mystery: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(MysteryInput input) {
        return String.format(
                """
                Generate a %s-level detective mystery in JSON format.
                Theme: %s
                Setting: %s
                Characters: %s

                The JSON response should include all of the following fields, fully populated:

                - title
                - summary
                - setting (with name, description, locationType)
                - difficulty
                - characters: each character must be a complete object with the following fields:
                    - `name` (string)
                    - `role` (string — e.g., suspect, witness, etc.)
                    - `secrets` (array of strings — even if empty)
                    - `motive` (string)
                    - `alibi` (object with `location`, `time`, and `verifiedBy`) — even if they deny it)
                    - `knowledge` (string)
                    - `connections` (array of strings — names of other characters)
                    - `personality` (object with a `description` string field, e.g. `{ "description": "Rich, proud, passionate about antiques." }`)
                - clues (with string id, description, foundAt, discoveredBy, relevance)
                - timeline (time, description, involvedCharacters)
                - locations (name, type, description, details, relevantClues — must be an array of **string clue IDs**, e.g., ["c1", "c2"])
                - solution (with suspect, method, motive, reveal, discoveredBy)

                Important rules:
                1. **DO NOT return null for any field.** If a value is unknown or uncertain, **make a best guess** or use `"Unknown"`, `"Undisclosed"`, or `"Not yet discovered"`.
                2. The `secrets` field must always be a proper JSON array of strings, even if it's empty. Example: `"secrets": []` or `"secrets": ["None"]`.
                3. The `relevantClues` field must be an array of **clue IDs as strings**, e.g., `"relevantClues": ["c1", "c2"]`. Do not use numbers or embed full clue objects.
                4. The `clues` field must assign **unique string ids** to each clue, such as `"id": "c1"`, `"id": "c2"`, etc.
                5. Populate all nested fields for every character, clue, and location. Every object must contain complete, non-null data.
                6. Return only a valid, parseable JSON object. No markdown, no prose, no extra explanation.
                7. Make sure the JSON is fully structured and game-ready, with no empty or null fields.
                8. Include optional fields like `details` in locations, and `personality`, `connections`, and `knowledge` in characters for AI-powered interactions.
                9. Ensure the JSON is strictly valid and formatted properly with commas between all fields.
                10. The `solution` field must be a fully populated JSON object (not a string) with suspect, method, motive, reveal, and discoveredBy fields.


                Imagine this mystery will be used in an immersive game. Every field must be strictly valid, usable by a game engine, and compatible with Java-based deserialization.


                
                """,
                input.difficulty,
                input.theme,
                input.setting,
                String.join(", ", input.characters)
        );
    }

    private boolean isValidJson(String json) {
        try {
            final ObjectMapper mapper = new ObjectMapper();
            mapper.readTree(json);  // throws on invalid structure
            return true;
        } catch (IOException e) {
            
            log.error("Malformed JSON: " + json, e);
            return false;
        }
    }

}
