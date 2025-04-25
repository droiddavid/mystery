package com.mysterygame.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Setting {
    public String name;
    public String description;
    public String locationType;
}
