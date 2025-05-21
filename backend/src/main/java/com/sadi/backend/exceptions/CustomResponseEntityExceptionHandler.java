package com.sadi.backend.exceptions;

import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.net.URI;
import java.util.Objects;

@RestControllerAdvice
@Slf4j
public class CustomResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  @NonNull HttpHeaders headers,
                                                                  HttpStatusCode status,
                                                                  WebRequest request) {

        FieldError firstError = Objects.requireNonNull(ex.getFieldError());
        String message = String.format("Total error count: %d| field: %s | description: %s", ex.getFieldErrorCount(),
                firstError.getField(),
                firstError.getDefaultMessage());

        ProblemDetail body = ex.getBody();
        body.setDetail(message);
        body.setTitle("Validation error");
        body.setStatus(status.value());
        body.setInstance(URI.create(request.getDescription(false)));

        return this.handleExceptionInternal(ex, body, headers, status, request);
    }

}