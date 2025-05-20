package com.mysterygame.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Clue {
    public String description;
    public String location;
    public String discoveredBy;
    public String relevance;
    public String id;
    public String foundAt;
    public String reveals;
}
