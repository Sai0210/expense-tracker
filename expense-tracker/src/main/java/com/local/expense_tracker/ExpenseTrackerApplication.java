package com.local.expense_tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ExpenseTrackerApplication {

	public static void main(String[] args) {

		//System.out.println("Working Directory = " + System.getProperty("user.dir"));
		SpringApplication.run(ExpenseTrackerApplication.class, args);
	}

}
