export default async (modelName) => {
  try {
    // Reset auto-increment value
    await sequelize.query(`ALTER TABLE ${modelName} AUTO_INCREMENT = 1`);
    console.log(`Auto-increment reset for table: ${modelName}`);
  } catch (error) {
    console.error(
      `Failed to reset auto-increment for table: ${modelName}`,
      error
    );
  }
};
