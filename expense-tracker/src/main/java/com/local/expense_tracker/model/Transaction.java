package com.local.expense_tracker.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

@Entity //This tells hibernate to "make a table for this"
@Table(name = "transactions")
public class Transaction {
    @Id //Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//auto increment ID
    private long id;
    @NotNull(message = "Amount is Required")
    @Positive(message = "Amount must be positive")
    private double amount;
    @NotBlank(message = "Description can't be empty")
    private String description;
    @PastOrPresent(message = "Date can't be in the future")
    private LocalDate date;
    private String category;

    public Transaction(){} //must have empty constructor for JPA

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
