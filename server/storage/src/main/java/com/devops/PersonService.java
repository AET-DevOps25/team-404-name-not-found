package com.devops;

import org.springframework.stereotype.Service;

import com.devops.Person;
import com.devops.PersonRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PersonService {
    private final PersonRepository repo;

    public PersonService(PersonRepository repo) {
        this.repo = repo;
    }

    public List<Person> findAll() {
        return repo.findAll();
    }

    public Optional<Person> findById(Long id) {
        return repo.findById(id);
    }

    public Person save(Person person) {
        return repo.save(person);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
