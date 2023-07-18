const express = require('express');
const mongoose = require('mongoose');
const Superuserdetail = require('../modal/SuperUser');
const bcrypt = require("bcryptjs");


// Login function
const SuperUserLogin = async (req, res) => {
  try {
    const { SuperUserEmail, SuperUserpassword } = req.body;
    const superuser = await Superuserdetail.findOne({ SuperUserEmail });

    if (!superuser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(SuperUserpassword, superuser.SuperUserpassword);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json(superuser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Register function
const SuperUserRegister = async (req, res) => {
  try {
    const { SuperUsername, SuperUserEmail, SuperUserpassword } = req.body;

    const existingSuperUser = await Superuserdetail.findOne({ SuperUsername });
    if (existingSuperUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(SuperUserpassword, 10);

    const superuser = new Superuserdetail({
      SuperUsername,
      SuperUserEmail,
      SuperUserpassword: hashedPassword,
    });

    const savedSuperUser = await superuser.save();
    res.status(201).json(savedSuperUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update function
const SuperUserUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const superuser = await Superuserdetail.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!superuser) {
      return res.status(404).json({ error: "Superuser not found" });
    }

    res.status(200).json(superuser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete function
const SuperUserDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const superuser = await Superuserdetail.findByIdAndRemove(id);

    if (!superuser) {
      return res.status(404).json({ error: "Superuser not found" });
    }

    res.status(200).json(superuser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get method
const SuperUserGetById = async (req, res) => {
  try {
    const { id } = req.params;
    const superuser = await Superuserdetail.findById(id).populate("events");

    if (!superuser) {
      return res.status(404).json({ error: "Superuser not found" });
    }

    res.status(200).json(superuser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  SuperUserLogin,
  SuperUserRegister,
  SuperUserUpdate,
  SuperUserDelete,
  SuperUserGetById,
};
