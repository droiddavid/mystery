package com.mysterygame.model;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.TreeNode;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.IOException;

public class AlibiDeserializer extends JsonDeserializer<Alibi> {

    @Override
    public Alibi deserialize(JsonParser parser, DeserializationContext ctxt) throws IOException {
        ObjectNode node = parser.getCodec().readTree(parser);

        Alibi alibi = new Alibi();
        if (node.has("location")) {
            alibi.location = node.get("location").asText();
        }
        if (node.has("time")) {
            alibi.time = node.get("time").asText();
        }
        if (node.has("verifiedBy")) {
            alibi.verifiedBy = node.get("verifiedBy").asText();
        }

        return alibi;
    }
}
