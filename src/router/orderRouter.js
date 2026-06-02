const Router = require("koa-router");
const { auth, authorize } = require("../middleware/authMiddleware"); // 认证用户
const { validateParams } = require("../middleware/genericMiddleware");
const {
  create,
  findAllOrder,
  deleteOrder,
  updateStatus,
  getOneOrder,
  create_new,
  pay_order,
  getMyOrders,
  calculate,
} = require("../controller/orderController");
const { orderInfoRules } = require("../constant/rules");
const { orderFormError } = require("../constant/errType");

const router = new Router({ prefix: "/order" });

// 价格试算接口 (后端唯一真理)
router.post("/calculate", auth, calculate);

// 益禾堂小程序新接口
router.post("/create_new", auth, create_new);
router.post("/pay", auth, pay_order);
router.get("/my_list", auth, getMyOrders);

router.get(
  "/detail",
  validateParams(
    {
      id: { type: "integer", required: true },
    },
    orderFormError
  ),
  auth,
  getOneOrder
);

// 老接口保留
router.post(
  "/create",
  validateParams(orderInfoRules, orderFormError),
  auth,
  create
);

router.post("/", auth, authorize("/order", "POST"), findAllOrder);
router.delete(
  "/:id",
  validateParams(
    {
      id: { type: "integer", required: true },
    },
    orderFormError
  ),
  auth,
  authorize("/order/:id", "DELETE"),
  deleteOrder
);

router.get(
  "/:id",
  validateParams(
    {
      id: { type: "integer", required: true },
    },
    orderFormError
  ),
  auth,
  getOneOrder
);
router.patch("/:id", auth, authorize("/order/:id", "PATCH"), updateStatus);

module.exports = router;
