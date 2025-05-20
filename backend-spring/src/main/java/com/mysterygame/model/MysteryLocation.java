package com.mysterygame.model;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MysteryLocation {
    public String locationName;
    public String type;
    public LocationDetails LocationDetails;
    public String description;
    public List<String> relevantClues;
}
