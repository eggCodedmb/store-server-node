const seq = require("./src/db/seq");

const fixDb = async () => {
  try {
    await seq.query("SET FOREIGN_KEY_CHECKS = 0;");
    // Manually make address_id nullable
    await seq.query("ALTER TABLE `orders` MODIFY `address_id` INT NULL;");
    // Manually clean up any dangling references
    await seq.query("UPDATE `orders` SET `address_id` = NULL WHERE `address_id` NOT IN (SELECT `id` FROM `addresses`);");
    await seq.query("SET FOREIGN_KEY_CHECKS = 1;");
    
    // Now try sync
    const { Order } = require("./src/model/index");
    await Order.sync({ alter: true });
    
    console.log("DB fix complete.");
    process.exit(0);
  } catch (error) {
    console.error("DB fix failed:", error);
    process.exit(1);
  }
};

fixDb();
