package com.dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dashboard.entity.PairedDevice;

@Repository
public interface PairedDeviceRepository extends JpaRepository<PairedDevice, String> {

}
