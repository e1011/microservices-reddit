package com.microservices.filter_service.controller;

import com.microservices.filter_service.model.Post;
import com.microservices.filter_service.service.FilterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class FilterController {

    @Autowired
    private FilterService filterService;

    @CrossOrigin(origins = "*")
    @GetMapping("/filter_posts")
    public List<Post> filterPosts(@RequestParam String filter, @RequestParam String user) {
        return filterService.filterPosts(filter, user);
    }
}
