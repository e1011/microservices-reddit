package com.microservices.search_service.controller;

import com.microservices.search_service.model.Post;
import com.microservices.search_service.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SearchController {

    @Autowired
    private SearchService searchService;

    @CrossOrigin(origins = "*")
    @GetMapping("/search_posts")
    public List<Post> searchPosts(@RequestParam String sentence) {
        return searchService.searchPosts(sentence);
    }
}
