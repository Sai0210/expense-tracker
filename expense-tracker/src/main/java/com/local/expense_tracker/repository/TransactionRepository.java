package com.local.expense_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.local.expense_tracker.model.Transaction;

import java.time.LocalDate;
import java.util.List;


@Repository

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // Spring sees this name and automatically writes:
    // "SELECT * FROM transactions WHERE category = ?"
    List<Transaction> findByCategoryIgnoreCase(String category);
    // Magic Method: Spring writes the SQL "WHERE date BETWEEN ? AND ?"
    List<Transaction> findByDateBetween(LocalDate startDate, LocalDate endDate);
    // This tells SQL "WHERE description LIKE %Keyword% "
    List<Transaction> findByDescriptionContainingIgnoreCase(String keyword);
}
