package com.devgol53.rent_website.dtos.branch;

import com.devgol53.rent_website.entities.Branch;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
@Getter
public class BranchGetDTO {
    private long id;
    private String address;
    private String city;

    public BranchGetDTO(Branch branch){
        this.id = branch.getId();
        this.address = branch.getAddress();
        this.city = branch.getCity();
    }
}
