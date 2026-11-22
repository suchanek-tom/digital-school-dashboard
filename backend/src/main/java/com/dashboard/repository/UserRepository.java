package com.dashboard.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dashboard.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByUid(@Param("uid") String uid);

    Optional<User> findByEmail(@Param("email") String email);

    Optional<User> findByUsernameIgnoreCase(String username);

    boolean existsByEmail(@Param("email") String email);
}
