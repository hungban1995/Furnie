import yup from "yup";

//----------Register validate----------//
const registerSchema = yup.object().shape({
  username: yup.string().required("User name is required"),
  email: yup.string().required("Email is required").email("Invalid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    await registerSchema.validate({ username, email, password });
    next();
  } catch (err) {
    next({
      status: 400,
      error: err.message,
    });
  }
};

//----------Login validate----------//
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const login = async (req, res, next) => {
  try {
    await loginSchema.validate(req.body);
    next();
  } catch (err) {
    next({
      status: 400,
      error: err.message,
    });
  }
};
