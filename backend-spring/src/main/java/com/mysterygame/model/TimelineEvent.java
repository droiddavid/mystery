package com.mysterygame.model;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TimelineEvent {
    public String time;
    public String description;
    public String involvedCharacter;
    public List<String> involvedCharacters;

}
