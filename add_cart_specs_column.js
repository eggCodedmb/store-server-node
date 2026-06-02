
const seq = require('./src/db/seq');
seq.query('ALTER TABLE carts ADD COLUMN specs VARCHAR(255) NULL COMMENT "规格快照 (JSON 或字符串)";')
  .then(() => { console.log("Added specs column to carts table"); process.exit(0); })
  .catch((e) => { 
    if (e.name === "SequelizeDatabaseError" && e.parent.code === 'ER_DUP_FIELDNAME') {
      console.log("Column already exists"); process.exit(0);
    } else {
      console.error(e); process.exit(1); 
    }
  });
  