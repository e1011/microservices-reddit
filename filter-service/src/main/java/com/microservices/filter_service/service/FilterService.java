package com.microservices.filter_service.service;

import com.microservices.filter_service.model.Post;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import java.util.Comparator;

@Service
public class FilterService {

    private final RestTemplate restTemplate;

    public FilterService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<Post> filterPosts(String filter, String user) {
        String url = "http://posts:8080/get_posts"; 
        Post[] postsArray = restTemplate.getForObject(url, Post[].class);
        if (postsArray != null) {
            if (postsArray != null) {
                List<Post> posts = Arrays.asList(postsArray);
    
                switch (filter) {
                    case "latest":
                        return posts.stream()
                                .sorted(Comparator.comparing(Post::getDate).reversed())
                                .collect(Collectors.toList());
    
                    case "popular":
                        return posts.stream()
                                .sorted(Comparator.comparing(post -> post.getLikes() + post.getCommentCount(), Comparator.reverseOrder()))
                                .collect(Collectors.toList());
    
                    case "authored":
                        return posts.stream()
                                .filter(post -> post.getUsername().equals(user))
                                .collect(Collectors.toList());
    
                    // maybe edit this one
                    case "recommended":
                        return posts.stream()
                            .sorted(Comparator.comparing(post -> post.getLikes(), Comparator.reverseOrder()))
                            .collect(Collectors.toList());

                    default:
                        return posts;
                }
            }
        }
        return null;
    }
}