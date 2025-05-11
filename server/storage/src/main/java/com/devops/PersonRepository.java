package com.devops;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devops.Person;

public interface PersonRepository extends JpaRepository<Person, Long> {
}
