import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";
const client = new PrismaClient();

export const updateProfile = async (req, res) => {
  const {
    firstName,
    lastName,
    emailAddress,
    username,
    previousPassword,
    newPassword,
    confirmNewPassword
  } = req.body;

  const userId = req.user.id;

  try {
    const user = await client.user.findUnique({ where: { id: userId } });

    if (previousPassword || newPassword || confirmNewPassword) {
      if (!previousPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: "All password fields are required" });
      }

      const match = await bcrypt.compare(previousPassword, user.password);
      if (!match) {
        return res.status(401).json({ message: "Previous password is incorrect" });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "New passwords do not match" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await client.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
    }

    const updatedUser = await client.user.update({
      where: { id: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(emailAddress && { emailAddress }),
        ...(username && { username }),
      },
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        emailAddress: updatedUser.emailAddress,
        username: updatedUser.username,
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};
