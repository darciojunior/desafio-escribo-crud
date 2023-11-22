import User from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { name, email, password, phones } = req.body;

  if (!name || !email || !password || !phones.number || !phones.ddd)
    throw new BadRequestError("Verifique campos vazios.");
  if (name.length < 3) throw new BadRequestError("Nome é muito curto.");
  if (name.length > 30)
    throw new BadRequestError("Nome não pode ter mais que 30 caracteres.");
  if (password.length < 6) throw new BadRequestError("Senha é muito curta.");
  if (phones.number.length < 8)
    throw new BadRequestError("Telefone muito curto.");

  const emailAlreadyUsed = await User.findOne({ email });
  if (emailAlreadyUsed) throw new BadRequestError("E-mail já existente.");

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashPassword;

  const user = await User.create(req.body);
  const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({
      id: user._id,
      data_criacao: user.createdAt,
      data_atualizacao: user.updatedAt,
      ultimo_login: user.lastLogin,
      token,
    });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequestError("Verifique campos vazios.");

  const user = await User.findOne({ email });
  const isValidUser = user && (await user.comparePassword(password));
  if (!isValidUser)
    throw new UnauthenticatedError("Usuário e/ou senha inválidos.");

  const token = user.createJWT();

  user.lastLogin = Date.now();
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({
      id: user._id,
      data_criacao: user.createdAt,
      data_atualizacao: user.updatedAt,
      ultimo_login: user.lastLogin,
      token,
    });
};

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ user });
};
