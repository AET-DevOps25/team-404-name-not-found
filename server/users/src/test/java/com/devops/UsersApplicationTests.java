package com.devops;

import com.devops.entities.users.User;
import com.devops.entities.users.UserRole;
import com.devops.repositories.UserRepository;
import com.devops.services.AuthenticationService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsersApplicationTests {

	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private AuthenticationService authService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void testFindUserByEmailSuccess() {
		User user = new User("test", "test@test.test", "test", UserRole.USER);

		when(userRepository.findByEmail(anyString())).thenReturn(user);

		UserDetails registeredUser = authService.loadUserByUsername("test@test.test");
		List<UserRole> roles = registeredUser.getAuthorities().stream()
				.map(authority -> UserRole.valueOf(authority.getAuthority())).toList();

		assertNotNull(registeredUser);
		assertEquals("test@test.test", registeredUser.getUsername());
		assertEquals("test", registeredUser.getPassword());
		assertTrue(roles.contains(UserRole.USER));
		verify(userRepository).findByEmail(anyString());
	}
}
