package com.example.demo.Service;

import com.example.demo.Repository.HubRepository;
import com.example.demo.Repository.projection.HubInfoProjection;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class HubService {

    @Autowired
    private HubRepository hubRepository;

    public List<HubInfoProjection> getAllHubByCityIdAndStateId(String cityName, String stateName) {
        // log.info(" Into [HubService] [getAllHubByCityIdAndStateId] :{} {} ",cityId
        // ,stateId);
        List<HubInfoProjection> hubList = hubRepository.getHubListCityIdAndStateId(cityName, stateName);
        return hubList;
    }

    public List<HubInfoProjection> searchHubs(String query) {
        return hubRepository.searchHubs(query);
    }

}
