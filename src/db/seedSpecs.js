const { SpecGroup, SpecOption } = require("../model/index");

const seedSpecs = async () => {
  try {
    console.log("开始生成通用规格数据...");

    const specsData = [
      {
        name: "杯型",
        options: [
          { name: "中型", price_delta: 0 },
          { name: "大型", price_delta: 3 },
          { name: "特大", price_delta: 6 },
        ],
      },
      {
        name: "甜度",
        options: [
          { name: "不另外加糖", price_delta: 0 },
          { name: "三分糖", price_delta: 0 },
          { name: "五分糖", price_delta: 0 },
          { name: "七分糖", price_delta: 0 },
          { name: "全糖", price_delta: 0 },
        ],
      },
      {
        name: "温度",
        options: [
          { name: "常规冰", price_delta: 0 },
          { name: "少冰", price_delta: 0 },
          { name: "去冰", price_delta: 0 },
          { name: "热", price_delta: 0 },
          { name: "温", price_delta: 0 },
        ],
      },
      {
        name: "加料",
        options: [
          { name: "无", price_delta: 0 },
          { name: "珍珠", price_delta: 2 },
          { name: "椰果", price_delta: 2 },
          { name: "布丁", price_delta: 3 },
          { name: "红豆", price_delta: 2 },
        ],
      },
      {
        name: "奶底",
        options: [
          { name: "标准牛奶", price_delta: 0 },
          { name: "燕麦奶", price_delta: 5 },
          { name: "脱脂奶", price_delta: 2 },
          { name: "厚椰乳", price_delta: 4 },
        ],
      },
    ];

    for (const group of specsData) {
      const createdGroup = await SpecGroup.create({ name: group.name });
      console.log(`已创建规格组: ${group.name}`);
      
      const optionsWithGroupId = group.options.map(opt => ({
        ...opt,
        group_id: createdGroup.id
      }));
      
      await SpecOption.bulkCreate(optionsWithGroupId);
      console.log(`已为 ${group.name} 插入 ${group.options.length} 条选项`);
    }

    console.log("通用规格数据生成完毕！");
    process.exit(0);
  } catch (error) {
    console.error("生成规格数据失败:", error);
    process.exit(1);
  }
};

seedSpecs();
