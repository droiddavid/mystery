package com.mysterygame.service;

import ch.qos.logback.classic.Logger;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mysterygame.model.Mystery;
import com.mysterygame.model.MysteryInput;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Map;

@Service
public class OllamaService {
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
                - characters (with name, role, personality, knowledge, secrets, connections, motive, alibi — even if they deny it)
                - clues (id, description, foundAt, discoveredBy, relevance)
                - timeline (time, description, involvedCharacters)
                - locations (name, type, description, relevantClues)
                - solution (with suspect, method, motive, reveal, discoveredBy)


                Important rules:
                1. **DO NOT return null for any field.** If a value is unknown or uncertain, **make a best guess** or use `"Unknown"`, `"Undisclosed"`, or `"Not yet discovered"`.
                2. The `secrets` field must always be a proper JSON array of strings, even if it's empty. Example: `"secrets": []` or `"secrets": ["None"]`
                3. Populate all nested fields for every character, clue, and location. Every object should have complete data.
                4. Return only a valid, parseable JSON object. No markdown, no prose.
                5. Make sure the JSON is fully structured and game-ready, with no empty fields.
                6. Also populate optional fields like details in locations, and add personality, connections, and knowledge fields for each character for use in AI-powered interactions.
                7. Ensure the JSON is strictly valid and properly formatted with commas between all fields.
                8. Respond ONLY with valid, minified JSON that passes strict parsing without nulls or formatting errors.
                9. The `solution` field must be a complete JSON object, not a string.



                Imagine this mystery will be used in an immersive game. Every field must be usable by a game engine with no missing data.

                
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
            Logger log = null;
            log.error("Malformed JSON: " + json, e);
            return false;
        }
    }

}



















