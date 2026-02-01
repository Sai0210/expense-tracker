package com.local.expense_tracker.service;
import com.local.expense_tracker.exception.ResourceNotFoundException;
import com.local.expense_tracker.model.Transaction;
import com.local.expense_tracker.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service //Tells spring this is the brain
public class TransactionService {
    @Autowired
    private TransactionRepository repository;
    public List<Transaction> getAllTransactions(){
        return repository.findAll(Sort.by(Sort.Direction.DESC, "date"));
    }
    public Transaction saveTransaction(Transaction transaction){
        // business logic
        if(transaction.getDate() == null){
            transaction.setDate(java.time.LocalDate.now());
        }
        return repository.save(transaction);
    }
    public void deleteTransaction(Long id){
        //Check if exists
        if(!repository.existsById(id)) {
            throw new ResourceNotFoundException("Transaction id not found with id" + id);
        }
        repository.deleteById(id);
    }
    public List<Transaction> getTransactionByCategory(String category){
        return repository.findByCategoryIgnoreCase(category);
    }
    public double getAllSpending(){
        return repository.findAll().stream()
                .mapToDouble(Transaction::getAmount)
                .sum();
    }
    public List<Transaction> getTransactionByDateRange(LocalDate start, LocalDate end){
        return repository.findByDateBetween(start, end);
    }

    public List<Transaction> searchByDescription(String keyword){
        return repository.findByDescriptionContainingIgnoreCase(keyword);
    }
    public Map<String, Double> getCategoryBreakdown(){
        return repository.findAll().stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        Transaction::getCategory,
                        java.util.stream.Collectors.summingDouble(Transaction::getAmount)
                ));
    }
    public void importCSV(MultipartFile file){
        try(BufferedReader fileReader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))){
            String line = fileReader.readLine();
            while((line = fileReader.readLine()) != null){
                String[] data = line.split(",");
                Transaction t = new Transaction();
                t.setDate(java.time.LocalDate.parse(data[0]));
                t.setDescription(data[1]);
                t.setCategory(data[2]);
                t.setAmount(Double.parseDouble(data[3]));
                repository.save(t);
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV File" + e.getMessage());
        }
    }

    public Transaction updateTransaction(Long id, Transaction details){
        Transaction transaction = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found"));
        transaction.setAmount(details.getAmount());
        transaction.setDescription(details.getDescription());
        transaction.setDate(details.getDate());
        transaction.setCategory(details.getCategory());
        return  repository.save(transaction);
    }

}
