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
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return res.status(404).send({ message: `No User found with email: ${userEmail}` });
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
      return res.status(400).send({ message: "A residency with this address already exists" });
    }
    res.status(500).send({ message: err.message });
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
    // Step 1: Find all users who have booked this residency
    const usersWithBooking = await prisma.user.findMany({
      where: {
        bookedVisits: {
          hasSome: [{ id }], // Use `hasSome` instead of `some`
        },
      },
    });

    // Step 2: Remove the residency from the bookedVisits array of each user
    for (const user of usersWithBooking) {
      const updatedBookedVisits = user.bookedVisits.filter(
        (visit) => visit.id !== id
      );

      await prisma.user.update({
        where: { id: user.id },
        data: {
          bookedVisits: updatedBookedVisits,
        },
      });
    }

    // Step 3: Delete the residency
    await prisma.residency.delete({
      where: { id },
    });

    res.send({ message: "Residency removed successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});