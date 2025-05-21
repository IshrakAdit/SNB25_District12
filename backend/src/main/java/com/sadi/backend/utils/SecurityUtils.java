package com.sadi.backend.utils;

import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {
    public static String getName(){
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
