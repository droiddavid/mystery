package com.mysterygame.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TimelineEvent {
    public String time;
    public String description;
    public String involvedCharacter;
}
