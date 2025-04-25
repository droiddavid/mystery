package com.mysterygame.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@JsonDeserialize(using = AlibiDeserializer.class)
public class Alibi {
    public String location;
    public String verifiedBy;
    public String time;
}
