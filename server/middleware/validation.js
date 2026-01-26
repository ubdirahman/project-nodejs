const Joi = require('joi');

const customerSchema = Joi.object({
  customer_name: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().allow('', null)
});

const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().required(),
  stock: Joi.number().integer().min(0).required()
});

const saleSchema = Joi.object({
  product: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required()
});

const debtSchema = Joi.object({
  customer: Joi.string().required(),
  product: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required(),
  status: Joi.string().valid('pending', 'paid', 'unpaid').default('unpaid')
});

const registerSchema = Joi.object({
  full_name: Joi.string().required(),
  phone: Joi.string().required(),
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').default('user')
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};

module.exports = {
  validate,
  customerSchema,
  productSchema,
  saleSchema,
  debtSchema,
  registerSchema,
  loginSchema,
  debtUpdateSchema: Joi.object({
    customer: Joi.string(),
    product: Joi.string(),
    quantity: Joi.number().integer().min(1),
    price: Joi.number().min(0),
    status: Joi.string().valid('pending', 'paid', 'unpaid'),
    amount: Joi.number().min(0)
  })
};
