package com.mysterygame.model;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.*;
import com.mysterygame.model.Alibi;

import java.io.IOException;

public class AlibiDeserializer extends JsonDeserializer<Alibi> {
    @Override
    public Alibi deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        JsonNode node = p.readValueAsTree();

        if (node.isTextual()) {
            // Fallback: store the entire string in `description`
            Alibi alibi = new Alibi();
            alibi.location = "Unknown";
            alibi.time = "Unknown";
            alibi.verifiedBy = "Unknown";
            return alibi;
        } else if (node.isObject()) {
            ObjectMapper mapper = (ObjectMapper) p.getCodec();
            return mapper.treeToValue(node, Alibi.class);
        } else {
            throw new JsonMappingException(p, "Unsupported alibi format");
        }
    }
}
