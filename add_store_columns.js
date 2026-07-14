
const seq = require('./src/db/seq');

const migrations = [
  'ALTER TABLE stores ADD COLUMN status TINYINT NOT NULL DEFAULT 1 COMMENT "门店状态(1=营业中, 0=已关闭)"',
  'ALTER TABLE stores ADD COLUMN province VARCHAR(100) DEFAULT NULL COMMENT "省"',
  'ALTER TABLE stores ADD COLUMN city VARCHAR(100) DEFAULT NULL COMMENT "市"',
  'ALTER TABLE stores ADD COLUMN district VARCHAR(100) DEFAULT NULL COMMENT "区/县"',
  'ALTER TABLE stores ADD COLUMN cover VARCHAR(500) DEFAULT NULL COMMENT "门店封面图"',
  `CREATE TABLE IF NOT EXISTS store_photos (
    id INTEGER NOT NULL AUTO_INCREMENT,
    store_id INTEGER NOT NULL COMMENT "所属门店ID",
    url VARCHAR(500) NOT NULL COMMENT "图片URL",
    sort_order INTEGER DEFAULT 0 COMMENT "排序",
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT="门店照片表"`,
];

(async () => {
  for (const sql of migrations) {
    try {
      await seq.query(sql);
      console.log("OK:", sql.substring(0, 60) + "...");
    } catch (e) {
      if (e.name === "SequelizeDatabaseError" && (e.parent.code === 'ER_DUP_FIELDNAME' || e.parent.errno === 1060)) {
        console.log("Already exists:", sql.substring(0, 60) + "...");
      } else if (e.original && e.original.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log("Table already exists, skipping.");
      } else {
        console.error("Error:", e.message);
      }
    }
  }
  console.log("Migration complete");
  process.exit(0);
})();
