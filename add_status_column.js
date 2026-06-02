
const seq = require('./src/db/seq');
seq.query('ALTER TABLE goods ADD COLUMN status TINYINT NOT NULL DEFAULT 1 COMMENT "商品状态 1-上架中 0-已下架";')
  .then(() => { console.log("Added status column"); process.exit(0); })
  .catch((e) => { 
    if (e.name === "SequelizeDatabaseError" && e.parent.code === 'ER_DUP_FIELDNAME') {
      console.log("Column already exists"); process.exit(0);
    } else {
      console.error(e); process.exit(1); 
    }
  });
  