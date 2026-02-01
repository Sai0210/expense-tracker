package com.local.expense_tracker.controller;
import java.time.LocalDate;
import  java.util.List;
import java.util.Map;

import com.local.expense_tracker.model.Transaction;
import com.local.expense_tracker.repository.TransactionRepository;
import com.local.expense_tracker.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000") // This allows future React application to interact with Backend
public class TransactionController {
    @Autowired
    private TransactionService service;
    @GetMapping
    public List<Transaction> getAll(){
        return service.getAllTransactions();
    }
    @GetMapping("/filter")
    public List<Transaction> getByCategory(@RequestParam String category){
        return service.getTransactionByCategory(category);
    }
    @PostMapping
    public Transaction create(@Valid @RequestBody Transaction transaction){
        return service.saveTransaction(transaction);
    }
    @GetMapping("/total")
    public String getTotal(){
        return "" + service.getAllSpending();
    }
    @DeleteMapping({"/{id}"})
    public void delete(@PathVariable Long id){
        service.deleteTransaction(id);
    }
    @GetMapping("/range")
    public List<Transaction> getByRange(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end
            )
    {
        return service.getTransactionByDateRange(start, end);
    }
    @GetMapping("/search")
    public List<Transaction> getByDescription(@RequestParam String keyword){
        return service.searchByDescription(keyword);
    }
    @GetMapping("/breakdown")
    public Map<String, Double> getBreakdown(){
        return service.getCategoryBreakdown();
    }
    @PostMapping("/upload")
    public void uploadFile(@RequestParam("file") MultipartFile file){
        service.importCSV(file);
    }

    @PutMapping("/{id}")
    public Transaction update(@PathVariable Long id, @Valid @RequestBody Transaction transaction){
        return service.updateTransaction(id,transaction);
    }
}
