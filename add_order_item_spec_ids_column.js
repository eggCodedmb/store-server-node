
const seq = require('./src/db/seq');
seq.query('ALTER TABLE order_items ADD COLUMN spec_ids VARCHAR(255) NULL COMMENT "规格ID列表 (逗号分隔)";')
  .then(() => { console.log("Added spec_ids column to order_items table"); process.exit(0); })
  .catch((e) => { 
    if (e.name === "SequelizeDatabaseError" && e.parent.code === 'ER_DUP_FIELDNAME') {
      console.log("Column already exists"); process.exit(0);
    } else {
      console.error(e); process.exit(1); 
    }
  });
  