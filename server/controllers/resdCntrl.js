import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

export const createResidency = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    country,
    city,
    facilities,
    image,
    userEmail,
  } = req.body.data;

  console.log("Request Body:", req.body.data);

  try {
    // Check if the user exists
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    // If the user does not exist, create a new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          // Add other default fields if necessary
        },
      });
    }

    // Create the residency
    const residency = await prisma.residency.create({
      data: {
        title,
        description,
        price,
        address,
        country,
        city,
        facilities,
        image,
        owner: { connect: { email: userEmail } },
      },
    });

    res.send({ message: "Residency created successfully", residency });
  } catch (err) {
    if (err.code === "P2002") {
      throw new Error("A residency with this address already exists");
    }
    throw new Error(err.message);
  }
});

// function to get all the documents/residencies
export const getAllResidencies = asyncHandler(async (req, res) => {
  try {
    const residencies = await prisma.residency.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.send(residencies);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// function to get a specific document/residency
export const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const residency = await prisma.residency.findUnique({
      where: { id },
    });
    if (!residency) {
      return res.status(404).send({ message: "Residency not found" });
    }
    res.send(residency);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

export const removeResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Remove the residency from all users' booked visits
    await prisma.user.updateMany({
      where: {
        bookedVisits: {
          some: { id }, // Find users who have booked this residency
        },
      },
      data: {
        bookedVisits: {
          set: [], // Clear out the booked visits for that residency
        },
      },
    });

    // Step 2: Delete the residency
    await prisma.residency.delete({
      where: { id },
    });

    res.send({ message: "Residency and its bookings removed successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

