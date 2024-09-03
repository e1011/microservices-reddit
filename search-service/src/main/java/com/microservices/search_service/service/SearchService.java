package com.microservices.search_service.service;

import com.microservices.search_service.model.Post;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService {

    private final RestTemplate restTemplate;

    public SearchService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<Post> searchPosts(String sentence) {
        String url = "http://posts:8080/get_posts"; 
        Post[] postsArray = restTemplate.getForObject(url, Post[].class);
        if (postsArray != null) {
            List<Post> posts = Arrays.asList(postsArray);
            List<String> keywords = Arrays.asList(sentence.split("\\s+"));

            return posts.stream()
                    .filter(post -> keywords.stream()
                            .anyMatch(keyword -> post.getTitle().toLowerCase().contains(keyword.toLowerCase()) ||
                                                 post.getContent().toLowerCase().contains(keyword.toLowerCase())))
                    .collect(Collectors.toList());
        }
        return null;
    }
}