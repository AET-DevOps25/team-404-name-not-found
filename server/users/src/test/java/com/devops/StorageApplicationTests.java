package com.devops;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import com.devops.Person;
import com.devops.PersonRepository;

import java.util.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StorageApplicationTests {

	@Mock
	PersonRepository repo;

	@InjectMocks
	PersonService service;

	@Test
	void findAll_shouldReturnList() {
		List<Person> list = List.of(new Person(1L, "A", 20), new Person(2L, "B", 22));
		when(repo.findAll()).thenReturn(list);

		List<Person> result = service.findAll();

		assertThat(result).hasSize(2);
		verify(repo).findAll();
	}
}
