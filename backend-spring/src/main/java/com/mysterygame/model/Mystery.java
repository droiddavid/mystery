package com.mysterygame.model;

import java.util.List;

public class Mystery {
    public String title;
    public Setting setting;
    public String difficulty;
    public String summary;
    public List<Character> characters;
    public List<Clue> clues;
    public List<TimelineEvent> timeline;
    public List<MysteryLocation> locations;
    public Solution solution;
}
